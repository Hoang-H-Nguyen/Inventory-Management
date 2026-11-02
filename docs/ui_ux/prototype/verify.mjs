// Browser verification + reproducible screenshots. See README.md for setup.
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : { channel: 'msedge' }) });
const root = path.dirname(fileURLToPath(import.meta.url));
const base = process.env.PROTOTYPE_URL || 'http://127.0.0.1:4173';
const key = 'stockmate-prototype-v1';
const checks = [], errors = [], screenshots = [];
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'vi-VN', timezoneId: 'Asia/Ho_Chi_Minh' });
const page = await context.newPage();
page.on('pageerror', e => { errors.push(e.message); console.error('Browser error:', e.stack); });
async function signIn(username, password='StockMate123!') {
  if(await page.locator('[data-action="logout"]').count()) await page.locator('[data-action="logout"]').click();
  await page.locator('#login-form').waitFor();
  await page.locator('#login-form [name="username"]').fill(username);
  await page.locator('#login-form [name="password"]').fill(password);
  await page.locator('#login-form button[type="submit"]').click();
  await page.waitForFunction(()=>Boolean(window.StockMateAuth.current()));
  await page.locator('nav').waitFor();
}
async function open(role, route, reset = true) {
  await page.goto(`${base}/#${route}`);
  if (reset) { await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); }); await page.reload(); }
  await page.evaluate(async()=>await window.StockMateAuth.ready);
  const user=await page.evaluate(()=>window.StockMateAuth.current());
  if(user?.username!==role) await signIn(role);
  if(page.url().split('#')[1]!==route){await page.goto(`${base}/#${route}`);}
  await page.locator('h1').waitFor();
}
async function db() { return page.evaluate(k => JSON.parse(localStorage.getItem(k)), key); }
async function persistSeed() { await page.locator('[data-action="reset"]').click(); await page.locator('[data-action="confirm-reset"]').click(); }
async function check(name, condition) { if (!condition) throw new Error(`FAIL: ${name}`); checks.push(name); }
async function change(selector, value) { await page.locator(selector).fill(String(value)); await page.locator(selector).dispatchEvent('change'); }
async function stock(role, type, qty, record) {
  await open(role, `stock/SKU-001/${type}`, false);
  if (record) await page.locator('[name="record"]').selectOption(record);
  await page.locator('[name="qty"]').fill(String(qty));
  await page.locator('[name="reason"]').fill('Kiểm tra nghiệp vụ');
  await page.locator('#stock-form button[type="submit"]').click();
}
try {
  await open('staff', 'inventory'); await persistSeed();
  await check('Staff chỉ có menu Tồn kho / Đơn đã đặt / Khách chờ', await page.locator('nav a').count() === 3);
  await open('planner','inventory',false);
  await check('Đăng nhập Planner hiển thị 7 menu', await page.locator('nav a').count() === 7);
  await page.locator('#search').fill('không có sản phẩm');
  await check('Tìm kiếm rỗng có thông báo và nút xóa', await page.getByRole('heading', { name: 'Không tìm thấy sản phẩm' }).count() === 1);
  await page.locator('[data-action="clear-search"]').click();
  await open('planner', 'alerts', false);
  await check('Cảnh báo dựa vào Position ≤ ROP: đúng 2 SKU', await page.locator('tbody').first().locator('tr').count() === 2);
  await open('planner', 'alert/SKU-008', false);
  await check('Ví dụ bút: Position 20, ROP 30, gợi ý 80', (await page.locator('.equation').innerText()).includes('max(0, 100 − 20) = 80'));
  await open('planner', 'demand', false); await page.locator('#demand-sku').selectOption('SKU-008');
  await check('Nhu cầu 150 / 30 = 5', (await page.locator('.metrics').innerText()).includes('150 ÷ 30'));
  await page.locator('#date-from').fill('2026-10-31'); await page.locator('#date-to').fill('2026-11-01'); await page.locator('[data-action="filter-sales"]').click();
  await check('Lọc lịch sử không đổi cửa sổ tính nhu cầu', await page.locator('tbody tr').count() === 2 && (await page.locator('.metrics').innerText()).includes('150 ÷ 30'));
  await page.locator('#demand-sku').selectOption('SKU-015');
  await check('Dữ liệu thiếu hiển thị —, không coi là 0', (await page.locator('.metrics').innerText()).includes('—') && (await page.locator('main').innerText()).includes('Thiếu lịch sử'));
  await open('staff', 'stock/SKU-001/receipt', false); await page.locator('[name="record"]').selectOption('PO-026'); await page.locator('[name="qty"]').fill('41'); await page.locator('[name="reason"]').fill('Vượt số còn lại'); await page.locator('button[type="submit"]').click();
  await check('Chặn nhận vượt số đang đặt', (await page.locator('#form-error').innerText()).includes('Vượt số lượng'));
  await stock('staff', 'receipt', 20, 'PO-026'); let data = await db();
  await check('Nhận từng phần: tồn 60→80, đã nhận 40→60', data.products[0].hand === 80 && data.orders[0].done === 60 && data.sales.length === 120);
  await stock('staff', 'sale', 6, 'BO-014'); data = await db();
  await check('Giao backorder: tồn 80→74, khách chờ 10→4, bán đúng 1 lần', data.products[0].hand === 74 && data.backorders[0].done === 6 && data.sales.length === 121);
  await stock('staff', 'sale', 75); await check('Chặn bán vượt tồn thực tế', (await page.locator('#form-error').innerText()).includes('Không đủ tồn'));
  await stock('staff', 'count', 75); data = await db();
  await check('Kiểm kê đặt tổng tồn =75 và không tạo doanh số', data.products[0].hand === 75 && data.sales.length === 121 && data.history.at(-1).reason === 'Kiểm tra nghiệp vụ');
  await open('planner', 'backorders', false); await page.locator('[data-action="cancel-record"]').click(); await page.locator('#cancel-form [name="reason"]').fill('Khách hủy phần chưa giao'); await page.locator('#cancel-form button[type="submit"]').click(); data = await db();
  await check('Hủy backorder còn lại: không đổi tồn, lưu lý do', data.products[0].hand === 75 && data.backorders[0].cancelled === 4 && data.backorders[0].history.at(-1).text.includes('Khách hủy'));
  await open('planner', 'orders', false); await page.locator('[data-action="cancel-record"]').click(); await page.locator('#cancel-form [name="reason"]').fill('NCC hủy phần chưa giao'); await page.locator('#cancel-form button[type="submit"]').click(); data = await db();
  await check('Hủy đơn mua còn lại không tăng tồn', data.products[0].hand === 75 && data.orders[0].cancelled === 20);
  await open('planner', 'record/orders/new', false); await page.locator('[name="qty"]').fill('30'); await page.locator('[name="reason"]').fill('Đã xác nhận với NCC'); await page.locator('button[type="submit"]').click(); data = await db();
  await check('Ghi nhận đơn thực tế tạo outstanding, không tăng on-hand', data.orders.at(-1).qty === 30 && data.products[0].hand === 75);
  await open('planner', 'record/backorders/new', false); await page.locator('[name="party"]').fill('Khách mới'); await page.locator('[name="qty"]').fill('5'); await page.locator('[name="reason"]').fill('Khách chờ hàng'); await page.locator('button[type="submit"]').click(); data = await db();
  await check('Tạo khách chờ không giảm on-hand', data.backorders.at(-1).qty === 5 && data.products[0].hand === 75);
  await open('planner', 'proposal/DX-042'); await persistSeed();
  await change('#budget', 10000000);
  await check('Vượt ngân sách 3 triệu chặn gửi, giữ nguyên số lượng', await page.locator('[data-action="submit-proposal"]').isDisabled() && (await db()).proposals[0].lines[0].qty === 210 && (await page.locator('main').innerText()).includes('3.000.000'));
  await change('[data-edit="qty"][data-index="0"]', 100); data = await db();
  await check('Chỉnh số lượng tính lại tổng: 6,4 triệu', data.proposals[0].lines.reduce((s,l)=>s+l.qty*l.price,0) === 6400000 && !(await page.locator('[data-action="submit-proposal"]').isDisabled()));
  await page.locator('[data-edit="supplier"][data-index="0"]').selectOption('Minh Long');
  await check('Chọn nhà cung cấp đổi giá dòng', (await db()).proposals[0].lines[0].price === 62000);
  await page.locator('[data-action="ai-fail"]').click();
  await check('AI lỗi vẫn sửa form và gửi được', await page.locator('[data-edit="qty"]').count() === 2 && !(await page.locator('[data-action="submit-proposal"]').isDisabled()));
  await page.locator('[data-action="submit-proposal"]').click();
  await check('Planner gửi Draft→Pending, giữ trang chi tiết', (await db()).proposals[0].status === 'Pending' && page.url().includes('#proposal/DX-042'));
  const beforeStock = JSON.stringify((await db()).products.map(p=>p.hand)), beforeOrders = JSON.stringify((await db()).orders);
  await open('manager', 'proposal/DX-042', false); await page.locator('[data-action="approve"]').click(); data = await db();
  await check('Manager duyệt, không tạo đơn và không thay đổi tồn', data.proposals[0].status === 'Approved' && JSON.stringify(data.products.map(p=>p.hand)) === beforeStock && JSON.stringify(data.orders) === beforeOrders);
  await check('Không quyết định lần hai sau khi duyệt', await page.locator('[data-action="approve"], [data-action="reject"]').count() === 0);
  await open('manager', 'proposal/DX-041', false); await page.locator('[data-action="reject"]').click();
  await check('Từ chối bắt buộc lý do', await page.locator('#reject-form [name="reason"]').evaluate(el=>el.required && !el.checkValidity()));
  await page.locator('#reject-form [name="reason"]').fill('Báo giá cần đối chiếu'); await page.locator('#reject-form button[type="submit"]').click();
  const original = JSON.stringify((await db()).proposals.find(q=>q.id==='DX-041'));
  await open('planner', 'proposal/DX-041', false); await page.locator('[data-action="copy"]').click(); data = await db();
  await check('Copy tạo draft mới có liên kết, bản gốc không đổi', data.proposals[0].status === 'Draft' && data.proposals[0].source === 'DX-041' && JSON.stringify(data.proposals.find(q=>q.id==='DX-041')) === original);
  await open('planner', 'editproduct/SKU-001', false); await page.locator('[name="price-0"]').fill('70000'); await page.locator('button[type="submit"]').click();
  await check('Đổi giá danh mục không thay giá đề xuất cũ', (await db()).products[0].offers[0].price === 70000 && (await db()).proposals.find(q=>q.id==='DX-041').lines[0].price === 60000);
  await open('staff', 'proposal/DX-041', false);
  await check('Chặn route ngoài quyền Staff', await page.getByRole('heading', { name:'Không có quyền truy cập' }).count() === 1);
  await open('manager', 'proposal/DX-039', false);
  await check('Không có nút copy cho Manager', await page.locator('[data-action="copy"]').count() === 0);
  await page.reload(); await check('Dữ liệu giữ sau reload', (await db()).products[0].offers[0].price === 70000);

  // Account lifecycle, permissions, ownership and session invalidation.
  await open('admin','users');
  await check('Admin chỉ có menu quản trị tài khoản',await page.locator('nav a').count()===1);
  await page.goto(base+'/#inventory');
  await check('Admin không tự có quyền kho',await page.getByRole('heading',{name:'Không có quyền truy cập'}).count()===1);
  await page.locator('[data-action="logout"]').click();
  await page.goto(base+'/?role=manager#dashboard');
  await check('Chưa đăng nhập không truy cập bằng URL role',await page.locator('#login-form').count()===1);
  await page.locator('#login-form [name="username"]').fill('admin');await page.locator('#login-form [name="password"]').fill('WrongPass123!');
  await page.locator('#login-form button[type="submit"]').click();
  await page.waitForFunction(()=>document.querySelector('#account-error')?.textContent.length>0);
  await check('Sai mật khẩu có lỗi chung, không tạo phiên',!(await page.evaluate(()=>window.StockMateAuth.current())));
  await signIn('admin'); await page.goto(base+'/#user/new');
  await page.locator('#user-form [name="username"]').fill('planner2');await page.locator('#user-form [name="full_name"]').fill('Planner thứ hai');
  await page.locator('#user-form [name="role"]').selectOption('planner');await page.locator('#user-form [name="password"]').fill('Temporary123!');
  await page.locator('#user-form button[type="submit"]').click();await page.locator('h1').filter({hasText:'Quản trị tài khoản'}).waitFor();
  const newUser=await page.evaluate(()=>window.StockMateAuth.list().find(u=>u.username==='planner2'));
  await check('Admin tạo tài khoản bắt buộc đổi mật khẩu',newUser.must_change_password&&newUser.is_active);
  await page.goto(base+'/#user/new');
  await page.locator('[name="username"]').fill('PLANNER2');await page.locator('[name="full_name"]').fill('Trùng tên');
  await page.locator('[name="password"]').fill('Temporary123!');await page.locator('#user-form button[type="submit"]').click();
  await page.waitForFunction(()=>document.querySelector('#account-error')?.textContent.includes('đã tồn tại'));
  await check('Chặn username trùng không phân biệt hoa thường',(await page.locator('#account-error').innerText()).includes('đã tồn tại'));
  await signIn('planner2','Temporary123!');await page.goto(base+'/#proposals');
  await check('Mật khẩu tạm chặn vào nghiệp vụ',await page.locator('#password-form').count()===1&&await page.locator('[data-action="new-proposal"]').count()===0);
  await page.locator('[name="old_password"]').fill('Temporary123!');await page.locator('[name="new_password"]').fill('PlannerNew123!');await page.locator('[name="confirmation"]').fill('Mismatch123!');
  await page.locator('#password-form button[type="submit"]').click();
  await check('Đổi mật khẩu kiểm tra xác nhận',(await page.locator('#account-error').innerText()).includes('không khớp'));
  await page.locator('[name="confirmation"]').fill('PlannerNew123!');await page.locator('#password-form button[type="submit"]').click();
  await page.locator('h1').filter({hasText:'Tồn kho'}).waitFor();
  await check('Đổi mật khẩu bỏ trạng thái bắt buộc',!(await page.evaluate(()=>window.StockMateAuth.current())).must_change_password);
  await page.goto(base+'/#proposals');await page.locator('[data-action="new-proposal"]').click();
  const owned=(await db()).proposals[0];
  await check('Draft ghi ID và họ tên tài khoản đăng nhập',owned.created_by===newUser.id&&owned.author==='Planner thứ hai'&&owned.history[0].actor_id===newUser.id);
  await open('planner','proposal/'+owned.id,false);
  await check('Planner không xem hoặc sửa Draft của người khác',await page.getByRole('heading',{name:'Không có quyền truy cập'}).count()===1);
  await open('admin','user/'+newUser.id,false);
  await page.locator('[name="full_name"]').fill('Tên được cập nhật');await page.locator('#user-form button[type="submit"]').click();
  await check('Đổi tên không viết lại lịch sử nghiệp vụ',(await db()).proposals.find(q=>q.id===owned.id).author==='Planner thứ hai');
  const other=await context.newPage();await other.goto(base+'/#login');await other.locator('#login-form').waitFor();
  await other.locator('[name="username"]').fill('planner2');await other.locator('[name="password"]').fill('PlannerNew123!');await other.locator('#login-form button[type="submit"]').click();await other.locator('nav').waitFor();
  await page.goto(base+'/#user/'+newUser.id);await page.locator('[data-action="reset-user-password"]').click();
  await page.locator('#reset-password-form [name="password"]').fill('ResetPass123!');await page.locator('#reset-password-form button[type="submit"]').click();await page.locator('#dialog').waitFor({state:'hidden'});
  await other.locator('#login-form').waitFor();
  await check('Cấp mật khẩu tạm thu hồi phiên ở tab khác',!(await other.evaluate(()=>window.StockMateAuth.current())));
  await page.goto(base+'/#user/'+newUser.id);await page.locator('[name="is_active"]').selectOption('false');await page.locator('#user-form button[type="submit"]').click();
  await other.locator('[name="username"]').fill('planner2');await other.locator('[name="password"]').fill('ResetPass123!');await other.locator('#login-form button[type="submit"]').click();
  await other.waitForFunction(()=>document.querySelector('#account-error')?.textContent.length>0);
  await check('Tài khoản bị khóa không đăng nhập được',!(await other.evaluate(()=>window.StockMateAuth.current())));
  await page.goto(base+'/#user/'+newUser.id);await page.locator('[name="is_active"]').selectOption('true');await page.locator('[name="role"]').selectOption('staff');await page.locator('#user-form button[type="submit"]').click();
  await other.locator('#login-form button[type="submit"]').click();await other.locator('#password-form').waitFor();
  await other.locator('[name="old_password"]').fill('ResetPass123!');await other.locator('[name="new_password"]').fill('StaffNew123!');await other.locator('[name="confirmation"]').fill('StaffNew123!');await other.locator('#password-form button[type="submit"]').click();await other.waitForFunction(()=>window.StockMateAuth.current()?.must_change_password===false);await other.locator('#password-form').waitFor({state:'hidden'});
  await other.goto(base+'/?role=admin#users');
  await check('Đổi vai trò có hiệu lực, URL không nâng quyền',(await other.evaluate(()=>window.StockMateAuth.current())).role==='staff'&&await other.getByRole('heading',{name:'Không có quyền truy cập'}).count()===1);
  await other.close();
  await page.goto(base+'/#user/u-admin');
  await check('Form chặn tự khóa và tự bỏ quyền Admin',await page.locator('[name="role"]').isDisabled()&&await page.locator('[name="is_active"]').isDisabled());
  const invariant=await page.evaluate(async()=>{try{await window.StockMateAuth.saveUser('u-admin',{full_name:'Admin',role:'staff',is_active:false});return false;}catch{return true;}});
  await check('Không thể loại bỏ Admin hoạt động cuối cùng',invariant);
  await page.goto(base+'/#users');await page.locator('#user-filter [name="search"]').fill('planner2');await page.locator('#user-filter button').click();
  await check('Admin tìm tài khoản theo username',await page.locator('.card table').first().locator('tbody tr').count()===1);
  const audit=await page.evaluate(()=>window.StockMateAuth.audit());
  await check('Audit có actor/target ID và không chứa mật khẩu',audit.some(e=>e.action==='RESET_PASSWORD'&&e.actor_id==='u-admin'&&e.target_id===newUser.id)&&!JSON.stringify(audit).includes('ResetPass123!'));
  await page.locator('[data-action="logout"]').click();await page.reload();
  await check('Đăng xuất và reload vẫn ở màn đăng nhập',await page.locator('#login-form').count()===1);

  if (process.argv.includes('--capture')) {
    const out=path.join(root,'screenshots'); await mkdir(out,{recursive:true});
    const scenes=[
      ['01-dashboard','manager','dashboard'],
      ['02-inventory-staff','staff','inventory'],
      ['04-receipt','staff','stock/SKU-001/receipt',async()=>{await page.locator('[name="record"]').selectOption('PO-026');await page.locator('[name="qty"]').fill('20');await page.locator('[name="reason"]').fill('Nhà cung cấp giao đợt 2');}],
      ['11-demand','planner','demand'],
      ['16-draft','planner','proposal/DX-042'],
      ['21-review','manager','proposal/DX-041'],
      ['26-catalog','planner','catalog'],
      ['29-orders','planner','orders'],
      ['00-login','admin','login',async()=>{await page.locator('[data-action=logout]').click();}],
      ['30-user-administration','admin','users']
    ];
    for(const [name,role,route,prepare] of scenes){await open(role,route);if(prepare)await prepare();await page.evaluate(()=>document.activeElement?.blur());await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});screenshots.push({file:name+'.png',role:name==='00-login'?'public':role,route,url:page.url()});}
    // Mobile composition + overflow check.
    await page.setViewportSize({width:390,height:844});await open('planner','inventory');
    await check('Mobile 390px không tràn toàn trang', await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await writeFile(path.join(out,'manifest.json'),JSON.stringify({viewport:'1440×1000 unless noted',fixtureDate:'2026-11-02',screenshots},null,2)+'\n');
  }
  await check('Không có lỗi JavaScript trên trình duyệt', errors.length===0);
  const result={passed:checks.length,checks,errors,screenshots:screenshots.length};
  await writeFile(path.join(root,'verification.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
} finally { await browser.close(); }
