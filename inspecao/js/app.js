
const SECTIONS={
 "Documentação de SST":["PGR disponível e atualizado","PCMSO disponível e atualizado","LTCAT disponível ou tecnicamente avaliado","ASOs admissionais, periódicos e demissionais organizados","Fichas de entrega de EPI assinadas","Treinamentos obrigatórios registrados","Eventos de SST enviados ao eSocial"],
 "EPIs e uniformes":["EPIs adequados às atividades executadas","EPIs possuem CA válido","Empregados receberam orientação de uso e conservação","Há controle de substituição e higienização dos EPIs"],
 "Instalações e áreas comuns":["Portaria possui condições ergonômicas adequadas","Garagem possui iluminação e sinalização adequadas","Escadas e rampas possuem corrimãos e piso seguro","Casa de máquinas possui acesso controlado","Área da piscina está sinalizada e protegida","Depósito está organizado e sem obstruções","Área de resíduos possui condições de higiene e acesso seguro"],
 "Eletricidade e incêndio":["Quadros elétricos estão fechados, identificados e sem partes expostas","Não há fios desencapados ou instalações improvisadas","Extintores estão sinalizados, acessíveis e dentro da validade","Rotas e saídas de emergência estão desobstruídas","Iluminação de emergência está funcionando"],
 "Produtos químicos e limpeza":["Produtos químicos estão identificados","Produtos possuem FISPQ/SDS disponível quando aplicável","Armazenamento de produtos é ventilado e seguro","Não há mistura ou reaproveitamento inadequado de embalagens","Trabalhadores utilizam luvas e proteção adequada"],
 "Máquinas, ferramentas e trabalho em altura":["Escadas portáteis estão íntegras e adequadas","Ferramentas manuais estão conservadas","Atividades em altura são planejadas e executadas por trabalhador capacitado","Máquinas e equipamentos possuem proteção e manutenção","Serviços elétricos são realizados por profissional autorizado"],
 "Riscos ocupacionais":["Riscos físicos foram identificados","Riscos químicos foram identificados","Riscos biológicos foram identificados","Riscos ergonômicos foram identificados","Riscos de acidentes foram identificados","Há medidas de prevenção compatíveis com os riscos encontrados"]
};
let currentId=null, coverPhoto='', photos={};

const $=id=>document.getElementById(id);
const fields=['condominio','cnpj','endereco','sindica','telefone','emailCondominio','dataVisita','tecnico','objetivo','totalEmpregados','proprios','terceirizados','funcoes','jornadas','conclusao','recomendacoes','assinaturaSindica','assinaturaTecnico'];

function inFrame(){
 try{ return window.self!==window.top; }catch(e){ return true; }
}
function currentUser(){
 try{
  if(inFrame() && parent.FFAuth){
   const s=parent.FFAuth.session();
   if(s) return s;
  }
 }catch(e){}
 return (window.FFAuth && FFAuth.session()) || null;
}
function applyCadastro(ctx){
 if(!ctx) return;
 window._condoCtx=ctx;
 const map={condominio:ctx.condominio,cnpj:ctx.cnpj,endereco:ctx.endereco,sindica:ctx.sindica,telefone:ctx.telefone,emailCondominio:ctx.emailCondominio,dataVisita:ctx.dataVisita,tecnico:ctx.tecnico};
 Object.entries(map).forEach(([id,val])=>{ const el=$(id); if(el && val) el.value=val; });
 if(ctx.sindica && $('assinaturaSindica') && !$('assinaturaSindica').value) $('assinaturaSindica').value=ctx.sindica;
 if(ctx.tecnico && $('assinaturaTecnico')) $('assinaturaTecnico').value=ctx.tecnico;
 ['condominio','cnpj','endereco','sindica','telefone','emailCondominio'].forEach(id=>{
  const el=$(id); if(el) el.readOnly=!!ctx.locked;
 });
 $('cadastroBanner')?.classList.toggle('hidden', !ctx.locked);
 renderHistory();
}
function pullCadastro(){
 try{
  if(inFrame() && parent.inspectionContext) applyCadastro(parent.inspectionContext());
 }catch(e){}
}
function technicianFromContext(){
 try{
  if(inFrame() && parent.inspectionContext) return parent.inspectionContext()?.tecnico||'';
 }catch(e){}
 return '';
}
function init(){
 const session=currentUser();
 if(!session){
  if(inFrame()) return;
  location.replace('../index.html');
  return;
 }
 $('dataVisita').value=new Date().toISOString().slice(0,10);
 const tec=technicianFromContext();
 $('tecnico').value=tec;
 $('assinaturaTecnico').value=tec;
 $('reportNumber').textContent=FFStorage.nextNumber();
 renderChecklist(); renderHistory();
 $('newBtn').onclick=newReport;$('saveBtn').onclick=saveReport;$('savedBtn').onclick=openSaved;
 $('previewBtn').onclick=()=>preview(collect());$('pdfBtn').onclick=()=>FFReport.print(collect());$('csvBtn').onclick=exportCSV;
 $('closeSaved').onclick=closeSaved;$('closePreview').onclick=closePreview;$('printFromPreview').onclick=()=>FFReport.print(collectPreviewData());
 $('editFromPreview').onclick=()=>{closePreview();window.scrollTo({top:0,behavior:'smooth'})};
 $('searchSaved').oninput=renderSaved;
 $('autoConclusionBtn').onclick=autoConclusion;
 $('fotoCapaInput').onchange=e=>readCover(e.target.files[0]);
 $('cnpj').addEventListener('input',e=>{ if(!$('cnpj').readOnly) e.target.value=formatCNPJ(e.target.value); });
 pullCadastro();
 window.addEventListener('message',e=>{ if(e.data?.type==='ff-cadastro') applyCadastro(e.data.ctx); });
}


function formatCNPJ(value){
 const digits=String(value||'').replace(/\D/g,'').slice(0,14);
 let out=digits;
 if(digits.length>2) out=digits.slice(0,2)+'.'+digits.slice(2);
 if(digits.length>5) out=digits.slice(0,2)+'.'+digits.slice(2,5)+'.'+digits.slice(5);
 if(digits.length>8) out=digits.slice(0,2)+'.'+digits.slice(2,5)+'.'+digits.slice(5,8)+'/'+digits.slice(8);
 if(digits.length>12) out=digits.slice(0,2)+'.'+digits.slice(2,5)+'.'+digits.slice(5,8)+'/'+digits.slice(8,12)+'-'+digits.slice(12);
 return out;
}

function renderChecklist(data={}){
 const root=$('checklist');root.innerHTML='';let idx=0;
 Object.entries(SECTIONS).forEach(([cat,items])=>{
  const h=document.createElement('div');h.className='category-title';h.textContent=cat;root.appendChild(h);
  items.forEach(title=>{
   const id='item_'+idx++, s=data[id]||{};
   const d=document.createElement('div');d.className='check-item';d.dataset.id=id;d.dataset.status=s.status||'Pendente';
   d.innerHTML=`<div class="check-title">${title}</div>
    <div class="status-row">${['Conforme','Não conforme','Não se aplica'].map(st=>`<button type="button" class="status-btn ${s.status===st?'active':''}" data-status="${st}">${st}</button>`).join('')}</div>
    <div class="item-details ${s.status==='Não conforme'?'show':''}">
     <div class="item-grid">
      <label>Observação / irregularidade<textarea class="obs">${s.obs||''}</textarea></label>
      <label>Medida recomendada<textarea class="acao">${s.acao||''}</textarea></label>
      <label>Nível de risco<select class="risco">${['Baixo','Médio','Alto','Crítico'].map(r=>`<option ${s.risco===r?'selected':''}>${r}</option>`).join('')}</select></label>
      <label>Prazo para correção<input type="date" class="prazo" value="${s.prazo||''}"></label>
      <label>Responsável pela ação<input class="responsavel" value="${s.responsavel||'Administração do condomínio'}"></label>
     </div>
    </div>
    <div class="photo-buttons">
     <label class="photo-btn">📷 Tirar foto<input hidden type="file" accept="image/*" capture="environment" data-photo="${id}"></label>
     <label class="photo-btn">🖼️ Galeria<input hidden type="file" accept="image/*" multiple data-gallery="${id}"></label>
    </div><div class="photo-strip" id="photos_${id}"></div>`;
   root.appendChild(d); photos[id]=s.photos||[]; renderPhotos(id);
   d.querySelectorAll('.status-btn').forEach(b=>b.onclick=()=>setStatus(id,b.dataset.status,b));
   d.querySelector(`[data-photo="${id}"]`).onchange=e=>addFiles(id,[...e.target.files]);
   d.querySelector(`[data-gallery="${id}"]`).onchange=e=>addFiles(id,[...e.target.files]);
  });
 });updateSummary();
}
function setStatus(id,status,btn){const el=document.querySelector(`[data-id="${id}"]`);el.dataset.status=status;el.querySelectorAll('.status-btn').forEach(b=>b.classList.toggle('active',b===btn));el.querySelector('.item-details').classList.toggle('show',status==='Não conforme');updateSummary()}
function addFiles(id,files){files.forEach(f=>{const r=new FileReader();r.onload=e=>{photos[id]=photos[id]||[];photos[id].push(e.target.result);renderPhotos(id)};r.readAsDataURL(f)})}
function renderPhotos(id){const root=$('photos_'+id);if(!root)return;root.innerHTML='';(photos[id]||[]).forEach((src,i)=>{const d=document.createElement('div');d.className='photo-card';d.innerHTML=`<img src="${src}"><button type="button">Remover</button>`;d.querySelector('button').onclick=()=>{photos[id].splice(i,1);renderPhotos(id)};root.appendChild(d)})}
function readCover(file){if(!file)return;const r=new FileReader();r.onload=e=>{coverPhoto=e.target.result;$('fotoCapaPreview').innerHTML=`<img src="${coverPhoto}">`};r.readAsDataURL(file)}
function collect(){
 const d={};fields.forEach(f=>d[f]=$(f).value);d.id=currentId||Date.now().toString();d.numero=$('reportNumber').textContent;d.fotoCapa=coverPhoto;d.checklist={};d.salvoEm=new Date().toLocaleString('pt-BR');
 d.condominioId=window._condoCtx?.condominioId||'';
 d.agendaId=window._condoCtx?.agendaId||'';
 document.querySelectorAll('.check-item').forEach(el=>{const id=el.dataset.id;d.checklist[id]={titulo:el.querySelector('.check-title').textContent,status:el.dataset.status||'Pendente',obs:el.querySelector('.obs').value,acao:el.querySelector('.acao').value,risco:el.querySelector('.risco').value,prazo:el.querySelector('.prazo').value,responsavel:el.querySelector('.responsavel').value,photos:photos[id]||[]}})
 return d;
}
function saveReport(){
 const d=collect();
 if(!d.condominio)return alert('Cadastre o condomínio no sistema antes de salvar a inspeção.');
 currentId=d.id;
 const existed=!!FFStorage.get(d.id);
 FFStorage.save(d);
 try{ parent.markAgendaDone?.(d.agendaId,d.id); }catch(e){}
 $('editingBanner').classList.add('hidden');
 $('saveBtn').textContent='Salvar';
 renderHistory();
 alert(existed?'Alterações salvas com sucesso.':'Inspeção salva. Os laudos já podem ser emitidos com os dados deste condomínio.');
}
function loadReport(id,editing=true){const d=FFStorage.get(id);if(!d)return;currentId=id;fields.forEach(f=>$(f).value=d[f]||'');$('reportNumber').textContent=d.numero||FFStorage.nextNumber();coverPhoto=d.fotoCapa||'';$('fotoCapaPreview').innerHTML=coverPhoto?`<img src="${coverPhoto}">`:'';photos={};renderChecklist(d.checklist||{});if(editing){$('editingBanner').classList.remove('hidden');$('saveBtn').textContent='Salvar alterações'}closeSaved();window.scrollTo({top:0,behavior:'smooth'})}
function preview(d){if(!d.condominio)return alert('Informe o condomínio antes da prévia.');$('reportPreview').innerHTML=FFReport.build(d);$('previewModal').classList.remove('hidden');document.body.style.overflow='hidden';window.__previewData=d}
function collectPreviewData(){return window.__previewData||collect()}
function closePreview(){$('previewModal').classList.add('hidden');document.body.style.overflow=''}
function openSaved(){$('savedModal').classList.remove('hidden');document.body.style.overflow='hidden';renderSaved()}
function closeSaved(){$('savedModal').classList.add('hidden');document.body.style.overflow=''}
function reportsForCondo(){
 const all=FFStorage.list();
 const id=window._condoCtx?.condominioId;
 const nome=String(window._condoCtx?.condominio||'').trim().toLowerCase();
 if(!id && !nome) return all;
 return all.filter(d=>d.condominioId===id || (!d.condominioId && nome && String(d.condominio||'').trim().toLowerCase()===nome));
}
function renderHistory(){renderHistoryInto($('history'),reportsForCondo())}
function renderSaved(){const q=$('searchSaved').value.toLowerCase();renderHistoryInto($('savedList'),reportsForCondo().filter(d=>(d.condominio||'').toLowerCase().includes(q)))}
function renderHistoryInto(root,list){root.innerHTML=list.length?'':'<div style="color:#667085">Nenhum relatório salvo.</div>';list.forEach(d=>{const nc=Object.values(d.checklist||{}).filter(i=>i.status==='Não conforme').length;const el=document.createElement('div');el.className='history-item';el.innerHTML=`<div><div class="history-title">${FFReport.esc(d.condominio||'Sem nome')}</div><div class="history-meta">${FFReport.esc(d.numero||'')} · ${FFReport.fmt(d.dataVisita)} · ${nc} não conformidade(s)</div></div><div class="history-actions"><button class="outline small">Prévia</button><button class="primary small">Editar</button><button class="dark small">PDF</button><button class="outline small">Duplicar</button><button class="danger small">Excluir</button></div>`;const bs=el.querySelectorAll('button');bs[0].onclick=()=>preview(d);bs[1].onclick=()=>loadReport(d.id,true);bs[2].onclick=()=>FFReport.print(d);bs[3].onclick=()=>duplicate(d.id);bs[4].onclick=()=>removeReport(d.id);root.appendChild(el)})}
function removeReport(id){if(!confirm('Excluir este relatório?'))return;FFStorage.remove(id);renderHistory();renderSaved()}
function duplicate(id){const d=structuredClone?structuredClone(FFStorage.get(id)):JSON.parse(JSON.stringify(FFStorage.get(id)));if(!d)return;d.id=Date.now().toString();d.numero=FFStorage.nextNumber();d.salvoEm=new Date().toLocaleString('pt-BR');FFStorage.save(d);renderHistory();renderSaved();alert(`Relatório duplicado como ${d.numero}.`)}
function newReport(){if(!confirm('Iniciar nova inspeção? Salve as alterações atuais antes de continuar.'))return;currentId=null;coverPhoto='';photos={};fields.forEach(f=>$(f).value='');const tec=technicianFromContext();$('tecnico').value=tec;$('assinaturaTecnico').value=tec;$('objetivo').value='Avaliar as condições de segurança e saúde no ambiente de trabalho do condomínio, identificar perigos e recomendar medidas preventivas e corretivas.';$('dataVisita').value=new Date().toISOString().slice(0,10);$('reportNumber').textContent=FFStorage.nextNumber();$('fotoCapaPreview').innerHTML='';$('editingBanner').classList.add('hidden');$('saveBtn').textContent='Salvar';renderChecklist();pullCadastro()}
function updateSummary(){let c=0,nc=0,p=0;document.querySelectorAll('.check-item').forEach(el=>{const s=el.dataset.status;if(s==='Conforme')c++;else if(s==='Não conforme')nc++;else if(s==='Pendente')p++});$('sumConforme').textContent=c;$('sumNaoConforme').textContent=nc;$('sumPendente').textContent=p}
function autoConclusion(){const d=collect(),items=Object.values(d.checklist),nc=items.filter(i=>i.status==='Não conforme'),high=nc.filter(i=>['Alto','Crítico'].includes(i.risco));$('conclusao').value=nc.length?`A inspeção realizada identificou ${nc.length} não conformidade(s) nas condições avaliadas${high.length?`, sendo ${high.length} classificada(s) como risco alto ou crítico`:''}. Recomenda-se a implementação das medidas corretivas indicadas neste relatório, priorizando os riscos de maior gravidade e acompanhando o cumprimento dos prazos estabelecidos. Após as adequações, recomenda-se nova verificação das condições de trabalho.`:`Na inspeção realizada não foram identificadas não conformidades nos itens avaliados. Recomenda-se a manutenção das medidas preventivas existentes, o acompanhamento periódico das condições de trabalho e a atualização contínua dos documentos e controles de SST.`}
function exportCSV(){const d=collect(),rows=[['Relatório',d.numero],['Condomínio',d.condominio],['Data',d.dataVisita],[],['Item','Situação','Risco','Observação','Medida recomendada','Responsável','Prazo']];Object.values(d.checklist).forEach(i=>rows.push([i.titulo,i.status,i.risco,i.obs,i.acao,i.responsavel,i.prazo]));const csv=rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(';')).join('\n');const b=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=`${d.numero}_${(d.condominio||'condominio').replace(/[^\w]+/g,'_')}.csv`;a.click();URL.revokeObjectURL(a.href)}
window.FFInspecao={
 applyCadastro,
 loadReport,
 previewSaved(id){ const d=FFStorage.get(id); if(d) preview(d); },
 printSaved(id){ const d=FFStorage.get(id); if(d) FFReport.print(d); }
};
document.addEventListener('DOMContentLoaded',init);
