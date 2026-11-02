/* Browser-only identity simulation. Not a production authentication service.
 * Password verifiers use PBKDF2; localStorage remains editable by the browser user. */
(() => {
  'use strict';
  const KEY = 'stockmate-accounts-v1', SESSION = 'stockmate-session-v1';
  const roleNames = { admin: 'Admin', staff: 'Nhân viên kho', planner: 'Inventory Planner', manager: 'Quản lý' };
  const publicUser = ({ password_hash, salt, ...user }) => structuredClone(user);
  const read = () => JSON.parse(localStorage.getItem(KEY));
  const write = state => localStorage.setItem(KEY, JSON.stringify(state));
  const now = () => new Date().toISOString();
  const normalized = name => name.trim().toLowerCase();
  function validatePassword(password) {
    if (password.length < 8 || password.length > 128) throw new Error('Mật khẩu phải có từ 8 đến 128 ký tự.');
  }
  async function verifier(password, salt) {
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 100000, hash: 'SHA-256' }, material, 256);
    return Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('');
  }
  async function credentials(password) {
    validatePassword(password);
    const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('');
    return { salt, password_hash: await verifier(password, salt) };
  }
  function event(state, actor, action, target, details = '') {
    state.audit.push({ actor_id: actor.id, actor_name: actor.full_name, target_id: target.id, target_name: target.full_name, action, details, created_at: now() });
  }
  async function initialize() {
    if (read()) return;
    if (!crypto.subtle) throw new Error('Trình duyệt cần Web Crypto. Hãy mở prototype qua HTTP localhost.');
    const users = [];
    for (const [role, full_name] of Object.entries({ admin: 'Hoàng Nguyễn', staff: 'Quốc Bảo', planner: 'Linh Nguyễn', manager: 'Minh Anh' })) {
      users.push({ id: 'u-' + role, username: role, full_name, role, is_active: true, must_change_password: false, auth_version: 1, created_at: now(), updated_at: now(), ...await credentials('StockMate123!') });
    }
    write({ users, audit: [] });
  }
  function current() {
    const session = JSON.parse(sessionStorage.getItem(SESSION) || 'null');
    const user = session && read()?.users.find(u => u.id === session.user_id);
    if (!user || !user.is_active || user.auth_version !== session.auth_version) {
      sessionStorage.removeItem(SESSION); return null;
    }
    return publicUser(user);
  }
  function requireAdmin() {
    const actor = current();
    if (actor?.role !== 'admin' || actor.must_change_password) throw new Error('Chỉ Admin được quản trị tài khoản.');
    return actor;
  }
  const ready = initialize();
  window.StockMateAuth = {
    ready, roleNames,
    current,
    async login(username, password) {
      await ready;
      let state = read();
      let user = state.users.find(u => u.username === normalized(username));
      if (!user || !user.is_active || await verifier(password, user.salt) !== user.password_hash) throw new Error('Tên đăng nhập hoặc mật khẩu không đúng, hoặc tài khoản đã bị khóa.');
      const checkedVersion = user.auth_version;
      state = read(); user = state.users.find(u => u.username === normalized(username));
      if (!user?.is_active || user.auth_version !== checkedVersion) throw new Error('Tài khoản vừa thay đổi. Hãy đăng nhập lại.');
      sessionStorage.setItem(SESSION, JSON.stringify({ user_id: user.id, auth_version: user.auth_version }));
      event(state, user, 'LOGIN', user); write(state);
      return publicUser(user);
    },
    logout() {
      const actor = current();
      if (actor) { const state = read(); event(state, actor, 'LOGOUT', actor); write(state); }
      sessionStorage.removeItem(SESSION);
    },
    list() { requireAdmin(); return read().users.map(publicUser); },
    audit() { requireAdmin(); return structuredClone(read().audit); },
    async saveUser(id, input) {
      let actor = requireAdmin();
      const full_name = input.full_name.trim(), role = input.role;
      if (!full_name || full_name.length > 120 || !roleNames[role]) throw new Error('Nhập tên từ 1–120 ký tự và vai trò hợp lệ.');
      const newCredentials = !id ? await credentials(input.password || '') : null;
      // Re-read after async work and check the active actor again.
      actor = requireAdmin();
      const state = read();
      if (!id) {
        const username = normalized(input.username);
        if (!/^[a-z0-9._-]{3,32}$/.test(username)) throw new Error('Username cần 3–32 ký tự: a-z, 0-9, dấu chấm, gạch dưới hoặc gạch ngang.');
        if (state.users.some(u => u.username === username)) throw new Error('Username đã tồn tại.');
        const user = { id: crypto.randomUUID(), username, full_name, role, is_active: true, must_change_password: true, auth_version: 1, created_at: now(), updated_at: now(), ...newCredentials };
        state.users.push(user); event(state, actor, 'CREATE_USER', user, roleNames[role]); write(state); return publicUser(user);
      }
      const user = state.users.find(u => u.id === id);
      if (!user) throw new Error('Không tìm thấy tài khoản.');
      const is_active = Boolean(input.is_active);
      if (id === actor.id && (!is_active || role !== 'admin')) throw new Error('Không được tự khóa hoặc tự bỏ quyền Admin.');
      if (user.role === 'admin' && user.is_active && (!is_active || role !== 'admin') && state.users.filter(u => u.is_active && u.role === 'admin').length <= 1) throw new Error('Phải còn ít nhất một Admin hoạt động.');
      const before = { full_name: user.full_name, role: user.role, is_active: user.is_active };
      if (user.role !== role || user.is_active !== is_active) user.auth_version++;
      Object.assign(user, { full_name, role, is_active, updated_at: now() });
      event(state, actor, 'UPDATE_USER', user, JSON.stringify({ before, after: { full_name, role, is_active } }));
      write(state); return publicUser(user);
    },
    async resetPassword(id, password) {
      requireAdmin(); const hash = await credentials(password), actor = requireAdmin(), state = read(), user = state.users.find(u => u.id === id);
      if (!user) throw new Error('Không tìm thấy tài khoản.');
      Object.assign(user, hash, { must_change_password: true, auth_version: user.auth_version + 1, updated_at: now() });
      event(state, actor, 'RESET_PASSWORD', user, 'Yêu cầu đổi mật khẩu ở lần đăng nhập tiếp theo.'); write(state);
    },
    async changePassword(oldPassword, password) {
      const actor = current(); if (!actor) throw new Error('Phiên đăng nhập đã hết hiệu lực.');
      let user = read().users.find(u => u.id === actor.id);
      if (await verifier(oldPassword, user.salt) !== user.password_hash) throw new Error('Mật khẩu hiện tại không đúng.');
      if (oldPassword === password) throw new Error('Mật khẩu mới phải khác mật khẩu hiện tại.');
      const hash = await credentials(password);
      const latestActor = current();
      if (latestActor?.id !== actor.id || latestActor.auth_version !== actor.auth_version) throw new Error('Phiên đã thay đổi. Hãy đăng nhập lại.');
      const state = read(); user = state.users.find(u => u.id === actor.id);
      Object.assign(user, hash, { must_change_password: false, auth_version: user.auth_version + 1, updated_at: now() });
      event(state, actor, 'CHANGE_PASSWORD', user); write(state);
      sessionStorage.setItem(SESSION, JSON.stringify({ user_id: user.id, auth_version: user.auth_version }));
    }
  };
})();
