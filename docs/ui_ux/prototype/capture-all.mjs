// Role-based UI inventory. Run with the preview server; see README.md.
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { organizeScenes, writeGallery } from './screenshot-gallery.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'screenshots');
const base = process.env.PROTOTYPE_URL || 'http://127.0.0.1:4173';
const roles = {public:'Chưa đăng nhập',admin:'Admin',staff:'Nhân viên kho',planner:'Inventory Planner',manager:'Quản lý'};
const scenes = [];
const add = (role, id, title, route, prepare, kind='Màn hình') => scenes.push({role,id,title,route,prepare,kind});
const click = selector => async p => { await p.locator(selector).click(); };
const action = (name, extra='') => `[data-action="${name}"]${extra}`;
const change = async (p, selector, value) => {await p.locator(selector).fill(value);await p.locator(selector).dispatchEvent('change');};
const fixture = async (p, update) => {
  await p.locator(action('reset')).click();
  await p.locator(action('confirm-reset')).click();
  await p.evaluate(source => {
    const key='stockmate-prototype-v1', db=JSON.parse(localStorage.getItem(key));
    // Fixture-only scenarios, isolated from the user's browser context.
    Function('db', source)(db); localStorage.setItem(key,JSON.stringify(db));
  }, update);
  await p.reload();
};
add('public','login','Đăng nhập','login');
add('public','login-error','Đăng nhập không thành công','login',async p=>{
  await p.locator('[name=username]').fill('unknown');await p.locator('[name=password]').fill('Invalid123!');
  await p.locator('#login-form button').click();await p.locator('#account-error').filter({hasText:/./}).waitFor();
  await p.locator('[name=username]').fill('');await p.locator('[name=password]').fill('');
},'Trạng thái');
for (const role of Object.keys(roles).filter(r=>r!=='public')) {
  add(role,'password','Đổi mật khẩu','password');
  add(role,'temporary-password','Bắt buộc đổi mật khẩu tạm','password',async p=>{
    await p.evaluate(()=>{const key='stockmate-accounts-v1',s=JSON.parse(localStorage.getItem(key));s.users.find(u=>u.id===window.StockMateAuth.current().id).must_change_password=true;localStorage.setItem(key,JSON.stringify(s));});
    await p.reload();await p.locator('#password-form').waitFor();
  },'Trạng thái');
  add(role,'reset-data','Xác nhận đặt lại dữ liệu mẫu',role==='admin'?'users':role==='manager'?'dashboard':'inventory',click(action('reset')),'Hộp thoại');
  add(role,'access-denied','Chặn truy cập ngoài quyền',role==='admin'?'inventory':'users',null,'Chặn quyền');
  add(role,'not-found','Nội dung không tồn tại',role==='admin'?'user/missing':role==='manager'?'proposal/missing':'product/missing',null,'Trạng thái');
}
add('admin','users','Danh sách tài khoản','users');
add('admin','user-new','Tạo tài khoản','user/new');
add('admin','user-edit','Chỉnh sửa / khóa / đổi vai trò','user/u-planner');
add('admin','user-self','Chỉnh sửa tài khoản của mình','user/u-admin');
add('admin','reset-password','Cấp mật khẩu tạm','user/u-planner',click(action('reset-user-password')),'Hộp thoại');
add('admin','users-empty','Tìm tài khoản không có kết quả','users',async p=>{await p.locator('[name=search]').fill('khong-co');await p.locator('#user-filter button').click();},'Trạng thái');
add('admin','users-filter','Lọc vai trò và trạng thái','users',async p=>{await p.locator('[name=role]').selectOption('planner');await p.locator('[name=status]').selectOption('true');await p.locator('#user-filter button').click();},'Trạng thái');
for (const role of ['staff','planner']) {
  add(role,'inventory','Tồn kho','inventory');
  add(role,'inventory-empty','Tìm sản phẩm không có kết quả','inventory',async p=>{await p.locator('#search').fill('khong-co');},'Trạng thái');
  add(role,'product','Chi tiết sản phẩm','product/SKU-001');
  add(role,'product-no-history','Sản phẩm chưa có biến động','product/SKU-015');
  for (const [kind,label,id] of [['orders','Đơn đã đặt','PO-026'],['backorders','Khách chờ hàng','BO-014']]) {
    add(role,kind,label,kind);
    add(role,kind+'-detail',label+' — chi tiết','record/'+kind+'/'+id);
    add(role,kind+'-empty',label+' — danh sách trống',kind,p=>fixture(p,`db.${kind}=[];`),'Trạng thái');
    add(role,kind+'-completed',label+' — hoàn tất','record/'+kind+'/'+id,p=>fixture(p,`db.${kind}[0].done=db.${kind}[0].qty;`),'Trạng thái');
    if(role==='planner') {
      add(role,kind+'-new',label+' — ghi nhận mới','record/'+kind+'/new');
      add(role,kind+'-cancel',label+' — hủy phần còn lại','record/'+kind+'/'+id,click(action('cancel-record')),'Hộp thoại');
    }
  }
}
for (const [type,label] of [['receipt','Nhận hàng'],['sale','Xuất bán trực tiếp'],['count','Kiểm kê thực tế']]) {
  add('staff',type,label,'stock/SKU-001/'+type);
  add('staff',type+'-success',label+' — đã lưu','stock/SKU-001/'+type,async p=>{
    if(type==='receipt')await p.locator('[name=record]').selectOption('PO-026');
    await p.locator('[name=qty]').fill(type==='count'?'75':'20');await p.locator('[name=reason]').fill('Đối chiếu số lượng thực tế');
    await p.locator('#stock-form button').click();await p.locator('.heading h1').filter({hasText:'Giấy A4'}).waitFor();
  },'Kết quả');
}
add('staff','backorder-delivery','Giao khách chờ hàng','stock/SKU-001/sale',async p=>{await p.locator('[name=record]').selectOption('BO-014');});
add('staff','receipt-error','Nhận vượt số còn lại','stock/SKU-001/receipt',async p=>{
  await p.locator('[name=record]').selectOption('PO-026');await p.locator('[name=qty]').fill('41');await p.locator('[name=reason]').fill('Đối chiếu số lượng giao');await p.locator('#stock-form button').click();
},'Trạng thái');
add('staff','sale-error','Xuất vượt tồn kho','stock/SKU-001/sale',async p=>{
  await p.locator('[name=qty]').fill('61');await p.locator('[name=reason]').fill('Giao hàng');await p.locator('#stock-form button').click();
},'Trạng thái');
add('planner','demand','Phân tích nhu cầu','demand');
add('planner','demand-missing','Phân tích — thiếu dữ liệu','demand',async p=>{await p.locator('#demand-sku').selectOption('SKU-015');},'Trạng thái');
add('planner','demand-date-error','Khoảng ngày không hợp lệ','demand',async p=>{await p.locator('#date-from').fill('2026-11-02');await p.locator('#date-to').fill('2026-11-01');await p.locator(action('filter-sales')).click();},'Trạng thái');
add('planner','demand-empty','Lịch sử không có kết quả','demand',async p=>{await p.locator('#date-from').fill('2026-09-01');await p.locator('#date-to').fill('2026-09-02');await p.locator(action('filter-sales')).click();},'Trạng thái');
add('planner','alerts','Cảnh báo bổ sung','alerts');
add('planner','alert','Cơ sở bổ sung — cần nhập','alert/SKU-008');
add('planner','alert-sufficient','Cơ sở bổ sung — đủ hàng','alert/SKU-002');
add('planner','alert-missing','Cơ sở bổ sung — thiếu dữ liệu','alert/SKU-015');
add('planner','catalog','Sản phẩm và nhà cung cấp','catalog');
add('planner','product-new','Thêm sản phẩm','editproduct/new');
add('planner','product-edit','Chỉnh sửa sản phẩm và chính sách','editproduct/SKU-001');
add('planner','supplier-new','Thêm nhà cung cấp','catalog',click(action('supplier-form',':not([data-index])')),'Hộp thoại');
add('planner','supplier-edit','Chỉnh sửa nhà cung cấp','catalog',click(action('supplier-form','[data-index="0"]')),'Hộp thoại');
for (const role of ['planner','manager']) {
  add(role,'proposals','Danh sách đề xuất','proposals');
  for (const status of ['Pending','Approved','Rejected',...(role==='planner'?['Draft']:[])]) {
    add(role,'proposals-'+status.toLowerCase(),'Lọc đề xuất — '+({Pending:'Chờ duyệt',Approved:'Đã duyệt',Rejected:'Từ chối',Draft:'Bản nháp'}[status]),'proposals',click(action('status-filter',`[data-value="${status}"]`)),'Trạng thái');
  }
  add(role,'proposals-empty','Danh sách đề xuất trống','proposals',p=>fixture(p,'db.proposals=[];'),'Trạng thái');
  for(const [status,id,label] of [['pending','DX-041','Chờ duyệt'],['approved','DX-040','Đã duyệt'],['rejected','DX-039','Từ chối']])add(role,'proposal-'+status,'Chi tiết đề xuất — '+label,'proposal/'+id);
}
add('planner','draft','Chỉnh sửa bản nháp','proposal/DX-042');
add('planner','draft-new','Tạo đề xuất trống','proposals',click(action('new-proposal')));
add('planner','draft-add-product','Thêm sản phẩm vào bản nháp','proposal/DX-042',click(action('add-line')),'Hộp thoại');
add('planner','draft-over-budget','Bản nháp vượt ngân sách','proposal/DX-042',p=>change(p,'#budget','10000000'),'Trạng thái');
add('planner','draft-ai-explain','AI giải thích cơ sở','proposal/DX-042',click(action('ai')),'Trạng thái');
add('planner','draft-ai-suggest','AI đề nghị số lượng — chưa áp dụng','proposal/DX-042',async p=>{await p.locator('#ai-request').selectOption('suggest');await p.locator(action('ai')).click();},'Trạng thái');
add('planner','draft-ai-applied','Đã áp dụng gợi ý AI','proposal/DX-042',async p=>{await p.locator('#ai-request').selectOption('suggest');await p.locator(action('ai')).click();await p.locator(action('apply-ai')).click();},'Kết quả');
add('planner','draft-ai-error','AI không khả dụng','proposal/DX-042',click(action('ai-fail')),'Trạng thái');
add('planner','draft-copied','Sao chép đề xuất bị từ chối','proposal/DX-039',click(action('copy')),'Kết quả');
add('planner','draft-submitted','Đã gửi phê duyệt','proposal/DX-042',click(action('submit-proposal')),'Kết quả');
add('manager','dashboard','Tổng quan tồn kho','dashboard');
add('manager','reject-dialog','Nhập lý do từ chối','proposal/DX-041',click(action('reject')),'Hộp thoại');
add('manager','approved-result','Kết quả phê duyệt','proposal/DX-041',click(action('approve')),'Kết quả');
add('manager','rejected-result','Kết quả từ chối','proposal/DX-041',async p=>{await p.locator(action('reject')).click();await p.locator('#reject-form [name=reason]').fill('Cần đối chiếu lại báo giá với nhà cung cấp.');await p.locator('#reject-form button[type=submit]').click();},'Kết quả');
add('manager','draft-denied','Không được truy cập bản nháp','proposal/DX-042',null,'Chặn quyền');

const browser = await chromium.launch({headless:true,...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:{channel:'msedge'})});
const captured=[], errors=[];
const galleryScenes=organizeScenes(scenes);
try {
  for(const scene of galleryScenes) {
    // A fresh context per scene resets both module-level state and storage.
    const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'vi-VN',timezoneId:'Asia/Ho_Chi_Minh'});
    try {
      const p=await context.newPage();p.on('pageerror',e=>errors.push(`${scene.role}/${scene.id}: ${e.message}`));
      await p.goto(base+'/#login');await p.locator('#login-form').waitFor();await p.evaluate(()=>window.StockMateAuth.ready);
      if(scene.role!=='public') {
        await p.locator('[name=username]').fill(scene.role);await p.locator('[name=password]').fill('StockMate123!');
        await p.locator('#login-form button').click();await p.locator('nav').waitFor();
        await p.goto(base+'/#'+scene.route);await p.locator('#main').waitFor();
      }
      if(scene.prepare)await scene.prepare(p);
      await p.evaluate(()=>document.activeElement?.blur());
      await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      const denied=await p.getByRole('heading',{name:'Không có quyền truy cập',exact:true}).count();
      const missing=await p.getByRole('heading',{name:'Không tìm thấy nội dung',exact:true}).count();
      if(denied && scene.kind!=='Chặn quyền')throw Error('Unexpected permission denial');
      if(scene.kind==='Chặn quyền' && !denied)throw Error('Expected permission denial');
      if(scene.id==='not-found' && !missing && scene.role!=='admin')throw Error('Expected not-found screen');
      if(await p.locator('input[type=password]').evaluateAll(els=>els.some(el=>el.value)))throw Error('Password field must be empty');
      if(await p.locator('dialog[open]').count())await p.locator('dialog[open]').waitFor({state:'visible'});
      await mkdir(path.join(out,scene.folder),{recursive:true});
      const file=scene.file;
      await p.screenshot({path:path.join(out,file),fullPage:true});
      captured.push({file,id:scene.id,folder:scene.folder,number:scene.number,role:scene.folder,roles:scene.roles,capturedRole:scene.role,title:scene.title,kind:scene.kind,route:p.url().split('#')[1],sourceRoute:scene.route});
      console.log(`Captured ${captured.length}/${galleryScenes.length}: ${file}`);
    } catch(e) {throw new Error(`${scene.role}/${scene.id}: ${e.message}`,{cause:e});}
    finally {await context.close();}
  }
  if(errors.length)throw Error(errors.join('\n'));
  await writeGallery(out,captured);
  console.log(`PASS: ${captured.length} screenshots; numbered common/role indexes; no browser errors or unexpected permission denials.`);
} finally {await browser.close();}
