// Shared naming, ordering and indexes for capture and existing-image migration.
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
export const groups = {
  common:{label:'Common Screens',doc:'COMMON_SCREENS.md',scope:'Sign-in, passwords and system states'},
  admin:{label:'Admin',doc:'ADMIN_SCREENS.md',scope:'Account administration and permissions'},
  warehouse_staff:{label:'Warehouse Staff',doc:'WAREHOUSE_STAFF_SCREENS.md',scope:'Inventory, receipts, sales, counts and records'},
  planner:{label:'Inventory Planner',doc:'PLANNER_SCREENS.md',scope:'Demand, alerts, proposals, catalog and records'},
  manager:{label:'Manager',doc:'MANAGER_SCREENS.md',scope:'Dashboard and proposal decisions'}
};
const commonIds=['password','temporary-password','reset-data','access-denied','not-found'];
const order={
  common:['login','login-error',...commonIds],
  admin:['users','users-filter','users-empty','user-new','user-edit','user-self','reset-password'],
  warehouse_staff:['inventory','inventory-empty','product','product-no-history','receipt','receipt-error','receipt-success','sale','backorder-delivery','sale-error','sale-success','count','count-success','orders','orders-detail','orders-empty','orders-completed','backorders','backorders-detail','backorders-empty','backorders-completed'],
  planner:['inventory','inventory-empty','product','product-no-history','demand','demand-missing','demand-date-error','demand-empty','alerts','alert','alert-sufficient','alert-missing','proposals','proposals-draft','proposals-pending','proposals-approved','proposals-rejected','proposals-empty','draft-new','draft','draft-add-product','draft-over-budget','draft-ai-explain','draft-ai-suggest','draft-ai-applied','draft-ai-error','draft-submitted','proposal-pending','proposal-approved','proposal-rejected','draft-copied','catalog','product-new','product-edit','supplier-new','supplier-edit','orders','orders-detail','orders-new','orders-cancel','orders-empty','orders-completed','backorders','backorders-detail','backorders-new','backorders-cancel','backorders-empty','backorders-completed'],
  manager:['dashboard','proposals','proposals-pending','proposals-approved','proposals-rejected','proposals-empty','proposal-pending','reject-dialog','approved-result','rejected-result','proposal-approved','proposal-rejected','draft-denied']
};
export function organizeScenes(scenes) {
  const selected=scenes.filter(s=>!commonIds.includes(s.id)||s.role===(['access-denied','not-found'].includes(s.id)?'staff':'admin'));
  const result=selected.map(s=>{
    const folder=s.role==='public'||commonIds.includes(s.id)?'common':s.role==='staff'?'warehouse_staff':s.role;
    const index=order[folder].indexOf(s.id);
    if(index<0)throw Error(`Missing gallery order: ${folder}/${s.id}`);
    const number=index+1;
    return {...s,folder,number,file:`${folder}/${String(number).padStart(2,'0')}-${s.id}.png`,roles:folder==='common'?(s.role==='public'?['unauthenticated']:['admin','warehouse_staff','planner','manager']):[folder]};
  });
  if(new Set(result.map(s=>s.file)).size!==result.length)throw Error('Duplicate gallery filename');
  return result.sort((a,b)=>Object.keys(groups).indexOf(a.folder)-Object.keys(groups).indexOf(b.folder)||a.number-b.number);
}
const titles = {
  login:'Sign in','login-error':'Sign-in failure',password:'Change password','temporary-password':'Required temporary-password change',
  'reset-data':'Confirm sample-data reset','access-denied':'Access denied','not-found':'Content not found',
  users:'Account list','users-filter':'Filter accounts by role and status','users-empty':'Account search — no results',
  'user-new':'Create account','user-edit':'Edit account, status and role','user-self':'Edit own account','reset-password':'Issue temporary password',
  inventory:'Inventory','inventory-empty':'Product search — no results',product:'Product details','product-no-history':'Product without movement history',
  receipt:'Receive goods','receipt-error':'Receipt exceeds outstanding quantity','receipt-success':'Receipt saved',sale:'Direct sale',
  'backorder-delivery':'Deliver a customer backorder','sale-error':'Sale exceeds on-hand stock','sale-success':'Direct sale saved',
  count:'Physical stock count','count-success':'Stock count saved',demand:'Demand analysis','demand-missing':'Demand analysis — missing data',
  'demand-date-error':'Invalid date range','demand-empty':'Sales history — no results',alerts:'Replenishment alerts',
  alert:'Replenishment basis — stock needed','alert-sufficient':'Replenishment basis — sufficient stock','alert-missing':'Replenishment basis — missing data',
  proposals:'Proposal list','proposals-empty':'Empty proposal list','draft-new':'Create an empty proposal',draft:'Edit draft',
  'draft-add-product':'Add a product to the draft','draft-over-budget':'Draft exceeds budget','draft-ai-explain':'AI calculation explanation',
  'draft-ai-suggest':'AI quantity suggestions — not applied','draft-ai-applied':'AI suggestions applied','draft-ai-error':'AI unavailable',
  'draft-submitted':'Proposal submitted','draft-copied':'Copy a rejected proposal',catalog:'Products and suppliers',
  'product-new':'Add product','product-edit':'Edit product and stock policy','supplier-new':'Add supplier','supplier-edit':'Edit supplier',
  dashboard:'Inventory dashboard','reject-dialog':'Enter rejection reason','approved-result':'Approval result','rejected-result':'Rejection result',
  'draft-denied':'Planner draft access denied'
};
const states={draft:'Draft',pending:'Pending',approved:'Approved',rejected:'Rejected'};
function englishTitle(s) {
  if(titles[s.id])return titles[s.id];
  const [prefix,suffix]=s.id.split('-');
  if(prefix==='proposals'&&states[suffix])return `Filter proposals — ${states[suffix]}`;
  if(prefix==='proposal'&&states[suffix])return `Proposal details — ${states[suffix]}`;
  if(['orders','backorders'].includes(prefix)) {
    const label=prefix==='orders'?'Placed orders':'Customer backorders';
    const suffixes={detail:'Details',empty:'Empty list',completed:'Completed',new:'Create record',cancel:'Cancel outstanding quantity'};
    if(!suffix)return label;
    if(suffixes[suffix])return `${label} — ${suffixes[suffix]}`;
  }
  throw Error(`Missing English screenshot title: ${s.id}`);
}
// Keep capture metadata and UI language unchanged; translate documentation only.
const kinds={'Màn hình':'Screen','Trạng thái':'State','Hộp thoại':'Dialog','Chặn quyền':'Access restriction','Kết quả':'Result'};
export async function writeGallery(out, screenshots) {
  for(const s of screenshots)await access(path.join(out,s.file));
  for(const [folder,g] of Object.entries(groups)) {
    await mkdir(path.join(out,folder),{recursive:true});
    const entries=screenshots.filter(s=>s.folder===folder);
    const lines=[`# ${g.label} — Screen Catalog`,'','[← Screenshot index](../SCREENSHOT_INDEX.md)'];
    if(folder==='common')lines.push('','Sign-in screens are for users without a session. The remaining screens are shared by all four roles and use one representative role, so account names and navigation may differ. Access-denied images illustrate permission boundaries, not granted functions.');
    else lines.push('', '[Common screens](../common/COMMON_SCREENS.md): sign-in, password changes, temporary passwords, sample-data reset confirmation and system states.');
    lines.push('','Full-page desktop screenshots at 1440 × 1000, numbered by functional flow. Documentation is in English; screenshot contents remain in Vietnamese.','','| No. | Screen | Type | Route |','|---:|---|---|---|',...entries.map(s=>`| ${String(s.number).padStart(2,'0')} | [${englishTitle(s)}](${path.basename(s.file)}) | ${kinds[s.kind]||s.kind} | \`#${s.route}\` |`),'');
    await writeFile(path.join(out,folder,g.doc),lines.join('\n'));
  }
  const index=['# StockMate — Screenshot Index','','[Walkthrough — 10 representative images](../../UI_UX_WALKTHROUGH.md) · [Capture instructions](../README.md#verification-and-screenshot-capture)','','Select a group to browse its catalog and open individual images. Numbering starts at 01 in each folder and follows the functional flow. Shared screens use one representative image in `common`. Documentation is in English; the interface and screenshot contents remain in Vietnamese.','','| Group | Images | Coverage |','|---|---:|---|',...Object.entries(groups).map(([folder,g])=>`| [${g.label}](./${folder}/${g.doc}) | ${screenshots.filter(s=>s.folder===folder).length} | ${g.scope} |`),'','Each role catalog links to the common screens. Screens with different layouts or actions by role remain separate, even when their routes match. Access-restriction images show operations the role cannot access.','','The gallery covers pages, forms, dialogs and key states using representative data, rather than every SKU, input combination or mobile size. Empty lists, completed records and temporary-password states use isolated fixtures; other actions run through the UI. The 10 representative images in the gallery root remain available for the walkthrough.','','[Image and access manifest](./roles-manifest.json) · [Prototype guide](../README.md)',''];
  await writeFile(path.join(out,'SCREENSHOT_INDEX.md'),index.join('\n'));
  await writeFile(path.join(out,'roles-manifest.json'),JSON.stringify({viewport:{width:1440,height:1000},fixtureDate:'2026-11-02',total:screenshots.length,screenshots},null,2)+'\n');
}
