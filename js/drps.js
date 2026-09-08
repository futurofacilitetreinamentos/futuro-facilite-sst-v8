
const DRPSForm=(()=>{
 const TOTAL=15;
 let page=1, state={funcao:'',setor:'',answers:{}}, condo=null, token='';
 const $=id=>document.getElementById(id);
 function tokenFromUrl(){
  const q=new URLSearchParams(location.search);
  return (q.get('c')||q.get('token')||'').trim();
 }
 function boot(){
  token=tokenFromUrl();
  condo=token?V8Storage.byDrpsToken(token):null;
  if(condo) $('drpsCondo').textContent=(condo.empresa?.razaoSocial||'Condomínio')+' — respostas confidenciais, análise coletiva.';
  else if(token) $('drpsCondo').textContent='Link do condomínio não encontrado neste aparelho. Você ainda pode responder; o técnico reunirá as respostas no equipamento de atendimento.';
  else $('drpsCondo').textContent='Abra o link enviado pelo condomínio para vincular suas respostas.';
  render();
  $('drpsBack').onclick=()=>{ if(page>1){ page--; render(); } };
  $('drpsNext').onclick=next;
  $('drpsClear').onclick=()=>{ if(confirm('Limpar todas as respostas?')){ state={funcao:'',setor:'',answers:{}}; page=1; render(); } };
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
  const rec={
   id:Date.now().toString(),
   condominioId:condo?.id||'',
   token,
   condominio:condo?.empresa?.razaoSocial||'',
   funcao:state.funcao,
   setor:state.setor,
   answers:{...state.answers},
   ts:new Date().toISOString()
  };
  V8Storage.saveDrps(rec);
  page=16;
  render();
 }
 function render(){
  const root=$('drpsPages');
  $('drpsBack').disabled=page<=1 || page>TOTAL;
  $('drpsNext').textContent=page===TOTAL?'Enviar':'Avançar';
  $('drpsNext').style.display=page===16?'none':'inline-block';
  $('drpsBar').style.width=Math.min(100, Math.round((Math.min(page,TOTAL)/TOTAL)*100))+'%';
  $('drpsPageLabel').textContent=page<=TOTAL?`Página ${page} de ${TOTAL}`:'Enviado';
  if(page===1){
   root.innerHTML=`<div class="card intro">
     <p><b>Bem-vindo(a) ao DRPS – Diagnóstico de Riscos Psicossociais.</b></p>
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
  root.innerHTML=`<div class="card thanks"><h2>Resposta enviada</h2><p>Obrigado. Sua participação é confidencial e entra na análise coletiva do condomínio.</p></div>`;
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
