import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const spec=JSON.parse(await fs.readFile(path.join(dir,'openapi.json'),'utf8'));
const errors=[];
const assert=(ok,msg)=>{if(!ok)errors.push(msg);};
assert(spec.openapi==='3.0.3','Expected OpenAPI 3.0.3');
assert(spec.info.title==='StockMate API' && spec.info.version==='2.0.0','Expected StockMate v2');
function resolve(ref){
  assert(ref.startsWith('#/'),'External ref not checked: '+ref);
  let value=spec;
  for(const p of ref.slice(2).split('/')) value=value?.[p.replaceAll('~1','/').replaceAll('~0','~')];
  assert(value!==undefined,'Unresolved '+ref);
  return value;
}
function walk(v,p='root'){
  if(!v || typeof v!=='object')return;
  if(v.$ref)resolve(v.$ref);
  if(v.type==='object' && v.properties){
    for(const key of v.required??[])assert(key in v.properties,p+': unknown required '+key);
  }
  if(v.minimum!==undefined && v.maximum!==undefined) assert(v.minimum<=v.maximum,p+': invalid range');
  for(const [k,x] of Object.entries(v))walk(x,p+'.'+k);
}
walk(spec);
let count=0; const ids=new Set();
for(const [p,item] of Object.entries(spec.paths)){
  for(const [method,op] of Object.entries(item)){
    count++;
    assert(!ids.has(op.operationId),'Duplicate operationId '+op.operationId); ids.add(op.operationId);
    assert(op['x-roles']?.length>0,p+': missing roles');
    const expected=[...p.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
    const actual=(op.parameters??[]).filter(x=>x.in==='path').map(x=>{assert(x.required,p+': path param optional');return x.name;}).sort();
    assert(JSON.stringify(expected)===JSON.stringify(actual),p+': path params mismatch');
    assert(Object.keys(op.responses).some(x=>/^2\d\d$/.test(x)),p+': no success response');
    if(method!=='get')assert(op.parameters.some(x=>x.name==='Idempotency-Key'),p+': no idempotency');
    else assert(!op.requestBody,p+': GET has body');
    if(op.requestBody)assert(op.requestBody.required,p+': optional write body');
  }
}
function validate(s,value,p){
  if(s.$ref)return validate(resolve(s.$ref),value,p);
  if(value===null){assert(s.nullable===true,p+': unexpected null');return;}
  if(s.enum)assert(s.enum.includes(value),p+': invalid enum');
  if(s.type==='object'){
    assert(typeof value==='object' && !Array.isArray(value),p+': expected object');
    if(!value || typeof value!=='object')return;
    for(const key of s.required??[]) assert(key in value,p+': missing '+key);
    for(const [k,v]of Object.entries(value)){
      if(s.properties?.[k])validate(s.properties[k],v,p+'.'+k);
      else assert(s.additionalProperties!==false,p+': unknown '+k);
    }
  }else if(s.type==='array'){
    assert(Array.isArray(value),p+': expected array');
    assert(value.length>=(s.minItems??0),p+': too few items');
    assert(value.length<=(s.maxItems??Infinity),p+': too many items');
    value.forEach((x,i)=>validate(s.items,x,p+'['+i+']'));
  }else{
    if(s.type==='string')assert(typeof value==='string',p+': expected string');
    if(s.type==='integer')assert(Number.isSafeInteger(value),p+': expected safe integer');
    if(s.type==='number')assert(typeof value==='number',p+': expected number');
    if(s.type==='boolean')assert(typeof value==='boolean',p+': expected boolean');
    if(s.minimum!==undefined)assert(value>=s.minimum,p+': below minimum');
    if(s.maximum!==undefined)assert(value<=s.maximum,p+': above maximum');
    if(s.minLength!==undefined)assert(value.length>=s.minLength,p+': too short');
  }
}
let examples=0;
for(const [name,schema]of Object.entries(spec.components.schemas)){
  if(schema.example){validate(schema,schema.example,name+'.example');examples++;}
}
validate(spec.components.schemas.Inventory.properties.inventory_position,-10,'negative position');
validate(spec.components.schemas.Inventory.properties.policy,null,'missing policy');

// Parse only the emitted YAML subset: quoted JSON keys/scalars, block mappings/sequences.
// This roundtrip is not a replacement for a full external OpenAPI validator.
const lines=(await fs.readFile(path.join(dir,'openapi.yaml'),'utf8')).trimEnd().split(/\r?\n/);
let index=0;
const indent=line=>line.length-line.trimStart().length;
function parseBlock(level){
  const sequence=lines[index].trimStart().startsWith('-');
  const result=sequence?[]:{};
  while(index<lines.length && indent(lines[index])===level){
    const text=lines[index].trimStart();
    if(sequence){
      assert(text.startsWith('-'),'YAML expected sequence at '+index);
      const tail=text.slice(1).trim(); index++;
      result.push(tail?JSON.parse(tail):parseBlock(level+2));
    }else{
      const m=text.match(/^("(?:\\.|[^"\\])*"):(.*)$/);
      if(!m)throw new Error('YAML mapping parse failed at '+index);
      const key=JSON.parse(m[1]),tail=m[2].trim(); index++;
      result[key]=tail?JSON.parse(tail):parseBlock(level+2);
    }
  }
  return result;
}
const parsed=parseBlock(0);
assert(index===lines.length,'Unparsed YAML tail');
assert(JSON.stringify(parsed)===JSON.stringify(spec),'YAML/JSON mismatch');
assert(!('patch' in spec.paths['/inventory/{productId}']),'Legacy arbitrary inventory PATCH still exists');
assert(spec.paths['/proposals/{proposalId}/submit'].post['x-roles'].join()==='INVENTORY_PLANNER','Submit role');
assert(spec.paths['/ai/draft-requests'].post['x-roles'].join()==='INVENTORY_PLANNER','AI role');
assert(spec.paths['/auth/login'].post.security.length===0,'Login must be public');
assert(spec.paths['/users'].post['x-roles'].join()==='ADMIN','Create user is Admin only');
assert(!('delete' in spec.paths['/users/{userId}']),'No hard-delete users');
assert(spec.components.schemas.User.properties.role.enum.includes('ADMIN'),'Admin role');
assert(!spec.components.schemas.User.properties.password_hash,'Password hash must not be exposed');
assert(spec.components.schemas.UserCreateInput.properties.temporary_password.writeOnly,'Temporary password is write only');
assert(spec.paths['/auth/change-password'].post['x-roles'].includes('ADMIN'),'Admin can change own password');
if(errors.length)throw new Error(errors.join('\n'));
console.log(JSON.stringify({result:'PASS',paths:Object.keys(spec.paths).length,operations:count,schemas:Object.keys(spec.components.schemas).length,requestExamples:examples,checks:['internal refs','required fields','operation IDs','path parameters','roles/idempotency','request examples','signed position/null policy','YAML subset roundtrip matches JSON']},null,2));
