
const DRPSForm=(()=>{
 const TOTAL=15;
 let page=1, state={funcao:'',setor:'',answers:{}}, condo=null, token='', condoNome='', lastRec=null;
 const $=id=>document.getElementById(id);
 function tokenFromUrl(){
  const q=new URLSearchParams(location.search);
  return (q.get('c')||q.get('token')||'').trim();
 }
 function nomeFromUrl(){
  const q=new URLSearchParams(location.search);
  return (q.get('n')||'').trim();
 }
 function boot(){
  if(ingestFromUrl()) return;
  token=tokenFromUrl();
  condoNome=nomeFromUrl();
  condo=token?V8Storage.byDrpsToken(token):null;
  const nome=condo?.empresa?.razaoSocial||condoNome;
  if(nome) $('drpsCondo').textContent=nome+' — respostas confidenciais, análise coletiva. Este link é exclusivo deste condomínio.';
  else if(token) $('drpsCondo').textContent='Formulário exclusivo do condomínio. Respostas confidenciais, análise coletiva.';
  else $('drpsCondo').textContent='Abra o link enviado pelo seu condomínio para vincular suas respostas.';
  render();
  $('drpsBack').onclick=()=>{ if(page>1 && page<=TOTAL){ page--; render(); } };
  $('drpsNext').onclick=next;
  $('drpsClear').onclick=()=>{ if(confirm('Limpar todas as respostas?')){ state={funcao:'',setor:'',answers:{}}; page=1; lastRec=null; render(); } };
 }
 function ingestFromUrl(){
  const payload=new URLSearchParams(location.search).get('save');
  if(!payload) return false;
  const rec=DRPSData.decodeReply(payload);
  $('drpsBack').disabled=true;
  $('drpsNext').style.display='none';
  $('drpsClear').style.display='none';
  if(!rec){
   $('drpsCondo').textContent='Comprovante inválido.';
   $('drpsPages').innerHTML='<div class="card thanks"><h2>Não foi possível registrar</h2><p>O comprovante está incompleto. Peça ao colaborador para reenviar o link.</p></div>';
   $('drpsPageLabel').textContent='Erro';
   return true;
  }
  const found=V8Storage.byDrpsToken(rec.token);
  rec.condominioId=found?.id||'';
  rec.condominio=found?.empresa?.razaoSocial||rec.condominio||'';
  const all=V8Storage.drpsList();
  const dup=all.some(x=>x.id===rec.id || (x.token===rec.token && x.ts===rec.ts && x.funcao===rec.funcao && x.setor===rec.setor));
  if(!dup) V8Storage.saveDrps(rec);
  const nome=rec.condominio||'condomínio';
  $('drpsCondo').textContent=nome+' — resposta registrada neste aparelho.';
  $('drpsBar').style.width='100%';
  $('drpsPageLabel').textContent='Registrado';
  $('drpsPages').innerHTML=`<div class="card thanks"><h2>${dup?'Resposta já registrada':'Resposta registrada'}</h2><p>A participação confidencial de <b>${esc(rec.funcao||'colaborador')}</b>${rec.setor?' · '+esc(rec.setor):''} entrou na análise coletiva de <b>${esc(nome)}</b>.</p><p>Abra o sistema SST em <b>NR-1 / DRPS</b> neste mesmo navegador para ver o resumo.</p></div>`;
  return true;
 }
 function next(){
  if(!validate()) return;
  if(page===TOTAL){ submit(); return; }
  page++;
  render();
  window.scrollTo({top:0,behavior:'smooth'});
 }
 function validate(){
  document.querySelectorAll('.card.invalid').forEach(el=>el.classList.remove('invalid'));
  if(page===2){
   state.funcao=$('qFuncao')?.value.trim()||'';
   state.setor=$('qSetor')?.value.trim()||'';
   let ok=true;
   if(!state.funcao){ $('cardFuncao')?.classList.add('invalid'); ok=false; }
   if(!state.setor){ $('cardSetor')?.classList.add('invalid'); ok=false; }
   return ok;
  }
  if(page>=3 && page<=15){
   const topic=DRPSData.TOPICS[page-3];
   let ok=true;
   topic.qs.forEach(n=>{
    const el=document.querySelector(`input[name="q${n}"]:checked`);
    if(!el){ document.getElementById('card'+n)?.classList.add('invalid'); ok=false; }
    else state.answers[n]=Number(el.value);
   });
   return ok;
  }
  return true;
 }
 function submit(){
  if(!validate()) return;
  lastRec={
   id:Date.now().toString(),
   condominioId:condo?.id||'',
   token,
   condominio:condo?.empresa?.razaoSocial||condoNome||'',
   funcao:state.funcao,
   setor:state.setor,
   answers:{...state.answers},
   ts:new Date().toISOString()
  };
  if(condo) V8Storage.saveDrps(lastRec);
  page=16;
  render();
 }
 function shareComprovante(){
  if(!lastRec) return;
  const url=DRPSData.ingestUrl(lastRec);
  const nome=lastRec.condominio||'condomínio';
  const text=`DRPS respondido — ${nome}\n\nPara registrar no sistema da Futuro Facilite, abra este comprovante no computador de atendimento:\n\n${url}`;
  window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank');
 }
 async function copyComprovante(){
  if(!lastRec) return;
  const url=DRPSData.ingestUrl(lastRec);
  try{ await navigator.clipboard.writeText(url); alert('Comprovante copiado. Envie ao responsável SST.'); }
  catch(e){ alert(url); }
 }
 function render(){
  const root=$('drpsPages');
  $('drpsBack').disabled=page<=1 || page>TOTAL;
  $('drpsNext').textContent=page===TOTAL?'Enviar':'Avançar';
  $('drpsNext').style.display=page===16?'none':'inline-block';
  $('drpsBar').style.width=Math.min(100, Math.round((Math.min(page,TOTAL)/TOTAL)*100))+'%';
  $('drpsPageLabel').textContent=page<=TOTAL?`Página ${page} de ${TOTAL}`:'Enviado';
  if(page===1){
   const nome=condo?.empresa?.razaoSocial||condoNome;
   root.innerHTML=`<div class="card intro">
     <p><b>Bem-vindo(a) ao DRPS – Diagnóstico de Riscos Psicossociais.</b></p>
     ${nome?`<p>Este formulário é <b>exclusivo do condomínio ${esc(nome)}</b>. Não utilize o link de outro condomínio.</p>`:''}
     <p>Este inventário identifica fatores de risco psicossocial no ambiente de trabalho, conforme a NR-1 e o guia do Ministério do Trabalho e Emprego.</p>
     <p>As respostas são <b>confidenciais</b> e analisadas de forma coletiva, sem identificação individual, em conformidade com a LGPD. São 50 perguntas sobre organização do trabalho, relações, suporte, comunicação e carga de trabalho.</p>
     <p>Responda com sinceridade, com base na sua experiência real. Seu preenchimento ajuda a construir um ambiente mais saudável e seguro.</p>
     <p>Ao avançar, você se compromete a informar a verdade, sem omitir ou exagerar fatos.</p>
    </div>`;
   return;
  }
  if(page===2){
   const funcoes=(condo?.funcoes||[]).map(f=>f.nome).filter(Boolean);
   const setores=(condo?.setores||[]).map(s=>s.nome).filter(Boolean);
   root.innerHTML=`<div class="card intro"><p>Começaremos a sua avaliação conhecendo um pouco de você e do que você faz!</p></div>
    <div class="card req" id="cardFuncao"><h2>Qual a sua função?</h2><input id="qFuncao" list="listFuncoes" placeholder="Sua resposta" value="${esc(state.funcao)}"><datalist id="listFuncoes">${funcoes.map(escOpt).join('')}</datalist><div class="err">Esta pergunta é obrigatória</div></div>
    <div class="card req" id="cardSetor"><h2>Qual o seu setor?</h2><input id="qSetor" list="listSetores" placeholder="Sua resposta" value="${esc(state.setor)}"><datalist id="listSetores">${setores.map(escOpt).join('')}</datalist><div class="err">Esta pergunta é obrigatória</div></div>`;
   return;
  }
  if(page>=3 && page<=15){
   const topic=DRPSData.TOPICS[page-3];
   root.innerHTML=`<div class="card intro"><p><b>Tópico ${String(topic.id).padStart(2,'0')} — ${esc(topic.nome)}</b></p></div>`+
    DRPSData.QUESTIONS.filter(q=>topic.qs.includes(q.n)).map(q=>questionCard(q)).join('');
   return;
  }
  const local=!!condo;
  const url=lastRec?DRPSData.ingestUrl(lastRec):'';
  root.innerHTML=`<div class="card thanks">
    <h2>Resposta enviada</h2>
    <p>Obrigado. Sua participação é confidencial e entra na análise coletiva do condomínio.</p>
    ${local?'<p>Esta resposta já ficou registrada neste aparelho.</p>':'<p><b>Último passo:</b> envie o comprovante ao responsável SST (responda a mensagem em que você recebeu o link), para a resposta entrar no sistema do condomínio.</p>'}
    <p style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
      <button type="button" class="ghost" id="drpsShareWa">Enviar comprovante no WhatsApp</button>
      <button type="button" class="ghost" id="drpsCopyComp">Copiar comprovante</button>
    </p>
    ${url?`<p class="hint" style="word-break:break-all;font-size:11px">${esc(url)}</p>`:''}
   </div>`;
  $('drpsShareWa')?.addEventListener('click',shareComprovante);
  $('drpsCopyComp')?.addEventListener('click',copyComprovante);
 }
 function questionCard(q){
  const sel=state.answers[q.n];
  return `<div class="card req" id="card${q.n}">
    <h2>${q.n} — ${esc(q.title)}</h2>
    <p class="hint">${esc(q.hint)}</p>
    <div class="scale">${DRPSData.SCALE.map(s=>`<label><input type="radio" name="q${q.n}" value="${s.v}" ${sel===s.v?'checked':''}> ${s.l}</label>`).join('')}</div>
    <div class="err">Esta pergunta é obrigatória</div>
   </div>`;
 }
 function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
 function escOpt(v){return `<option value="${esc(v)}">`}
 document.addEventListener('DOMContentLoaded',boot);
 return {boot};
})();
