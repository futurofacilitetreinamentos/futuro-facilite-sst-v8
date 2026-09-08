
const FFAuth = (() => {
  const SALT = 'ff-sst-v8';
  const SESSION_KEY = 'ff_sst_v8_session';
  const EXTRA_KEY = 'ff_sst_v8_extra_users';
  const OVERRIDE_KEY = 'ff_sst_v8_pw_overrides';
  const FAIL_KEY = 'ff_sst_v8_fail';
  const BUILTIN = [
    {user:'francson', name:'Francson Menezes Alves', role:'tecnico', hash:'96ee73876768be910d5470a12ec6432ba6a9c14a3c25c33808a50bb712e4c0b7'},
    {user:'admin', name:'Administrador', role:'admin', hash:'b0f51ad5e376b5a31d08626b613ecf6ddda10eaf1e3c97b79543868288c5da8b'}
  ];

  async function hash(user, pass){
    const raw = `${SALT}|${String(user||'').trim().toLowerCase()}|${pass||''}`;
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
    return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  function extras(){ try{return JSON.parse(localStorage.getItem(EXTRA_KEY)||'[]')}catch(e){return []} }
  function saveExtras(list){ localStorage.setItem(EXTRA_KEY, JSON.stringify(list)); }
  function overrides(){ try{return JSON.parse(localStorage.getItem(OVERRIDE_KEY)||'{}')}catch(e){return {}} }
  function allUsers(){
    const extra = extras().map(u=>({...u, extra:true}));
    return [...BUILTIN.map(u=>({...u, extra:false})), ...extra];
  }
  function findUser(login){
    const id = String(login||'').trim().toLowerCase();
    return allUsers().find(u=>u.user===id);
  }
  function session(){
    try{
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      const s = raw ? JSON.parse(raw) : null;
      if(!s || !s.user || !s.ts) return null;
      if(Date.now()-s.ts > 1000*60*60*12) { clearSession(); return null; }
      return s;
    }catch(e){ return null; }
  }
  function setSession(user, remember){
    const data = JSON.stringify({user:user.user, name:user.name, role:user.role, ts:Date.now()});
    sessionStorage.setItem(SESSION_KEY, data);
    if(remember) localStorage.setItem(SESSION_KEY, data);
    else localStorage.removeItem(SESSION_KEY);
  }
  function clearSession(){
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  }
  function lockedUntil(){
    try{return parseInt(sessionStorage.getItem(FAIL_KEY)||'0',10)}catch(e){return 0}
  }
  function registerFail(){
    const n = parseInt(sessionStorage.getItem(FAIL_KEY+'_n')||'0',10)+1;
    sessionStorage.setItem(FAIL_KEY+'_n', String(n));
    if(n>=6) sessionStorage.setItem(FAIL_KEY, String(Date.now()+2*60*1000));
    return n;
  }
  function clearFails(){ sessionStorage.removeItem(FAIL_KEY); sessionStorage.removeItem(FAIL_KEY+'_n'); }

  async function login(loginName, pass, remember){
    const until = lockedUntil();
    if(until > Date.now()){
      const sec = Math.ceil((until-Date.now())/1000);
      return {ok:false, error:`Muitas tentativas. Aguarde ${sec}s.`};
    }
    const user = findUser(loginName);
    if(!user || !pass){
      registerFail();
      return {ok:false, error:'Usuário ou senha inválidos.'};
    }
    const digest = await hash(user.user, pass);
    const expected = overrides()[user.user] || user.hash;
    if(digest !== expected){
      const n = registerFail();
      return {ok:false, error: n>=6 ? 'Muitas tentativas. Aguarde 2 minutos.' : 'Usuário ou senha inválidos.'};
    }
    clearFails();
    setSession(user, remember);
    return {ok:true, user};
  }

  async function addUser({user, name, pass, role}){
    const id = String(user||'').trim().toLowerCase().replace(/[^a-z0-9._-]/g,'');
    if(!id || id.length<3) return {ok:false, error:'Usuário deve ter ao menos 3 caracteres.'};
    if(!name || !String(name).trim()) return {ok:false, error:'Informe o nome completo.'};
    if(!pass || pass.length<8) return {ok:false, error:'A senha deve ter ao menos 8 caracteres.'};
    if(findUser(id)) return {ok:false, error:'Este usuário já existe.'};
    const list = extras();
    list.push({user:id, name:String(name).trim(), role: role==='admin'?'admin':'tecnico', hash: await hash(id, pass)});
    saveExtras(list);
    return {ok:true};
  }
  function removeUser(user){
    const id = String(user||'').trim().toLowerCase();
    if(BUILTIN.some(u=>u.user===id)) return {ok:false, error:'Usuário padrão não pode ser excluído.'};
    saveExtras(extras().filter(u=>u.user!==id));
    const o = overrides(); delete o[id]; localStorage.setItem(OVERRIDE_KEY, JSON.stringify(o));
    return {ok:true};
  }
  async function changePassword(user, currentPass, nextPass){
    const id = String(user||'').trim().toLowerCase();
    const rec = findUser(id);
    if(!rec) return {ok:false, error:'Usuário não encontrado.'};
    if(!nextPass || nextPass.length<8) return {ok:false, error:'A nova senha deve ter ao menos 8 caracteres.'};
    const currentHash = await hash(id, currentPass);
    const expected = overrides()[id] || rec.hash;
    if(currentHash !== expected) return {ok:false, error:'Senha atual incorreta.'};
    const o = overrides();
    o[id] = await hash(id, nextPass);
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(o));
    return {ok:true};
  }

  function applyUI(){
    const s = session();
    const loginEl = document.getElementById('loginScreen');
    const shell = document.querySelector('.app-shell');
    if(!loginEl || !shell) return s;
    if(s){
      document.body.classList.add('authed');
      loginEl.classList.add('hidden');
      shell.classList.remove('app-locked');
      const nameEl = document.getElementById('loggedName');
      const roleEl = document.getElementById('loggedRole');
      if(nameEl) nameEl.textContent = s.name;
      if(roleEl) roleEl.textContent = s.role==='admin' ? 'Administrador' : 'Técnico';
      document.querySelectorAll('[data-admin-only]').forEach(el=>el.classList.toggle('hidden', s.role!=='admin'));
    }else{
      document.body.classList.remove('authed');
      loginEl.classList.remove('hidden');
      shell.classList.add('app-locked');
    }
    return s;
  }

  function logout(){
    clearSession();
    const frame = document.getElementById('inspecaoFrame');
    if(frame){ frame.src='about:blank'; frame.dataset.loaded=''; }
    applyUI();
    const user = document.getElementById('loginUser');
    const pass = document.getElementById('loginPass');
    if(user) user.value='';
    if(pass) pass.value='';
    if(user) user.focus();
  }

  function bindLoginForm(){
    const form = document.getElementById('loginForm');
    const err = document.getElementById('loginError');
    if(!form) return;
    form.addEventListener('submit', async e=>{
      e.preventDefault();
      err.textContent='';
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      try{
        const res = await login(
          document.getElementById('loginUser').value,
          document.getElementById('loginPass').value,
          document.getElementById('loginRemember').checked
        );
        if(!res.ok){ err.textContent = res.error; return; }
        applyUI();
        document.getElementById('loginPass').value='';
      }finally{ btn.disabled=false; }
    });
    document.getElementById('togglePass')?.addEventListener('click',()=>{
      const p = document.getElementById('loginPass');
      p.type = p.type==='password' ? 'text' : 'password';
    });
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
  }

  function boot(){
    applyUI();
    bindLoginForm();
  }

  return {session, login, logout, applyUI, boot, allUsers, addUser, removeUser, changePassword, findUser};
})();
document.addEventListener('DOMContentLoaded', ()=>FFAuth.boot());
