
const FFAuth = (() => {
  const SALT = 'ff-sst-v8';
  const SESSION_KEY = 'ff_sst_v8_session_v2';
  const EXTRA_KEY = 'ff_sst_v8_extra_users';
  const OVERRIDE_KEY = 'ff_sst_v8_pw_overrides';
  const FAIL_KEY = 'ff_sst_v8_fail';
  const BUILTIN = [
    {user:'francson@gmail.com', email:'francson@gmail.com', name:'Francson Menezes Alves', birth:'1984-12-17', cpf:'01177471140', role:'admin'},
    {user:'juliamanu18@gmail.com', email:'juliamanu18@gmail.com', name:'Julia Manuella Souza Maciel Guerra', birth:'2003-01-18', cpf:'08531940176', role:'admin'}
  ];

  const digits = v => String(v||'').replace(/\D/g,'');
  const normEmail = v => String(v||'').trim().toLowerCase();
  const formatCPF = v => {
    const d = digits(v).slice(0,11);
    if(d.length<=3) return d;
    if(d.length<=6) return d.slice(0,3)+'.'+d.slice(3);
    if(d.length<=9) return d.slice(0,3)+'.'+d.slice(3,6)+'.'+d.slice(6);
    return d.slice(0,3)+'.'+d.slice(3,6)+'.'+d.slice(6,9)+'-'+d.slice(9);
  };
  const formatBirth = v => {
    const s = String(v||'').trim();
    if(/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const p = s.split(/[/-]/);
    if(p.length===3 && p[0].length===2) return `${p[2].padStart(4,'0')}-${p[1].padStart(2,'0')}-${p[0].padStart(2,'0')}`;
    return s;
  };

  async function hash(user, pass){
    const raw = `${SALT}|${normEmail(user)}|${pass||''}`;
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
    return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  function extras(){ try{return JSON.parse(localStorage.getItem(EXTRA_KEY)||'[]')}catch(e){return []} }
  function saveExtras(list){ localStorage.setItem(EXTRA_KEY, JSON.stringify(list)); }
  function overrides(){ try{return JSON.parse(localStorage.getItem(OVERRIDE_KEY)||'{}')}catch(e){return {}} }
  function allUsers(){
    return [...BUILTIN.map(u=>({...u, extra:false})), ...extras().map(u=>({...u, extra:true}))];
  }
  function findUser(login){
    const id = normEmail(login);
    return allUsers().find(u=>u.user===id || normEmail(u.email)===id);
  }
  function needsSetup(user){
    if(!user) return false;
    return !overrides()[user.user] && !user.hash;
  }
  function session(){
    try{
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      const s = raw ? JSON.parse(raw) : null;
      if(!s || !s.user || !s.ts) return null;
      if(!findUser(s.user)) { clearSession(); return null; }
      if(Date.now()-s.ts > 1000*60*60*12) { clearSession(); return null; }
      return s;
    }catch(e){ return null; }
  }
  function setSession(user, remember){
    const data = JSON.stringify({user:user.user, email:user.email||user.user, name:user.name, role:user.role||'admin', ts:Date.now()});
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

  async function login(loginName, pass, remember, extra={}){
    const until = lockedUntil();
    if(until > Date.now()){
      const sec = Math.ceil((until-Date.now())/1000);
      return {ok:false, error:`Muitas tentativas. Aguarde ${sec}s.`};
    }
    const user = findUser(loginName);
    if(!user){
      registerFail();
      return {ok:false, error:'E-mail não cadastrado.'};
    }
    if(needsSetup(user)){
      if(!extra.setup) return {ok:false, setup:true, name:user.name};
      if(digits(extra.cpf)!==user.cpf || formatBirth(extra.birth)!==user.birth){
        registerFail();
        return {ok:false, setup:true, error:'CPF ou data de nascimento não conferem.'};
      }
      if(!extra.pass || extra.pass.length<8) return {ok:false, setup:true, error:'Crie uma senha com ao menos 8 caracteres.'};
      if(extra.pass !== extra.pass2) return {ok:false, setup:true, error:'A confirmação da senha não confere.'};
      const o = overrides();
      o[user.user] = await hash(user.user, extra.pass);
      localStorage.setItem(OVERRIDE_KEY, JSON.stringify(o));
      clearFails();
      setSession(user, remember);
      return {ok:true, user};
    }
    if(!pass){
      registerFail();
      return {ok:false, error:'Informe a senha.'};
    }
    const digest = await hash(user.user, pass);
    const expected = overrides()[user.user] || user.hash;
    if(digest !== expected){
      const n = registerFail();
      return {ok:false, error: n>=6 ? 'Muitas tentativas. Aguarde 2 minutos.' : 'E-mail ou senha inválidos.'};
    }
    clearFails();
    setSession(user, remember);
    return {ok:true, user};
  }

  async function addUser({email, name, pass, birth, cpf, role}){
    const id = normEmail(email);
    if(!id || !id.includes('@')) return {ok:false, error:'Informe um e-mail válido.'};
    if(!name || !String(name).trim()) return {ok:false, error:'Informe o nome completo.'};
    const cpfDigits = digits(cpf);
    if(cpfDigits.length!==11) return {ok:false, error:'Informe um CPF válido.'};
    const birthIso = formatBirth(birth);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(birthIso)) return {ok:false, error:'Informe a data de nascimento.'};
    if(findUser(id) || allUsers().some(u=>u.cpf===cpfDigits)) return {ok:false, error:'Este e-mail ou CPF já está cadastrado.'};
    if(pass && pass.length<8) return {ok:false, error:'A senha deve ter ao menos 8 caracteres.'};
    const rec = {
      user:id, email:id, name:String(name).trim(), birth:birthIso, cpf:cpfDigits,
      role: role==='tecnico'?'tecnico':'admin'
    };
    if(pass) rec.hash = await hash(id, pass);
    const list = extras();
    list.push(rec);
    saveExtras(list);
    return {ok:true};
  }
  function removeUser(user){
    const id = normEmail(user);
    if(BUILTIN.some(u=>u.user===id)) return {ok:false, error:'Cadastro principal não pode ser excluído.'};
    saveExtras(extras().filter(u=>u.user!==id));
    const o = overrides(); delete o[id]; localStorage.setItem(OVERRIDE_KEY, JSON.stringify(o));
    return {ok:true};
  }
  async function changePassword(user, currentPass, nextPass){
    const rec = findUser(user);
    if(!rec) return {ok:false, error:'Usuário não encontrado.'};
    if(!nextPass || nextPass.length<8) return {ok:false, error:'A nova senha deve ter ao menos 8 caracteres.'};
    const currentHash = await hash(rec.user, currentPass);
    const expected = overrides()[rec.user] || rec.hash;
    if(currentHash !== expected) return {ok:false, error:'Senha atual incorreta.'};
    const o = overrides();
    o[rec.user] = await hash(rec.user, nextPass);
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
    ['loginUser','loginPass','loginCpf','loginBirth','loginNewPass','loginNewPass2'].forEach(id=>{
      const el=document.getElementById(id); if(el) el.value='';
    });
    document.getElementById('loginSetup')?.classList.add('hidden');
    document.getElementById('loginUser')?.focus();
  }

  function showSetup(on){
    const box = document.getElementById('loginSetup');
    const pass = document.getElementById('loginPassBox');
    if(box) box.classList.toggle('hidden', !on);
    if(pass) pass.classList.toggle('hidden', on);
    const p = document.getElementById('loginPass');
    if(p) p.required = !on;
  }

  function bindLoginForm(){
    const form = document.getElementById('loginForm');
    const err = document.getElementById('loginError');
    if(!form) return;
    document.getElementById('loginCpf')?.addEventListener('input', e=>{ e.target.value = formatCPF(e.target.value); });
    form.addEventListener('submit', async e=>{
      e.preventDefault();
      err.textContent='';
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      try{
        const setupVisible = !document.getElementById('loginSetup')?.classList.contains('hidden');
        const res = await login(
          document.getElementById('loginUser').value,
          document.getElementById('loginPass').value,
          document.getElementById('loginRemember').checked,
          setupVisible ? {
            setup:true,
            cpf: document.getElementById('loginCpf').value,
            birth: document.getElementById('loginBirth').value,
            pass: document.getElementById('loginNewPass').value,
            pass2: document.getElementById('loginNewPass2').value
          } : {}
        );
        if(res.setup){
          showSetup(true);
          err.textContent = res.error || '';
          const note = document.querySelector('.setup-note');
          if(note && res.name) note.textContent = `Olá, ${res.name}. Confirme CPF e nascimento e crie sua senha.`;
          return;
        }
        if(!res.ok){ err.textContent = res.error; return; }
        showSetup(false);
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

  return {session, login, logout, applyUI, boot, allUsers, addUser, removeUser, changePassword, findUser, formatCPF, formatBirth};
})();
document.addEventListener('DOMContentLoaded', ()=>FFAuth.boot());
