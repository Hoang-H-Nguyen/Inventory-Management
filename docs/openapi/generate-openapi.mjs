import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const S = {};
const ref = name => ({ $ref: '#/components/schemas/' + name });
const str = (description, extra = {}) => ({ type: 'string', ...(description ? {description} : {}), ...extra });
const int = (min = 0, extra = {}) => ({type:'integer', minimum:min, maximum:2147483647, ...extra});
const id = () => ({type:'integer', format:'int64', minimum:1, maximum:9007199254740991});
const money = () => int(0, {maximum:9007199254740991, description:'Integer VND; reject multiplication/sum overflow.'});
const dec = () => ({type:'number', minimum:0, multipleOf:0.000001});
const bool = () => ({type:'boolean'});
const date = () => str('', {format:'date'});
const time = () => str('', {format:'date-time'});
const en = (...values) => str('', {enum:values});
const arr = (items, extra = {}) => ({type:'array', items, ...extra});
const nullable = schema => schema.$ref ? {...S[schema.$ref.split('/').at(-1)], nullable:true} : {...schema, nullable:true};
const obj = (properties, required=Object.keys(properties), extra={}) => ({type:'object', properties, required, additionalProperties:false, ...extra});
const nonempty = () => str('', {minLength:1, maxLength:500});
const version = () => int(1);
const roles = {admin:['ADMIN'], staff:['WAREHOUSE_STAFF'], planner:['INVENTORY_PLANNER'], manager:['MANAGER'], stock:['WAREHOUSE_STAFF','INVENTORY_PLANNER'], proposal:['INVENTORY_PLANNER','MANAGER'], all:['ADMIN','WAREHOUSE_STAFF','INVENTORY_PLANNER','MANAGER']};
const paths = {};
const query = (name,schema,required=false,description='') => ({name,in:'query',required,schema,description});
const pathParam = name => ({name,in:'path',required:true,schema:id()});
const paging = [query('page',int(1,{default:1})),query('page_size',int(1,{default:20,maximum:100})),query('search',str())];
const idem = {name:'Idempotency-Key',in:'header',required:false,schema:str('',{minLength:1,maxLength:128}),description:'Replay same actor/route/key and payload returns prior result; changed payload returns 409.'};
const standardErrors = {
  '400':'Malformed request/query or unknown input field.',
  '401':'Missing/invalid/expired/revoked token, invalid credentials or inactive user.',
  '403':'Role/ownership forbidden or PASSWORD_CHANGE_REQUIRED.',
  '404':'Resource absent or not visible, including hidden drafts.',
  '409':'VERSION_CONFLICT, INVALID_STATE, DUPLICATE_REFERENCE, IDEMPOTENCY_CONFLICT, CALCULATION_CHANGED, or APPROVED_QUANTITY_EXCEEDED.',
  '422':'Validation, MISSING_DATA, OVER_BUDGET, INSUFFICIENT_STOCK, EXCEEDS_REMAINING, or AMOUNT_OVERFLOW.',
  '500':'Unexpected server error; recover an idempotent request using its key.'
};
const bodyContent = schema => ({'application/json':{schema}});
function op(p,method,operationId,summary,role,result,body,description='',params=[]) {
  const mutation = method !== 'get';
  const status = method === 'post' && /^(create|copy)/.test(operationId) ? '201' : '200';
  const responses = {[status]:{description:'Successful response.',content:bodyContent(ref(result))}};
  for(const [s,d] of Object.entries(standardErrors)) responses[s]={description:d,content:bodyContent(ref('Error'))};
  const item = {operationId,summary,tags:[p.split('/')[1]],'x-roles':roles[role],description,parameters:[...Array.from(p.matchAll(/\{(\w+)\}/g),m=>pathParam(m[1])),...params,...(mutation?[idem]:[])],responses};
  if(body) item.requestBody={required:true,content:bodyContent(ref(body))};
  paths[p] ??= {}; paths[p][method]=item;
}
const list = name => {
  S[name+'List']=obj({items:arr(ref(name)),pagination:ref('Pagination')});
  return name+'List';
};

S.Pagination=obj({page:int(1),page_size:int(1,{maximum:100}),total_items:int(),total_pages:int()});
S.Error=obj({code:str(),message:str(),field_errors:arr(obj({field:str(),message:str()})),current_version:version(),current_calculation:ref('Calculation')},['code','message']);
S.User=obj({id:id(),username:str(),full_name:str(),role:en(...roles.all),is_active:bool(),must_change_password:bool(),created_at:time(),updated_at:time()});


S.LoginInput=obj({username:str('Case-insensitive; trim and normalize to lowercase.',{minLength:3,maxLength:32,pattern:'^[A-Za-z0-9._-]+$'}),password:str('',{minLength:8,maxLength:128,writeOnly:true})});
S.AuthSession=obj({access_token:str('Opaque revocable bearer token. Never log or persist in URLs.'),token_type:en('Bearer'),expires_in:int(1,{maximum:28800,example:28800}),user:ref('User')});
S.ChangePasswordInput=obj({current_password:str('',{minLength:8,maxLength:128,writeOnly:true}),new_password:str('Must differ from current password.',{minLength:8,maxLength:128,writeOnly:true})});
S.UserCreateInput=obj({username:S.LoginInput.properties.username,full_name:str('',{minLength:1,maxLength:120}),role:en(...roles.all),temporary_password:str('',{minLength:8,maxLength:128,writeOnly:true})});
S.UserUpdateInput=obj({full_name:str('',{minLength:1,maxLength:120}),role:en(...roles.all),is_active:bool()});
S.ResetPasswordInput=obj({temporary_password:str('',{minLength:8,maxLength:128,writeOnly:true})});
S.Message=obj({message:str()});
S.Product=obj({id:id(),sku:str(),name:str(),unit:str(),is_active:bool(),version:version()});
S.ProductInput=obj({sku:nonempty(),name:nonempty(),unit:nonempty()});
S.ProductUpdate=obj({version:version(),name:nonempty(),is_active:bool()});
S.Supplier=obj({id:id(),code:str(),name:str(),is_active:bool(),version:version()});
S.SupplierInput=obj({code:nonempty(),name:nonempty()});
S.SupplierUpdate=obj({version:version(),name:nonempty(),is_active:bool()});
S.SupplierProduct=obj({id:id(),product_id:id(),supplier_id:id(),unit_price_vnd:money(),is_active:bool(),updated_at:time(),version:version()});
S.SupplierProductInput=obj({supplier_id:id(),unit_price_vnd:money(),is_active:bool()});
S.SupplierProductUpdate=obj({version:version(),unit_price_vnd:money(),is_active:bool()});
S.Policy=obj({product_id:id(),lead_time_days:int(),safety_stock:int(),target_stock:int(),version:version()});
S.PolicyInput=obj({version:int(0,{description:'0 when creating policy; otherwise current policy version.'}),lead_time_days:int(),safety_stock:int(),target_stock:int()});
S.Inventory=obj({product:ref('Product'),quantity_on_hand:int(),quantity_on_order:int(),backorders:int(),inventory_position:int(-9007199254740991,{maximum:9007199254740991}),updated_at:time(),version:version(),policy:nullable(ref('Policy')),data_status:en('COMPLETE','MISSING_DATA'),missing_fields:arr(str())});
S.StockMovement=obj({id:id(),product_id:id(),type:en('RECEIPT','SALE','ADJUSTMENT'),quantity_delta:int(-2147483648),quantity_before:int(),quantity_after:int(),placed_order_id:nullable(id()),backorder_id:nullable(id()),actor_id:id(),reason:nullable(str()),reference:str(),created_at:time()});
S.MovementResult=obj({movement:ref('StockMovement'),inventory:ref('Inventory')});
S.StockCountInput=obj({inventory_version:version(),counted_quantity:int(),reason:nonempty(),reference:nonempty()});
S.SaleInput=obj({inventory_version:version(),quantity:int(1),reference:nonempty()});
S.OrderInput=obj({reference:nonempty(),product_id:id(),supplier_product_id:id(),ordered_quantity:int(1),inventory_version:version(),proposal_item_id:id()},['reference','product_id','supplier_product_id','ordered_quantity','inventory_version']);
S.BackorderInput=obj({reference:nonempty(),product_id:id(),requested_quantity:int(1),inventory_version:version()});
const status = () => en('OPEN','PARTIAL','COMPLETED','CANCELLED','CLOSED');
S.PlacedOrder=obj({id:id(),reference:str(),product_id:id(),supplier_product_id:id(),proposal_item_id:nullable(id()),ordered_quantity:int(1),received_quantity:int(),cancelled_quantity:int(),remaining_quantity:int(),status:status(),created_by:id(),created_at:time(),version:version()});
S.Backorder=obj({id:id(),reference:str(),product_id:id(),requested_quantity:int(1),fulfilled_quantity:int(),cancelled_quantity:int(),remaining_quantity:int(),status:status(),created_by:id(),created_at:time(),version:version()});
S.PartialInput=obj({version:version(),inventory_version:version(),quantity:int(1),reference:nonempty()});
S.CancelInput=obj({version:version(),inventory_version:version(),quantity:int(1),reason:nonempty()});
S.OrderMutation=obj({order:ref('PlacedOrder'),inventory:ref('Inventory'),movement:nullable(ref('StockMovement'))});
S.BackorderMutation=obj({backorder:ref('Backorder'),inventory:ref('Inventory'),movement:nullable(ref('StockMovement'))});
S.SalesDay=obj({sales_date:date(),quantity_sold:int(),is_complete:bool(),version:version()});
S.Demand=obj({product_id:id(),window_start:date(),window_end:date(),observed_days:int(0,{maximum:30}),average_daily_demand:nullable(dec()),status:en('COMPLETE','MISSING_DATA'),missing_dates:arr(date())});
S.LowStock=obj({inventory:ref('Inventory'),demand:ref('Demand'),lead_time_days:nullable(int()),safety_stock:nullable(int()),target_stock:nullable(int()),reorder_point:nullable(dec()),suggested_quantity:nullable(int()),status:en('REPLENISH','SUFFICIENT','MISSING_DATA'),missing_fields:arr(str()),checked_at:time()});
S.LowStockList=obj({items:arr(ref('LowStock')),pagination:ref('Pagination'),missing_data_skus:int(),checked_at:time()});
S.Run=obj({id:id(),business_date:date(),window_start:date(),window_end:date(),trigger:en('DAILY','MANUAL'),status:en('RUNNING','COMPLETED','FAILED'),missing_data_count:int(),started_at:time(),finished_at:nullable(time())});
S.Dashboard=obj({total_skus:int(),replenishment_skus:int(),missing_data_skus:int(),pending_proposals:int(),last_run:nullable(ref('Run'))});
S.DraftItemInput=obj({product_id:id(),supplier_product_id:id(),target_stock:int(),selected_quantity:int()});
S.DraftInput=obj({budget_vnd:money(),items:arr(ref('DraftItemInput'),{minItems:1,maxItems:100})});
S.DraftUpdate=obj({version:version(),budget_vnd:money(),items:arr(ref('DraftItemInput'),{minItems:1,maxItems:100})});
S.LineCalculation=obj({
  product_id:id(),sku:str(),product_name:str(),unit:str(),supplier_product_id:id(),supplier_id:id(),supplier_name:str(),
  supplier_price_version:nullable(version()),policy_version:nullable(version()),inventory_version:nullable(version()),price_updated_at:nullable(time()),unit_price_vnd:nullable(money()),
  stock_on_hand:nullable(int()),stock_on_order:nullable(int()),backorders:nullable(int()),inventory_position:nullable(int(-9007199254740991,{maximum:9007199254740991})),
  window_start:date(),window_end:date(),observed_days:int(0,{maximum:30}),average_daily_demand:nullable(dec()),lead_time_days:nullable(int()),
  safety_stock:nullable(int()),target_stock:int(),reorder_point:nullable(dec()),suggested_quantity:nullable(int()),
  selected_quantity:int(),line_total_vnd:nullable(money()),status:en('COMPLETE','MISSING_DATA'),missing_fields:arr(str())
});
S.Calculation=obj({as_of:time(),window_start:date(),window_end:date(),currency:en('VND'),budget_vnd:money(),total_vnd:nullable(money()),over_budget_vnd:nullable(money()),status:en('COMPLETE','MISSING_DATA'),can_submit:bool(),blocking_reasons:arr(str()),fingerprint:nullable(str()),items:arr(ref('LineCalculation'),{minItems:1,maxItems:100})});
S.ProposalItem=obj({id:id(),product_id:id(),supplier_product_id:id(),target_stock:int(),selected_quantity:int(),calculation:ref('LineCalculation')});
S.Proposal=obj({id:id(),proposal_code:str(),status:en('DRAFT','PENDING','APPROVED','REJECTED'),created_by:id(),reviewed_by:nullable(id()),source_proposal_id:nullable(id()),budget_vnd:money(),currency:en('VND'),total_vnd:nullable(money()),items:arr(ref('ProposalItem'),{minItems:1,maxItems:100}),calculation:ref('Calculation'),created_at:time(),submitted_at:nullable(time()),reviewed_at:nullable(time()),rejection_reason:nullable(str()),version:version()});
S.SubmitInput=obj({version:version(),expected_calculation_fingerprint:nonempty()});
S.ReviewInput=obj({version:version()});
S.RejectInput=obj({version:version(),rejection_reason:nonempty()});
S.AuditEvent=obj({id:id(),entity_type:str(),entity_id:id(),action:str(),actor_id:nullable(id()),source:en('FORM','AI','SYSTEM'),before:{type:'object',additionalProperties:true},after:{type:'object',additionalProperties:true},reason:nullable(str()),reference:nullable(str()),ai_request_id:nullable(id()),created_at:time()});
S.AIInput=obj({prompt:str('',{minLength:1,maxLength:4000}),proposal_id:id(),expected_version:version()},['prompt']);
S.AIResult=obj({id:id(),status:en('COMPLETED','NEEDS_CLARIFICATION','FAILED'),proposal_id:nullable(id()),proposal_version:nullable(version()),message:str(),changed_fields:arr(str()),tool_calls:arr(obj({name:str(),status:en('SUCCEEDED','FAILED')})),error_code:nullable(str()),created_at:time()});

op('/me','get','getMe','Current identity','all','User',null,'Bearer token mapped to active user; identity and roles are server-owned.');
op('/products','get','listProducts','Search products','stock',list('Product'),null,'Read catalog; Staff uses names/units for stock workflows.',paging);
op('/products','post','createProduct','Create product','planner','Product','ProductInput','Also create the product inventory record. Stock changes are recorded separately.');
op('/products/{productId}','get','getProduct','Product details','stock','Product');
op('/products/{productId}','patch','updateProduct','Update or deactivate product','planner','Product','ProductUpdate','SKU/unit immutable after creation; keep referenced history.');
op('/suppliers','get','listSuppliers','List suppliers','planner',list('Supplier'),null,'Planner catalog.',paging);
op('/suppliers','post','createSupplier','Create supplier','planner','Supplier','SupplierInput');
op('/suppliers/{supplierId}','patch','updateSupplier','Update or deactivate supplier','planner','Supplier','SupplierUpdate');
op('/products/{productId}/suppliers','get','listSupplierProducts','Supplier quotes for product','planner',list('SupplierProduct'),null,'All prices in product unit and VND; Planner chooses supplier.',paging);
op('/products/{productId}/suppliers','post','createSupplierProduct','Set product supplier price','planner','SupplierProduct','SupplierProductInput','Unique product/supplier pair; audit price changes.');
op('/supplier-products/{supplierProductId}','patch','updateSupplierProduct','Update supplier price','planner','SupplierProduct','SupplierProductUpdate');
op('/products/{productId}/policy','put','setPolicy','Set replenishment policy','planner','Policy','PolicyInput','Set product lead time, safety stock and target stock; use version 0 only for initial creation.');
op('/inventory','get','listInventory','Search inventory','stock',list('Inventory'),null,'Derived on-order/backorders/position. Position may be negative. Missing source data is reported explicitly.',paging);
op('/inventory/{productId}','get','getInventory','Inventory detail','stock','Inventory');
op('/inventory/{productId}/movements','get','listMovements','Stock history','stock',list('StockMovement'),null,'Immutable movement history ordered newest first.',paging);
op('/inventory/{productId}/counts','post','recordCount','Record physical count adjustment','staff','MovementResult','StockCountInput','Atomic ledger/balance/audit. counted_quantity is total count, not delta. No sales change.');
op('/inventory/{productId}/sales','post','recordSale','Record an ordinary sale','staff','MovementResult','SaleInput','Current Asia/Saigon business date. Reduce on-hand, record one SALE movement and increment DAILY_SALES once. For waiting customers use fulfil endpoint instead; do not call both. Reject quantity above stock.');
op('/placed-orders','get','listPlacedOrders','Placed order tracking','stock',list('PlacedOrder'),null,'Already placed manually outside app; no automatic supplier transmission.',[...paging,query('status',status())]);
op('/placed-orders','post','createPlacedOrder','Record an order actually placed','planner','OrderMutation','OrderInput','Increase on-order only. Validate supplier-product. Optional approved proposal item must match; do not exceed approved selected quantity net of cancellations. Approval alone never creates orders.');
op('/placed-orders/{orderId}','get','getPlacedOrder','Placed order details','stock','PlacedOrder');
op('/placed-orders/{orderId}/receipts','post','receiveOrder','Receive all or part of an order','staff','OrderMutation','PartialInput','Check inventory/order versions and remaining; update received and on-hand, create RECEIPT movement and audit atomically; on-order decreases by same quantity.');
op('/placed-orders/{orderId}/cancellations','post','cancelOrderRemainder','Cancel unreceived quantity','planner','OrderMutation','CancelInput','Quantity <= remaining; require reason. Increase cancelled; on-order decreases, on-hand unchanged.');
op('/placed-orders/{orderId}/history','get','listOrderHistory','Placed order history','stock',list('AuditEvent'),null,'Includes receipts/cancellations; no mutation.',paging);
op('/backorders','get','listBackorders','Customers waiting due to shortage','stock',list('Backorder'),null,'Remaining requested-fulfilled-cancelled; zero after fulfilled/cancelled.',[...paging,query('status',status())]);
op('/backorders','post','createBackorder','Record unmet customer quantity','planner','BackorderMutation','BackorderInput','Only unmet portion. Unique customer reference/product. Increases backorders, not sales. Atomically check/increment inventory version.');
op('/backorders/{backorderId}','get','getBackorder','Customer waiting details','stock','Backorder');
op('/backorders/{backorderId}/fulfilments','post','fulfilBackorder','Deliver all or part of a backorder','staff','BackorderMutation','PartialInput','Quantity <= available stock and remaining. Atomically decrease on-hand/backorders, increase fulfilled and DAILY_SALES once; create exactly one SALE movement. Receipt alone never fulfils a customer.');
op('/backorders/{backorderId}/cancellations','post','cancelBackorder','Cancel unfulfilled customer quantity','planner','BackorderMutation','CancelInput','Require reason; quantity <= remaining. Reduce backorders only; stock and sales unchanged.');
op('/backorders/{backorderId}/history','get','listBackorderHistory','Customer waiting history','stock','AuditEventList',null,'Includes fulfilments/cancellations.',paging);
op('/products/{productId}/sales','get','listSales','Sales history by date','planner',list('SalesDay'),null,'Inclusive start/end, start <= end. Rows distinguish complete zero days from missing days. Fulfilment sales counted once.',[...paging,query('start',date(),true),query('end',date(),true)]);
op('/products/{productId}/demand','get','getDemand','Average demand over last 30 completed calendar days','planner','Demand',null,'Fixed D-30..D-1 Asia/Saigon; total/30. Missing or unconfirmed days produce MISSING_DATA/null average; no custom calculation window.');
op('/low-stock','get','listLowStock','Inventory position at or below reorder point','planner','LowStockList',null,'Use the product replenishment policy and the 30-day demand window. Include position <= ROP. Products with missing stock/policy/sales data are reported separately. On-order/backorders are required derived inputs.',paging);
op('/low-stock/{productId}','get','getLowStockDetail','Explain replenishment status','planner','LowStock',null,'REPLENISH, SUFFICIENT or MISSING_DATA. Expose all three stock terms, product stock policy and 30-day window.');
op('/replenishment-runs','get','listRuns','Daily and manual check runs','planner',list('Run'),null,'Daily or on request; the exact schedule is an implementation choice. Failed/missing data never creates proposals.',paging);
op('/replenishment-runs','post','createManualRun','Run replenishment check now','planner','Run',null,'Synchronous manual run over fixed D-30..D-1; returns final run status. Same rules as daily scheduler. Never creates drafts or orders.');
op('/dashboard','get','getDashboard','Manager summary','manager','Dashboard',null,'Current fixed-window position <= ROP totals and latest completed run metadata; missing data separate. No arbitrary start/end calculation parameters.');
op('/proposals/preview','post','previewProposal','Calculate draft without saving','planner','Calculation','DraftInput','Backend computes each line and budget; return 200 even if missing data or over budget, with can_submit=false/blocking_reasons. No automatic selected-quantity change.');
op('/proposals','get','listProposals','Visible proposals','proposal',list('Proposal'),null,'Planner own drafts and all submitted; Manager submitted only. Manager requesting DRAFT -> 403; hidden draft detail ->404. Default created_at desc/id desc.',[...paging,query('status',en('DRAFT','PENDING','APPROVED','REJECTED'))]);
op('/proposals','post','createDraft','Save a draft','planner','Proposal','DraftInput','Products and suppliers are selected by the Planner. Server owns code/creator/status/calculation; zero quantity, missing source or over-budget may be saved as draft but block submit.');
op('/proposals/{proposalId}','get','getProposal','Proposal details','proposal','Proposal',null,'Stored last draft calculation without side effects; submitted immutable snapshots. Only owner edits/submits draft.');
op('/proposals/{proposalId}','patch','updateDraft','Replace editable draft and recalculate','planner','Proposal','DraftUpdate','Owner and DRAFT only. Full replacement of budget/items enables add/remove/supplier/quantity/target edits. Recompute from current data and increment version, retain audit.');
op('/proposals/{proposalId}/submit','post','submitProposal','Planner submits reviewed draft','planner','Proposal','SubmitInput','Owner only. Recompute current prices, all inventory terms, policies and 30-day demand in consistent transaction; require positive quantities, complete data and total<=budget. Compare expected server fingerprint; mismatch ->409 CALCULATION_CHANGED with current_calculation, leave DRAFT. On success freeze snapshots, set PENDING/submitted_at and increment version. AI cannot call.');
op('/proposals/{proposalId}/approve','post','approveProposal','Approve pending proposal','manager','Proposal','ReviewInput','Atomic status/version/reviewer audit; no stock, on-order or supplier order side effect.');
op('/proposals/{proposalId}/reject','post','rejectProposal','Reject pending proposal with reason','manager','Proposal','RejectInput','Reject processed states and empty reason; immutable decision.');
op('/proposals/{proposalId}/copy','post','copyRejectedProposal','Copy rejected proposal into a new draft','planner','Proposal','ReviewInput','Source must be REJECTED and visible, source version checked. Copy budget/editable selections into a new DRAFT owned by caller with source_proposal_id. Recompute current data; old decision/snapshots unchanged.');
op('/proposals/{proposalId}/history','get','listProposalHistory','Proposal edit and review history','proposal','AuditEventList',null,'Resource visibility applies; Manager cannot read draft history. Includes AI/form edits, submissions, decisions and copies.',paging);
op('/ai/draft-requests','post','createAIDraftRequest','Ask AI to create or edit a draft','planner','AIResult','AIInput','If proposal_id supplied, expected_version required and owned DRAFT required. AI only reads data/calculates/writes draft using normal services. Never submit, review, modify catalog/stock/orders/backorders, reduce selected quantities or change budget automatically to fit. Explicit user-requested draft edits allowed. Missing supplier/ambiguous instructions -> NEEDS_CLARIFICATION without hidden writes. Provider failures ->FAILED; use request result to recover committed edits and continue with form.');
op('/ai/draft-requests/{requestId}','get','getAIRequest','Recover AI request outcome','planner','AIResult',null,'Only requesting Planner. Expose actual committed proposal/version and safe tool summaries; no invented saved result.');
paths['/ai/draft-requests'].post.responses['503']={description:'AI service unavailable before any draft write. Form remains available.',content:bodyContent(ref('Error'))};


op('/auth/login','post','login','Sign in with username and password','all','AuthSession','LoginInput','Public endpoint. Normalize username, verify active account and password hash. Generic 401 for wrong credentials or locked account; 429 for excessive attempts. Issue revocable token valid up to 8 hours. must_change_password tokens allow only /me, /auth/logout and /auth/change-password until changed. Never log passwords, token or their idempotency payloads.');
paths['/auth/login'].post.security=[];
paths['/auth/login'].post['x-roles']=['PUBLIC'];
paths['/auth/login'].post.responses['429']={description:'Too many login attempts.',content:bodyContent(ref('Error'))};
op('/auth/logout','post','logout','Revoke the current session','all','Message',null,'Revoke current bearer token. Other sessions remain valid unless password/role/status changes.');
op('/auth/change-password','post','changePassword','Change own password','all','AuthSession','ChangePasswordInput','Check current password; new password differs. Clear must_change_password, increment auth_version, revoke previous sessions and return one new session for this client. Allowed during forced password change.');
op('/users','get','listUsers','Search and filter accounts','admin',list('User'),null,'Admin only. No business-data access is implied by ADMIN.',[...paging,query('role',en(...roles.all)),query('is_active',bool())]);
op('/users','post','createUser','Create an active account with temporary password','admin','User','UserCreateInput','Username normalized and unique even for locked users; 409 DUPLICATE_USERNAME. Hash temporary password, require change at first login, record actor and time.');
op('/users/{userId}','get','getUser','Account details','admin','User');
op('/users/{userId}','patch','updateUser','Update name, role or active state','admin','User','UserUpdateInput','Username immutable. No deletion. Disallow self-lock/self-demotion and removal of the last active ADMIN, using a consistent transaction (409 SELF_ADMIN_CHANGE or LAST_ACTIVE_ADMIN). Status/role changes invalidate all target sessions. Retain user ID and historical audit names; never rewrite old transactions.');
op('/users/{userId}/reset-password','post','resetUserPassword','Assign a temporary password','admin','User','ResetPasswordInput','Hash password; set must_change_password, increment auth_version and revoke all target sessions. No email delivery. Audit actor/target/time, never credentials. Self-reset also requires signing in again.');
op('/user-activity','get','listUserActivity','Account activity history','admin','AuditEventList',null,'Audit account creation/edits/lock/unlock/password resets/login/logout with actor and target IDs, safe name snapshots and time. Never expose password hashes, salts, credentials or bearer tokens.',paging);

S.LoginInput.example={username:'planner',password:'StockMate123!'};
S.UserCreateInput.example={username:'staff02',full_name:'Nhân viên thứ hai',role:'WAREHOUSE_STAFF',temporary_password:'Temporary123!'};
S.DraftInput.example={budget_vnd:500000,items:[{product_id:1,supplier_product_id:1,target_stock:100,selected_quantity:80}]};
S.PartialInput.example={version:1,inventory_version:2,quantity:40,reference:'RECEIPT-001'};
S.CancelInput.example={version:2,inventory_version:3,quantity:40,reason:'Supplier cannot deliver remainder'};
S.SubmitInput.example={version:2,expected_calculation_fingerprint:'server-reviewed-fingerprint'};
const spec={
  openapi:'3.0.3',
  info:{title:'StockMate API',version:'2.0.0',description:'Proposed single-warehouse API, not implemented. Business rules: docs/requirements/BUSINESS_RULES.md (2026-11-02). Bearer authentication and active user required; x-roles are enforced by backend, not OpenAPI scopes. Input objects reject unknown fields. Idempotency-Key is an optional proposed retry mechanism. Version checks and server-owned identity protect updates; technical details can be refined during implementation. Quantity integers in fixed product units; money integer VND; demand/ROP decimal six places. Calculations use last 30 completed Asia/Saigon calendar days and position <= ROP. Position signed. Missing data is not zero. Drafts may be incomplete/over-budget; submission may not. Proposal can combine products and suppliers chosen by the Planner. No shared budget or automatic quantity reduction. AI can only create/edit drafts. Approval does not place orders. Partial receipts/fulfilments/cancellations tracked. Read responses use current source or frozen submitted snapshot as documented; GET never mutates. List pagination page starts at 1, page_size 20/max100; empty list returns200. Timestamps RFC3339 offsets, business dates Asia/Saigon. Source reads/aggregate changes must use consistent locking/versioning. Errors have code/message and optional fields. Username/password login, revocable sessions and ADMIN account administration are specified here. ADMIN has no business permissions by default. All operations except login require active users and valid sessions; must_change_password limits access to identity/logout/password-change endpoints. Passwords must be hashed by the backend and never returned.'},
  servers:[{url:'/api/v1',description:'Relative base path; backend not implemented.'}],
  security:[{bearerAuth:[]}],
  tags:[...new Set(Object.keys(paths).map(p=>p.split('/')[1]))].map(name=>({name})),
  paths,
  components:{securitySchemes:{bearerAuth:{type:'http',scheme:'bearer'}},schemas:S}
};
function yaml(value,level=0){
  const pad='  '.repeat(level);
  if(value===null || typeof value!=='object') return JSON.stringify(value);
  if(Array.isArray(value)){
    if(value.length===0)return '[]';
    return value.map(v=>pad+'- '+(v!==null && typeof v==='object' && Object.keys(v).length ? '\n'+yaml(v,level+1) : yaml(v,0))).join('\n');
  }
  const entries=Object.entries(value);
  if(!entries.length)return '{}';
  return entries.map(([k,v])=>pad+JSON.stringify(k)+':'+(v!==null && typeof v==='object' && Object.keys(v).length ? '\n'+yaml(v,level+1) : ' '+yaml(v,0))).join('\n');
}
export {spec,yaml};
await fs.writeFile(path.join(here,'openapi.json'),JSON.stringify(spec,null,2)+'\n','utf8');
await fs.writeFile(path.join(here,'openapi.yaml'),yaml(spec)+'\n','utf8');
