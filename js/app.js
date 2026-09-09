
let project=V8Storage.blank();
const $=id=>document.getElementById(id);
const empFields=['razaoSocial','nomeFantasia','cnpj','cnae','grauRisco','numTrabalhadores','endereco','responsavelEmpresa','contatoEmpresa','emailEmpresa','dataElaboracao','atividadeEmpresa','respSst','funcaoRespSst','regSst','medicoTrabalho','crmMedico','engSeguranca','creaEng','respSstId','medicoId','engId'];
const needsCadastro=['agenda','inspecao','setores','funcoes','ghe','riscos','plano','pgr','nr1','laudos'];

function init(){
 $('dataElaboracao').value=new Date().toISOString().slice(0,10);
 document.querySelectorAll('#menu button').forEach(b=>b.onclick=()=>openView(b.dataset.view,b));
 $('newProjectBtn').onclick=newProject;$('saveProjectBtn').onclick=saveProject;
 $('addSetor').onclick=()=>openEntityModal('setor');$('addFuncao').onclick=()=>openEntityModal('funcao');$('addGhe').onclick=()=>openEntityModal('ghe');$('addRisco').onclick=()=>openEntityModal('risco');
 $('addSst')?.addEventListener('click',()=>openEquipeModal('sst'));
 $('addMedico')?.addEventListener('click',()=>openEquipeModal('medico'));
 $('addEng')?.addEventListener('click',()=>openEquipeModal('engenheiro'));
 document.querySelectorAll('[data-pick]').forEach(b=>b.addEventListener('click',()=>openPickEquipe(b.dataset.pick)));
 document.querySelectorAll('.pick-wrap input').forEach(inp=>inp.addEventListener('click',()=>{
  const tipo=inp.closest('label')?.querySelector('[data-pick]')?.dataset.pick;
  if(tipo) openPickEquipe(tipo);
 }));
 $('closeModal').onclick=closeModal;$('previewPgr').onclick=previewPgr;$('printPgr').onclick=()=>V8Report.print(collect());$('closeReport').onclick=closeReport;$('printFromPreview').onclick=()=>V8Report.print(window._previewProject||collect());
 $('cnpj').oninput=e=>e.target.value=formatCNPJ(e.target.value);
 $('addUserBtn').onclick=addAccessUser;$('changePassBtn').onclick=changeMyPassword;
 $('newUserCpf')?.addEventListener('input',e=>e.target.value=FFAuth.formatCPF(e.target.value));
 $('agendarBtn')?.addEventListener('click',agendarInspecao);
 $('condoSelect')?.addEventListener('change',switchCondominio);
 $('copyDrpsLink')?.addEventListener('click',copyDrpsLink);
 $('openDrpsLink')?.addEventListener('click',()=>window.open(drpsUrl(),'_blank'));
 $('exportDrpsCsv')?.addEventListener('click',exportDrpsCsv);
 const saved=V8Storage.ativo();
 seedEquipe();
 if(saved) apply(saved,true);
 else{
  const session=FFAuth.session();
  $('agTecnico').value=session?.name||'';
 }
 renderAll();
}
function hasCadastro(){return !!(project.empresa?.razaoSocial||$('razaoSocial')?.value)}
function condoName(){return project.empresa?.razaoSocial||'Condomínio sem nome'}
function go(view){openView(view,document.querySelector(`[data-view="${view}"]`))}
function openView(v,btn){
 collect();
 if(needsCadastro.includes(v) && !hasCadastro()){
  alert('Cadastre o condomínio primeiro. Depois a agenda, a inspeção e os laudos usam esses dados.');
  v='empresa';
  btn=document.querySelector('[data-view="empresa"]');
 }
 const viewEl=$('view-'+v);
 if(!viewEl) return;
 document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));
 viewEl.classList.add('active');
 document.querySelectorAll('#menu button').forEach(x=>x.classList.remove('active'));
 (btn||document.querySelector(`[data-view="${v}"]`))?.classList.add('active');
 const names={dashboard:'Atendimento',inspecao:'Inspeção SST',empresa:'Condomínio',equipe:'Equipe técnica',agenda:'Agenda',setores:'Setores',funcoes:'Funções',ghe:'GHE',riscos:'Inventário de riscos',plano:'Plano de ação',pgr:'PGR / NR-1',nr1:'NR-1 / DRPS',laudos:'Laudos',pcmso:'PCMSO',ltcat:'LTCAT',acessos:'Minha conta'};
 $('pageTitle').textContent=names[v]||v;
 document.body.classList.toggle('inspecao-open',v==='inspecao');
 if(v==='inspecao') openInspecao();
 if(v==='agenda') renderAgenda();
 if(v==='plano') renderPlano();
 if(v==='pgr') renderPgrSummary();
 if(v==='nr1') renderNr1();
 if(v==='laudos') renderLaudos();
 if(v==='acessos') renderAcessos();
 if(v==='equipe') renderEquipe();
}
function formatCNPJ(value){const d=String(value||'').replace(/\D/g,'').slice(0,14);if(d.length<=2)return d;if(d.length<=5)return d.slice(0,2)+'.'+d.slice(2);if(d.length<=8)return d.slice(0,2)+'.'+d.slice(2,5)+'.'+d.slice(5);if(d.length<=12)return d.slice(0,2)+'.'+d.slice(2,5)+'.'+d.slice(5,8)+'/'+d.slice(8);return d.slice(0,2)+'.'+d.slice(2,5)+'.'+d.slice(5,8)+'/'+d.slice(8,12)+'-'+d.slice(12)}
function collect(){
 empFields.forEach(f=>project.empresa[f]=$(f)?.value||'');
 project.agenda=Array.isArray(project.agenda)?project.agenda:[];
 project.salvoEm=new Date().toLocaleString('pt-BR');
 const snap=JSON.parse(JSON.stringify(project));
 snap.drps=DRPSData.bundle(V8Storage.drpsList(project.id));
 return snap;
}
function apply(p,silent){
 project=JSON.parse(JSON.stringify(p));
 project.agenda=Array.isArray(project.agenda)?project.agenda:[];
 empFields.forEach(f=>$(f).value=project.empresa?.[f]||'');
 if(!project.empresa?.dataElaboracao) $('dataElaboracao').value=new Date().toISOString().slice(0,10);
 if(!project.empresa?.respSstId){ $('respSst').value=''; $('funcaoRespSst').value=''; $('regSst').value=''; }
 if(!project.empresa?.medicoId){ $('medicoTrabalho').value=''; $('crmMedico').value=''; }
 if(!project.empresa?.engId){ $('engSeguranca').value=''; $('creaEng').value=''; }
 $('projectLabel').textContent=project.empresa?.razaoSocial||'Cadastre o condomínio para iniciar';
 V8Storage.setAtivo(project.id);
 if(!silent) renderAll();
 else{
  renderCondoSelect();
  renderDashboard();
 }
 pushInspectionContext();
}
function saveProject(){
 collect();
 if(!project.empresa.razaoSocial) return alert('Informe o nome do condomínio.');
 V8Storage.save(project);
 $('projectLabel').textContent=project.empresa.razaoSocial;
 renderCondoSelect();
 renderDashboard();
 pushInspectionContext();
 alert('Cadastro do condomínio salvo. Agenda, inspeção e laudos já usam estes dados.');
}
function newProject(){
 if(project.empresa?.razaoSocial && !confirm('Iniciar cadastro de outro condomínio? Salve o atual antes, se necessário.')) return;
 collect();
 if(project.empresa?.razaoSocial) V8Storage.save(project);
 project=V8Storage.blank();
 empFields.forEach(f=>$(f).value='');
 const session=FFAuth.session();
 $('dataElaboracao').value=new Date().toISOString().slice(0,10);
 $('agTecnico').value=session?.name||'';
 $('projectLabel').textContent='Novo condomínio';
 V8Storage.setAtivo(project.id);
 renderAll();
 go('empresa');
}
function switchCondominio(){
 const id=$('condoSelect').value;
 if(!id) return;
 collect();
 if(project.empresa?.razaoSocial) V8Storage.save(project);
 const p=V8Storage.get(id);
 if(p) apply(p);
}
function renderCondoSelect(){
 const sel=$('condoSelect');
 if(!sel) return;
 const list=V8Storage.list();
 if(!list.length){
  sel.innerHTML='<option value="">Nenhum condomínio cadastrado</option>';
  return;
 }
 sel.innerHTML=list.map(p=>`<option value="${p.id}" ${p.id===project.id?'selected':''}>${V8Report.esc(p.empresa?.razaoSocial||'Condomínio sem nome')}</option>`).join('');
}
function processState(){
 const cadastro=hasCadastro();
 const agenda=(project.agenda||[]).filter(a=>a.status!=='cancelada');
 const agendada=agenda.length>0;
 const inspecoes=V8Storage.inspections(project.id);
 const inspecao=inspecoes.length>0 || agenda.some(a=>a.status==='realizada');
 const pgr=cadastro && project.riscos.length>0;
 return {cadastro, agendada, inspecao, pgr, laudo:inspecao||pgr, inspecoes, agenda};
}
function inspectionContext(){
 const e=project.empresa||{};
 const session=FFAuth.session();
 const selected=(project.agenda||[]).find(a=>a.status==='agendada' && a.useNext);
 const next=selected||(project.agenda||[]).filter(a=>a.status==='agendada').sort((a,b)=>(a.data||'').localeCompare(b.data||''))[0];
 return {
  condominioId:project.id,
  condominio:e.razaoSocial||e.nomeFantasia||'',
  cnpj:e.cnpj||'',
  endereco:e.endereco||'',
  sindica:e.responsavelEmpresa||'',
  telefone:e.contatoEmpresa||'',
  emailCondominio:e.emailEmpresa||'',
  dataVisita:next?.data||new Date().toISOString().slice(0,10),
  tecnico:next?.tecnico||session?.name||'',
  agendaId:next?.id||'',
  locked:!!e.razaoSocial
 };
}
window.inspectionContext=inspectionContext;
window.markAgendaDone=function(agendaId,inspecaoId){
 if(!agendaId) return;
 const a=(project.agenda||[]).find(x=>x.id===agendaId);
 if(a){ a.status='realizada'; a.inspecaoId=inspecaoId; }
 collect();
 if(project.empresa?.razaoSocial) V8Storage.save(project);
 renderAgenda();
 renderDashboard();
 renderLaudos();
};
function pushInspectionContext(){
 const f=$('inspecaoFrame');
 const ctx=inspectionContext();
 try{ f?.contentWindow?.FFInspecao?.applyCadastro(ctx); }catch(e){}
 try{ f?.contentWindow?.postMessage({type:'ff-cadastro',ctx},'*'); }catch(e){}
}
function openInspecao(){
 const f=$('inspecaoFrame');
 if(!f) return;
 const src=new URL('inspecao/index.html?v=8.13', document.baseURI).href;
 if(f.dataset.loaded!=='1'){
  f.onload=()=>pushInspectionContext();
  f.src=src;
  f.dataset.loaded='1';
 }else pushInspectionContext();
}
function renderAll(){
 renderSetores();renderFuncoes();renderGhe();renderRiscos();renderPlano();renderDashboard();renderCondoSelect();renderAgenda();renderEquipe();
}
function renderDashboard(){
 const highs=project.riscos.filter(r=>Number(r.prob)*Number(r.sev)>=10).length;
 $('mSetores').textContent=project.setores.length;
 $('mFuncoes').textContent=project.funcoes.length;
 $('mGhe').textContent=project.ghe.length;
 $('mRiscos').textContent=project.riscos.length;
 $('mAltos').textContent=highs;
 const st=processState();
 const steps=[
  {id:'empresa', n:'1', title:'Cadastro', text:st.cadastro?condoName():'Nome, CNPJ, endereço e síndico', done:st.cadastro},
  {id:'agenda', n:'2', title:'Agendamento', text:st.agendada?'Inspeção na agenda':'Data, horário e técnico', done:st.agendada},
  {id:'inspecao', n:'3', title:'Inspeção', text:st.inspecao?(st.inspecoes[0]?.numero||'Checklist realizado'):'Checklist no local', done:st.inspecao},
  {id:'laudos', n:'4', title:'Laudos', text:st.laudo?'Pronto para emitir':'Relatório de inspeção e PGR', done:st.laudo}
 ];
 const firstOpen=steps.find(s=>!s.done);
 $('pipeline').innerHTML=steps.map(s=>{
  const cls=s.done?'done':(firstOpen&&firstOpen.id===s.id?'now':'wait');
  return `<button type="button" class="step ${cls}" data-go="${s.id}"><b>Passo ${s.n}</b><strong>${s.title}</strong><span>${V8Report.esc(s.text)}</span></button>`;
 }).join('');
 $('pipeline').querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
 const next=firstOpen||steps[3];
 const labels={empresa:'Cadastrar condomínio',agenda:'Agendar inspeção',inspecao:'Realizar inspeção',laudos:'Emitir laudos'};
 $('nextAction').innerHTML=`<button class="primary" type="button" id="goNext">${labels[next.id]}</button><span>${st.cadastro?'Condomínio em atendimento: <b>'+V8Report.esc(condoName())+'</b>':'Comece pelo cadastro único do condomínio.'}</span>`;
 $('goNext').onclick=()=>go(next.id);
}
function renderAgenda(){
 const note=$('agendaCondoNote');
 const nome=project.empresa?.razaoSocial;
 if(note) note.textContent=nome
  ? `Inspeção de ${nome}. Os dados de cadastro serão preenchidos automaticamente no checklist e nos laudos.`
  : 'Cadastre o condomínio antes de agendar.';
 const session=FFAuth.session();
 if($('agTecnico') && !$('agTecnico').value) $('agTecnico').value=session?.name||'';
 if($('agData') && !$('agData').value) $('agData').value=new Date().toISOString().slice(0,10);
 const dl=$('sstTecnicos');
 if(dl) dl.innerHTML=V8Storage.equipeByTipo('sst').map(x=>`<option value="${V8Report.esc(x.nome)}"></option>`).join('');
 const root=$('agendaList');
 if(!root) return;
 const list=(project.agenda||[]).slice().sort((a,b)=>(b.data||'').localeCompare(a.data||''));
 if(!list.length){ root.innerHTML='<div class="notice">Nenhuma inspeção agendada para este condomínio.</div>'; return; }
 root.innerHTML=list.map(a=>{
  const st=a.status==='realizada'?'Realizada':a.status==='cancelada'?'Cancelada':'Agendada';
  const cls=a.status==='realizada'?'ok':a.status==='cancelada'?'bad':'';
  return `<div class="entity-card"><div class="entity-head"><div><div class="entity-title">${V8Report.fmt(a.data)}${a.hora?' · '+V8Report.esc(a.hora):''}</div><div class="entity-meta">${V8Report.esc(a.tecnico||'-')} · <b class="${cls}">${st}</b>${a.obs?' · '+V8Report.esc(a.obs):''}</div></div><div class="entity-actions">${a.status==='agendada'?`<button class="primary" data-do="${a.id}">Iniciar inspeção</button><button class="danger" data-cancel="${a.id}">Cancelar</button>`:''}</div></div></div>`;
 }).join('');
 root.querySelectorAll('[data-do]').forEach(b=>b.onclick=()=>iniciarAgendada(b.dataset.do));
 root.querySelectorAll('[data-cancel]').forEach(b=>b.onclick=()=>cancelarAgenda(b.dataset.cancel));
}
function agendarInspecao(){
 collect();
 if(!hasCadastro()) return alert('Cadastre o condomínio primeiro.');
 const data=$('agData').value, hora=$('agHora').value, tecnico=$('agTecnico').value, obs=$('agObs').value;
 if(!data) return alert('Informe a data da inspeção.');
 project.agenda=project.agenda||[];
 project.agenda.unshift({id:'ag_'+Date.now(), data, hora, tecnico, obs, status:'agendada'});
 V8Storage.save(project);
 $('agObs').value='';
 renderAgenda();
 renderDashboard();
 alert('Inspeção agendada. No dia, abra a inspeção: os dados do condomínio já estarão preenchidos.');
}
function iniciarAgendada(id){
 const a=(project.agenda||[]).find(x=>x.id===id);
 if(!a) return;
 (project.agenda||[]).forEach(x=>x.useNext=x.id===id);
 V8Storage.save(project);
 go('inspecao');
}
function cancelarAgenda(id){
 if(!confirm('Cancelar este agendamento?')) return;
 const a=(project.agenda||[]).find(x=>x.id===id);
 if(a) a.status='cancelada';
 V8Storage.save(project);
 renderAgenda();
 renderDashboard();
}
function renderLaudos(){
 const root=$('laudosGrid');
 if(!root) return;
 const st=processState();
 const insp=st.inspecoes[0];
 const cards=[
  {
   title:'Relatório de inspeção SST',
   meta:insp?`${insp.numero||''} · ${V8Report.fmt(insp.dataVisita)}`:'Disponível após a inspeção',
   ready:!!insp,
   actions: insp
    ? `<button class="outline" data-act="prev-insp">Prévia</button><button class="dark" data-act="pdf-insp">Gerar PDF</button>`
    : `<button class="primary" data-act="go-insp">Ir para inspeção</button>`
  },
  {
   title:'PGR / NR-1',
   meta:st.cadastro?'Cadastro, inventário, plano de ação e resultado coletivo do DRPS':'Cadastre o condomínio e o inventário',
   ready:st.cadastro,
   actions: st.cadastro
    ? `<button class="outline" data-act="prev-pgr">Prévia</button><button class="dark" data-act="pdf-pgr">Gerar PDF</button>`
    : `<button class="primary" data-act="go-cad">Cadastrar condomínio</button>`
  },
  {title:'PCMSO', meta:'Módulo médico em preparação', ready:false, actions:'<button class="outline" disabled>Em breve</button>'},
  {title:'LTCAT', meta:'Módulo previdenciário em preparação', ready:false, actions:'<button class="outline" disabled>Em breve</button>'}
 ];
 root.innerHTML=cards.map(c=>`<article class="laudo-card ${c.ready?'ready':''}"><span class="eyebrow">${c.ready?'PRONTO':'PENDENTE'}</span><h3>${c.title}</h3><p>${V8Report.esc(c.meta)}</p><div class="actions">${c.actions}</div></article>`).join('');
 root.querySelector('[data-act="go-insp"]')?.addEventListener('click',()=>go('inspecao'));
 root.querySelector('[data-act="go-cad"]')?.addEventListener('click',()=>go('empresa'));
 root.querySelector('[data-act="prev-pgr"]')?.addEventListener('click',previewPgr);
 root.querySelector('[data-act="pdf-pgr"]')?.addEventListener('click',()=>V8Report.print(collect()));
 root.querySelector('[data-act="prev-insp"]')?.addEventListener('click',()=>emitInspecao('preview'));
 root.querySelector('[data-act="pdf-insp"]')?.addEventListener('click',()=>emitInspecao('pdf'));
}
function emitInspecao(mode){
 const d=V8Storage.inspections(project.id)[0];
 if(!d) return alert('Realize a inspeção deste condomínio primeiro.');
 go('inspecao');
 const run=()=>{
  const win=$('inspecaoFrame')?.contentWindow;
  if(!win?.FFInspecao){ setTimeout(run,200); return; }
  if(mode==='preview') win.FFInspecao.previewSaved(d.id);
  else win.FFInspecao.printSaved(d.id);
 };
 setTimeout(run,250);
}
function closeModal(){$('modal').classList.add('hidden')}function closeReport(){$('reportModal').classList.add('hidden')}
function options(list,key='nome'){return `<option value="">Selecione...</option>${list.map(x=>`<option>${V8Report.esc(x[key]||'')}</option>`).join('')}`}
function openEntityModal(type,index=null){
 const edit=index!==null;let item=edit?project[type==='setor'?'setores':type==='funcao'?'funcoes':type==='ghe'?'ghe':'riscos'][index]:{};
 const titles={setor:'Setor / ambiente',funcao:'Função',ghe:'GHE',risco:'Risco ocupacional'};$('modalTitle').textContent=(edit?'Editar ':'Novo ')+titles[type];
 let h='';
 if(type==='setor')h=`<div class="form-grid two"><label>Nome<input id="eNome" value="${V8Report.esc(item.nome||'')}"></label><label>Tipo de ambiente<input id="eAmbiente" value="${V8Report.esc(item.ambiente||'')}"></label><label class="span2">Descrição<textarea id="eDescricao">${V8Report.esc(item.descricao||'')}</textarea></label></div>`;
 if(type==='funcao')h=`<div class="form-grid two"><label>Função<input id="eNome" value="${V8Report.esc(item.nome||'')}"></label><label>Setor<select id="eSetor">${options(project.setores)}</select></label><label>Quantidade<input id="eQtd" type="number" min="0" value="${V8Report.esc(item.quantidade||'1')}"></label><label>CBO<input id="eCbo" value="${V8Report.esc(item.cbo||'')}"></label><label class="span2">Atividades<textarea id="eAtividades">${V8Report.esc(item.atividades||'')}</textarea></label></div>`;
 if(type==='ghe')h=`<div class="form-grid two"><label>Identificação do GHE<input id="eNome" value="${V8Report.esc(item.nome||'')}"></label><label>Setor<select id="eSetor">${options(project.setores)}</select></label><label class="span2">Funções incluídas<input id="eFuncoes" value="${V8Report.esc(item.funcoes||'')}" placeholder="Ex.: Porteiro, Zelador"></label><label class="span2">Descrição da exposição / similaridade<textarea id="eDescricao">${V8Report.esc(item.descricao||'')}</textarea></label></div>`;
 if(type==='risco')h=`<div class="form-grid two"><label>GHE<select id="eGhe">${options(project.ghe)}</select></label><label>Função<select id="eFuncao">${options(project.funcoes)}</select></label><label>Grupo<select id="eGrupo"><option>Físico</option><option>Químico</option><option>Biológico</option><option>Ergonômico</option><option>Acidente</option><option>Psicossocial relacionado ao trabalho</option></select></label><label>Perigo / fator de risco<input id="ePerigo" value="${V8Report.esc(item.perigo||'')}"></label><label class="span2">Fonte / circunstância<textarea id="eFonte">${V8Report.esc(item.fonte||'')}</textarea></label><label class="span2">Possíveis lesões / agravos<textarea id="eDano">${V8Report.esc(item.dano||'')}</textarea></label><label class="span2">Controles existentes<textarea id="eControles">${V8Report.esc(item.controles||'')}</textarea></label><label>Probabilidade (1–5)<input id="eProb" type="number" min="1" max="5" value="${item.prob||1}"></label><label>Severidade (1–5)<input id="eSev" type="number" min="1" max="5" value="${item.sev||1}"></label><label class="span2">Medida / ação proposta<textarea id="eAcao">${V8Report.esc(item.acao||'')}</textarea></label><label>Responsável<input id="eResponsavel" value="${V8Report.esc(item.responsavel||'')}"></label><label>Prazo<input id="ePrazo" type="date" value="${item.prazo||''}"></label><label>Status<select id="eStatus"><option>Pendente</option><option>Em andamento</option><option>Concluído</option></select></label></div>`;
 h+=`<div style="margin-top:14px;text-align:right"><button class="primary" id="saveEntity">Salvar</button></div>`;$('modalBody').innerHTML=h;
 if(type==='funcao'&&item.setor)$('eSetor').value=item.setor;if(type==='ghe'&&item.setor)$('eSetor').value=item.setor;
 if(type==='risco'){if(item.ghe)$('eGhe').value=item.ghe;if(item.funcao)$('eFuncao').value=item.funcao;if(item.grupo)$('eGrupo').value=item.grupo;if(item.status)$('eStatus').value=item.status}
 $('saveEntity').onclick=()=>saveEntity(type,index);$('modal').classList.remove('hidden')
}
function saveEntity(type,index){
 let obj;
 if(type==='setor')obj={nome:$('eNome').value,ambiente:$('eAmbiente').value,descricao:$('eDescricao').value};
 if(type==='funcao')obj={nome:$('eNome').value,setor:$('eSetor').value,quantidade:$('eQtd').value,cbo:$('eCbo').value,atividades:$('eAtividades').value};
 if(type==='ghe')obj={nome:$('eNome').value,setor:$('eSetor').value,funcoes:$('eFuncoes').value,descricao:$('eDescricao').value};
 if(type==='risco')obj={ghe:$('eGhe').value,funcao:$('eFuncao').value,grupo:$('eGrupo').value,perigo:$('ePerigo').value,fonte:$('eFonte').value,dano:$('eDano').value,controles:$('eControles').value,prob:$('eProb').value,sev:$('eSev').value,acao:$('eAcao').value,responsavel:$('eResponsavel').value,prazo:$('ePrazo').value,status:$('eStatus').value};
 const arr=project[type==='setor'?'setores':type==='funcao'?'funcoes':type==='ghe'?'ghe':'riscos'];if(index===null)arr.push(obj);else arr[index]=obj;closeModal();renderAll()
}
function entityList(root,arr,type,details){root.innerHTML=arr.length?'':'<div class="notice">Nenhum registro cadastrado.</div>';arr.forEach((x,i)=>{const d=document.createElement('div');d.className='entity-card';d.innerHTML=`<div class="entity-head"><div><div class="entity-title">${V8Report.esc(x.nome||x.perigo||'Registro')}</div><div class="entity-meta">${details(x)}</div></div><div class="entity-actions"><button class="outline">Editar</button><button class="danger">Excluir</button></div></div>`;const bs=d.querySelectorAll('button');bs[0].onclick=()=>openEntityModal(type,i);bs[1].onclick=()=>{if(confirm('Excluir este registro?')){arr.splice(i,1);renderAll()}};root.appendChild(d)})}
function renderSetores(){entityList($('setoresList'),project.setores,'setor',x=>`${V8Report.esc(x.ambiente||'')} · ${V8Report.esc(x.descricao||'')}`)}
function renderFuncoes(){entityList($('funcoesList'),project.funcoes,'funcao',x=>`${V8Report.esc(x.setor||'')} · ${V8Report.esc(x.quantidade||'0')} trabalhador(es) · ${V8Report.esc(x.cbo||'')}`)}
function renderGhe(){entityList($('gheList'),project.ghe,'ghe',x=>`${V8Report.esc(x.setor||'')} · ${V8Report.esc(x.funcoes||'')}`)}
function renderRiscos(){const root=$('riscosList');root.innerHTML=project.riscos.length?'':'<div class="notice">Nenhum risco cadastrado.</div>';project.riscos.forEach((r,i)=>{const score=Number(r.prob)*Number(r.sev),lvl=V8Report.level(score),cl=lvl==='Baixo'?'baixo':lvl==='Moderado'?'moderado':lvl==='Alto'?'alto':'critico';const d=document.createElement('div');d.className='risk-row';d.innerHTML=`<div><b>${V8Report.esc(r.perigo)}</b><br><span>${V8Report.esc(r.ghe||r.funcao||'-')}</span></div><div>${V8Report.esc(r.grupo)}</div><div>P ${r.prob} × S ${r.sev}</div><div class="risk-level ${cl}">${lvl}</div><div>${V8Report.esc(r.status||'Pendente')}</div><div class="entity-actions"><button class="outline">Editar</button><button class="danger">Excluir</button></div>`;const bs=d.querySelectorAll('button');bs[0].onclick=()=>openEntityModal('risco',i);bs[1].onclick=()=>{if(confirm('Excluir este risco?')){project.riscos.splice(i,1);renderAll()}};root.appendChild(d)})}
function renderPlano(){const rows=project.riscos.filter(r=>r.acao);$('planoTable').innerHTML=rows.length?`<table class="table"><thead><tr><th>Risco</th><th>Nível</th><th>Ação</th><th>Responsável</th><th>Prazo</th><th>Status</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${V8Report.esc(r.perigo)}</td><td>${V8Report.level(Number(r.prob)*Number(r.sev))}</td><td>${V8Report.esc(r.acao)}</td><td>${V8Report.esc(r.responsavel||'-')}</td><td>${V8Report.fmt(r.prazo)}</td><td>${V8Report.esc(r.status||'Pendente')}</td></tr>`).join('')}</tbody></table>`:'<div class="notice">Cadastre ações nos riscos do inventário para formar o plano de ação.</div>'}
function seedEquipe(){
 const defaults=[{
  id:'eq_sst_daniel',
  tipo:'sst',
  nome:'Daniel Mateus da Silva de Holanda',
  funcao:'Técnico de Segurança do Trabalho',
  registro:'0010748/DF',
  rqe:'',
  telefone:'',
  email:''
 },{
  id:'eq_med_elber',
  tipo:'medico',
  nome:'Dr. Elber Sampaio Vilanova',
  funcao:'Médico responsável',
  registro:'20773/DF',
  rqe:'',
  telefone:'',
  email:''
 },{
  id:'eq_eng_sthefany',
  tipo:'engenheiro',
  nome:'Sthefany Thiara Martins de Sousa',
  funcao:'Engenheira de Segurança do Trabalho',
  registro:'25958/D-DF',
  rqe:'',
  telefone:'',
  email:''
 },{
  id:'eq_med_cristovam',
  tipo:'medico',
  nome:'Dr. Cristovam Scapulatempo Neto',
  funcao:'Médico responsável',
  registro:'102037',
  rqe:'',
  telefone:'',
  email:''
 }];
 const list=V8Storage.equipeList();
 defaults.forEach(d=>{
  const hit=list.find(x=>x.id===d.id)||list.find(x=>x.tipo===d.tipo && String(x.nome||'').toLowerCase()===d.nome.toLowerCase());
  if(hit){
   V8Storage.saveEquipe({...hit,...d,id:hit.id});
   return;
  }
  V8Storage.saveEquipe({...d});
 });
}
function applyEquipePick(tipo,person){
 if(tipo==='sst'){
  $('respSst').value=person?.nome||'';
  $('funcaoRespSst').value=person?.funcao||(person?'Técnico de Segurança do Trabalho':'');
  $('regSst').value=person?.registro||'';
  $('respSstId').value=person?.id||'';
 }
 if(tipo==='medico'){
  $('medicoTrabalho').value=person?.nome||'';
  $('crmMedico').value=person?[person.registro,person.rqe].filter(Boolean).join(' / '):'';
  $('medicoId').value=person?.id||'';
 }
 if(tipo==='engenheiro'){
  $('engSeguranca').value=person?.nome||'';
  $('creaEng').value=person?.registro||'';
  $('engId').value=person?.id||'';
 }
}
function openPickEquipe(tipo){
 const titles={sst:'Selecionar responsável SST',medico:'Selecionar médico do trabalho',engenheiro:'Selecionar engenheiro de segurança'};
 const list=V8Storage.equipeByTipo(tipo);
 $('modalTitle').textContent=titles[tipo]||'Selecionar';
 if(!list.length){
  $('modalBody').innerHTML=`<div class="notice">Nenhum profissional cadastrado neste grupo.</div><div style="margin-top:14px;text-align:right"><button class="primary" type="button" id="goEquipeCad">Cadastrar em Equipe técnica</button></div>`;
  $('goEquipeCad').onclick=()=>{closeModal();go('equipe');};
  $('modal').classList.remove('hidden');
  return;
 }
 const items=list.map(x=>`<button type="button" class="pick-item" data-id="${V8Report.esc(x.id)}"><b>${V8Report.esc(x.nome)}</b><span>${V8Report.esc(equipeMeta(x))}</span></button>`).join('');
 $('modalBody').innerHTML=`<div class="pick-list">${items}<button type="button" class="outline" id="clearPick">Limpar seleção</button></div>`;
 $('modalBody').querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{
  applyEquipePick(tipo,V8Storage.equipeGet(b.dataset.id));
  closeModal();
 });
 $('clearPick').onclick=()=>{applyEquipePick(tipo,null);closeModal();};
 $('modal').classList.remove('hidden');
}
function equipeMeta(x){
 if(x.tipo==='medico') return [x.registro?('CRM '+x.registro):'',x.rqe?('RQE '+x.rqe):'',x.email,x.telefone].filter(Boolean).join(' · ')||'Sem CRM informado';
 if(x.tipo==='engenheiro') return [x.registro?('CREA '+x.registro):'',x.funcao,x.email,x.telefone].filter(Boolean).join(' · ')||'Sem CREA informado';
 return [x.registro?('Registro '+x.registro):'',x.email,x.telefone].filter(Boolean).join(' · ')||'Sem registro informado';
}
function renderEquipeGroup(rootId,tipo){
 const root=$(rootId);
 if(!root) return;
 const list=V8Storage.equipeByTipo(tipo);
 if(!list.length){ root.innerHTML='<div class="notice">Nenhum profissional cadastrado neste grupo.</div>'; return; }
 root.innerHTML=list.map(x=>`<div class="entity-card"><div class="entity-head"><div><div class="entity-title">${V8Report.esc(x.nome)}</div><div class="entity-meta">${V8Report.esc(equipeMeta(x))}</div></div><div class="entity-actions"><button class="outline" type="button" data-ed="${V8Report.esc(x.id)}">Editar</button><button class="danger" type="button" data-del="${V8Report.esc(x.id)}">Excluir</button></div></div></div>`).join('');
 root.querySelectorAll('[data-ed]').forEach(b=>b.onclick=()=>openEquipeModal(tipo,b.dataset.ed));
 root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{
  if(!confirm('Excluir este profissional da equipe?')) return;
  V8Storage.removeEquipe(b.dataset.del);
  renderEquipe();
 });
}
function renderEquipe(){
 renderEquipeGroup('equipeSstList','sst');
 renderEquipeGroup('equipeMedicoList','medico');
 renderEquipeGroup('equipeEngList','engenheiro');
}
function openEquipeModal(tipo,id){
 const item=id?(V8Storage.equipeGet(id)||{tipo}):{tipo};
 const titles={sst:'Responsável SST',medico:'Médico do Trabalho',engenheiro:'Engenheiro de Segurança'};
 const funcDefault=tipo==='sst'?'Técnico de Segurança do Trabalho':tipo==='medico'?'Médico do Trabalho':'Engenheiro de Segurança do Trabalho';
 const regLabel=tipo==='medico'?'CRM':tipo==='engenheiro'?'CREA':'Registro profissional';
 $('modalTitle').textContent=(id?'Editar ':'Novo ')+titles[tipo];
 $('modalBody').innerHTML=`<div class="form-grid two"><label>Nome completo<input id="eqNome" value="${V8Report.esc(item.nome||'')}"></label>${tipo==='sst'?`<label>Registro<input id="eqRegistro" value="${V8Report.esc(item.registro||'')}"></label><input type="hidden" id="eqFuncao" value="${V8Report.esc(item.funcao||funcDefault)}">`:`<label>Função / atribuição<input id="eqFuncao" value="${V8Report.esc(item.funcao||funcDefault)}"></label><label>${regLabel}<input id="eqRegistro" value="${V8Report.esc(item.registro||'')}"></label>`}${tipo==='medico'?`<label>RQE<input id="eqRqe" value="${V8Report.esc(item.rqe||'')}"></label>`:''}<label>Telefone<input id="eqTel" value="${V8Report.esc(item.telefone||'')}"></label><label>E-mail<input id="eqEmail" type="email" value="${V8Report.esc(item.email||'')}"></label></div><div style="margin-top:14px;text-align:right"><button class="primary" type="button" id="saveEquipeBtn">Salvar</button></div>`;
 $('saveEquipeBtn').onclick=()=>{
  const nome=$('eqNome').value.trim();
  if(!nome) return alert('Informe o nome completo.');
  V8Storage.saveEquipe({id:item.id||('eq_'+Date.now()),tipo,nome,funcao:$('eqFuncao').value.trim()||funcDefault,registro:$('eqRegistro').value.trim(),rqe:$('eqRqe')?.value.trim()||'',telefone:$('eqTel').value.trim(),email:$('eqEmail').value.trim()});
  closeModal();
  renderEquipe();
  if($('respSstId')?.value){
   const sst=V8Storage.equipeGet($('respSstId').value); if(sst) applyEquipePick('sst',sst);
  }
  if($('medicoId')?.value){
   const med=V8Storage.equipeGet($('medicoId').value); if(med) applyEquipePick('medico',med);
  }
  if($('engId')?.value){
   const eng=V8Storage.equipeGet($('engId').value); if(eng) applyEquipePick('engenheiro',eng);
  }
 };
 $('modal').classList.remove('hidden');
}
function renderPgrSummary(){
 const p=collect(),high=p.riscos.filter(r=>Number(r.prob)*Number(r.sev)>=10).length,d=p.drps||{n:0,altos:[]};
 $('pgrSummary').innerHTML=`<div class="cards metrics" style="grid-template-columns:repeat(5,1fr)"><article><b>${p.setores.length}</b><span>Setores</span></article><article><b>${p.ghe.length}</b><span>GHEs</span></article><article><b>${p.riscos.length}</b><span>Riscos</span></article><article><b>${high}</b><span>Altos/críticos</span></article><article><b>${d.n||0}</b><span>DRPS respostas</span></article></div>
 <div class="notice" style="margin-top:12px">${d.n?`O PGR inclui o resultado coletivo do DRPS (${d.n} resposta(s); ${(d.altos||[]).length} tópico(s) com gravidade alta).`:'O PGR reserva a seção de riscos psicossociais. Quando houver respostas do DRPS, o resultado entra automaticamente no documento.'}</div>`;
}
function previewPgr(){const p=collect();if(!p.empresa.razaoSocial)return alert('Cadastre o condomínio primeiro.');window._previewProject=p;$('reportPreview').innerHTML=V8Report.build(p);$('reportModal').classList.remove('hidden')}
function drpsUrl(){
 V8Storage.ensureDrpsToken(project);
 return new URL('drps.html?c='+encodeURIComponent(project.drpsToken), document.baseURI).href;
}
function renderNr1(){
 V8Storage.ensureDrpsToken(project);
 if(project.empresa?.razaoSocial) V8Storage.save(project);
 if($('drpsLink')) $('drpsLink').value=drpsUrl();
 const list=V8Storage.drpsList(project.id);
 const sum=$('drpsSummary');
 if(sum){
  if(!list.length) sum.innerHTML='<div class="notice">Nenhuma resposta ainda. Copie o link e envie aos colaboradores, ou abra o formulário neste aparelho para preenchimento no local.</div>';
  else{
   const rows=DRPSData.TOPICS.map(t=>{
    const avgs=list.map(r=>DRPSData.topicAvg(r.answers||{},t)).filter(v=>v>0);
    const avg=avgs.length?avgs.reduce((a,b)=>a+b,0)/avgs.length:0;
    const g=DRPSData.gravidade(Math.round(avg));
    return `<tr><td>${V8Report.esc(t.nome)}</td><td>${avg.toFixed(2)}</td><td>${g.l}</td></tr>`;
   }).join('');
   sum.innerHTML=`<p class="notice">${list.length} resposta(s) coletiva(s) neste condomínio.</p><table class="table"><thead><tr><th>Tópico</th><th>Média (1–5)</th><th>Gravidade</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
 }
 const root=$('drpsList');
 if(!root) return;
 if(!list.length){ root.innerHTML='<div class="notice">As respostas aparecem aqui após o envio do formulário neste aparelho.</div>'; return; }
 root.innerHTML=list.map(r=>{
  const when=r.ts?new Date(r.ts).toLocaleString('pt-BR'):'';
  return `<div class="entity-card"><div class="entity-head"><div><div class="entity-title">${V8Report.esc(r.funcao||'Função não informada')} · ${V8Report.esc(r.setor||'Setor não informado')}</div><div class="entity-meta">${V8Report.esc(when)} · análise coletiva, sem nome</div></div></div></div>`;
 }).join('');
}
async function copyDrpsLink(){
 const url=drpsUrl();
 $('drpsLink').value=url;
 try{ await navigator.clipboard.writeText(url); alert('Link copiado. Envie aos colaboradores do condomínio.'); }
 catch(e){ $('drpsLink').select(); document.execCommand('copy'); alert('Link copiado.'); }
}
function exportDrpsCsv(){
 const list=V8Storage.drpsList(project.id);
 if(!list.length) return alert('Ainda não há respostas para exportar.');
 const head=['Carimbo de data/hora','Qual o seu cargo/ Função? ','Qual o seu Setor? '].concat(DRPSData.QUESTIONS.map(q=>String(q.n).padStart(2,'0')+' - '+q.title));
 const rows=list.map(r=>[
  r.ts?new Date(r.ts).toLocaleString('pt-BR'):'',
  r.funcao||'',
  r.setor||'',
  ...DRPSData.QUESTIONS.map(q=>r.answers?.[q.n]??'')
 ]);
 const csv=[head,...rows].map(line=>line.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(';')).join('\n');
 const b=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});
 const a=document.createElement('a');
 a.href=URL.createObjectURL(b);
 a.download=`DRPS_${(project.empresa?.razaoSocial||'condominio').replace(/[^\w]+/g,'_')}.csv`;
 a.click();
 URL.revokeObjectURL(a.href);
}
function renderAcessos(){
 const s=FFAuth.session();
 const root=$('usersList');
 if(!root) return;
 if(!s || s.role!=='admin'){ root.innerHTML=''; return; }
 const list=FFAuth.allUsers();
 root.innerHTML=list.map(u=>{
  const birth=u.birth?u.birth.split('-').reverse().join('/'):'—';
  const cpf=FFAuth.formatCPF(u.cpf||'');
  return `<div class="entity-card"><div class="entity-head"><div><div class="entity-title">${V8Report.esc(u.name)}</div><div class="entity-meta">${V8Report.esc(u.email||u.user)} · CPF ${V8Report.esc(cpf||'—')} · ${V8Report.esc(birth)} · ${u.role==='admin'?'Administrador':'Técnico'}${u.extra?'':' · cadastro principal'}</div></div>${u.extra?`<div class="entity-actions"><button class="danger" data-del="${V8Report.esc(u.user)}">Excluir</button></div>`:''}</div></div>`;
 }).join('');
 root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{ if(!confirm('Excluir este acesso?'))return; const r=FFAuth.removeUser(b.dataset.del); if(!r.ok)return alert(r.error); renderAcessos(); });
}
async function addAccessUser(){
 const res=await FFAuth.addUser({
  email:$('newUserLogin').value,
  name:$('newUserName').value,
  pass:$('newUserPass').value,
  cpf:$('newUserCpf').value,
  birth:$('newUserBirth').value,
  role:$('newUserRole').value
 });
 if(!res.ok)return alert(res.error);
 $('newUserLogin').value=$('newUserName').value=$('newUserPass').value=$('newUserCpf').value=$('newUserBirth').value='';
 renderAcessos();
 alert('Cadastro criado. No primeiro acesso, a pessoa confirma CPF e data de nascimento e cria a senha.');
}
async function changeMyPassword(){
 const s=FFAuth.session(); if(!s)return;
 const res=await FFAuth.changePassword(s.user,$('curPass').value,$('newPass').value);
 if(!res.ok)return alert(res.error);
 $('curPass').value=$('newPass').value='';
 alert('Senha atualizada.');
}
document.addEventListener('DOMContentLoaded',init);
