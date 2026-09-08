
const FFReport = (() => {
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const fmt=d=>{if(!d)return'-';const p=String(d).split('-');return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:d};
  const statusClass=s=>s==='Conforme'?'ok':s==='Não conforme'?'bad':'na';
  const riskClass=r=>r==='Baixo'?'risk-low':r==='Médio'?'risk-med':r==='Alto'?'risk-high':'risk-critical';

  function head(title='RELATÓRIO DE INSPEÇÃO DE SEGURANÇA DO TRABALHO'){
    return `<div class="report-header"><img src="assets/logo.png"><div class="report-header-title">${title}</div></div>`;
  }
  function foot(page,total){
    return `<div class="report-footer"><span>☎ (61) 98515-0519 &nbsp;&nbsp; ✉ futurofacilitetreinamentos@gmail.com</span><span class="brand">Futuro Facilite Treinamentos &nbsp; • &nbsp; Página ${page} de ${total}</span></div>`;
  }
  function wrap(content,page,total,title){
    return `<section class="report-sheet">${head(title)}<div class="page-content">${content}</div>${foot(page,total)}</section>`;
  }
  function cover(d,page,total){
    const cover=d.fotoCapa?`<div class="cover-photo"><img src="${d.fotoCapa}"></div>`:`<div class="cover-photo" style="display:grid;place-items:center;color:#667085;font-weight:700">RELATÓRIO TÉCNICO DE SST</div>`;
    return `<section class="report-sheet cover-sheet">
      <div class="cover-top"><img class="logo" src="assets/logo.png"><div class="cover-title">RELATÓRIO DE INSPEÇÃO<br>DE SEGURANÇA DO TRABALHO</div><div class="cover-subtitle">${esc(d.numero)}</div></div>
      ${cover}
      <div class="cover-info">
        <div class="wide"><div class="cover-label">Condomínio</div><div class="cover-value">${esc(d.condominio||'-')}</div></div>
        <div><div class="cover-label">Síndica / responsável</div><div class="cover-value">${esc(d.sindica||'-')}</div></div>
        <div><div class="cover-label">Data da inspeção</div><div class="cover-value">${fmt(d.dataVisita)}</div></div>
        <div class="wide"><div class="cover-label">Endereço</div><div class="cover-value">${esc(d.endereco||'-')}</div></div>
        <div class="wide"><div class="cover-label">Responsável técnico</div><div class="cover-value">${esc(d.tecnico||'-')}</div></div>
      </div>
      <div class="cover-band"><span>Futuro Facilite Treinamentos</span><span>(61) 98515-0519 · futurofacilitetreinamentos@gmail.com</span></div>
    </section>`;
  }

  function summaryPage(d,page,total){
    const items=Object.values(d.checklist||{});
    const c=items.filter(i=>i.status==='Conforme').length, nc=items.filter(i=>i.status==='Não conforme').length, na=items.filter(i=>i.status==='Não se aplica').length, p=items.length-c-nc-na;
    const pct=(c+nc)>0?Math.round(c/(c+nc)*100):0;
    const content=`
      <h1 class="r-title">1. Identificação e resumo executivo</h1>
      <table class="info-table">
       <tr><td>Condomínio</td><td>${esc(d.condominio||'-')}</td></tr><tr><td>CNPJ</td><td>${esc(d.cnpj||'-')}</td></tr>
       <tr><td>Endereço</td><td>${esc(d.endereco||'-')}</td></tr><tr><td>Síndica / responsável</td><td>${esc(d.sindica||'-')}</td></tr>
       <tr><td>Contato</td><td>${esc(d.telefone||'-')} ${d.emailCondominio?' · '+esc(d.emailCondominio):''}</td></tr>
       <tr><td>Data da inspeção</td><td>${fmt(d.dataVisita)}</td></tr>
       <tr><td>Responsável técnico</td><td>${esc(d.tecnico||'-')}</td></tr>
       <tr><td>Colaboradores</td><td>Total: ${esc(d.totalEmpregados||'0')} · Próprios: ${esc(d.proprios||'0')} · Terceirizados: ${esc(d.terceirizados||'0')}</td></tr>
      </table>
      <h2 class="r-subtitle">Resumo da avaliação</h2>
      <div class="metrics"><div class="metric"><b>${c}</b><span>Conformes</span></div><div class="metric"><b>${nc}</b><span>Não conformes</span></div><div class="metric"><b>${na}</b><span>Não se aplica</span></div><div class="metric"><b>${p}</b><span>Pendentes</span></div></div>
      <div class="r-note"><b>Índice de conformidade: ${pct}%</b></div><div class="progress"><div style="width:${pct}%"></div></div>
      <h2 class="r-subtitle">Objetivo da inspeção</h2><div class="r-note">${esc(d.objetivo||'-')}</div>
      <h2 class="r-subtitle">Funções e jornadas observadas</h2><div class="r-note"><b>Funções:</b> ${esc(d.funcoes||'-')}<br><br><b>Jornadas:</b> ${esc(d.jornadas||'-')}</div>
    `;
    return wrap(content,page,total);
  }

  function checklistPages(d){
    const items=Object.values(d.checklist||{});
    const chunks=[]; for(let i=0;i<items.length;i+=15) chunks.push(items.slice(i,i+15));
    return chunks.map((chunk,idx)=>({kind:'normal', content:`
      <h1 class="r-title">2. Checklist geral ${chunks.length>1?`(${idx+1}/${chunks.length})`:''}</h1>
      <table class="check-table"><thead><tr><th>Nº</th><th>Item avaliado</th><th>Situação</th><th>Risco</th><th>Prazo</th></tr></thead><tbody>
      ${chunk.map((i,j)=>`<tr><td>${idx*15+j+1}</td><td>${esc(i.titulo)}</td><td class="status-text ${statusClass(i.status)}">${esc(i.status||'Pendente')}</td><td class="${riskClass(i.risco)}">${esc(i.risco||'-')}</td><td>${fmt(i.prazo)}</td></tr>`).join('')}
      </tbody></table>`}));
  }

  function nonConformPages(d){
    const items=Object.values(d.checklist||{}).filter(i=>i.status==='Não conforme');
    const pages=[];
    items.forEach((i,idx)=>{
      const photos=i.photos||[];
      pages.push({kind:'normal',content:`
       <h1 class="r-title">3. Detalhamento das não conformidades</h1>
       <div class="nc-card"><div class="nc-title">${idx+1}. ${esc(i.titulo)}</div>
       <div class="nc-meta"><span><b>Situação:</b> Não conforme</span><span><b>Nível de risco:</b> <span class="${riskClass(i.risco)}">${esc(i.risco||'-')}</span></span><span><b>Prazo:</b> ${fmt(i.prazo)}</span></div>
       <div class="nc-block"><b>Observação técnica</b><br>${esc(i.obs||'Não informada')}</div>
       <div class="nc-block"><b>Medida recomendada</b><br>${esc(i.acao||'Não informada')}</div>
       ${photos.slice(0,2).length?`<div class="nc-photos">${photos.slice(0,2).map(p=>`<img src="${p}">`).join('')}</div>`:''}
       </div>`});
      if(photos.length>2){
        for(let x=2;x<photos.length;x+=4){
          const pp=photos.slice(x,x+4);
          pages.push({kind:'normal',content:`<h1 class="r-title">3. Registro complementar — ${esc(i.titulo)}</h1><div class="photo-grid">${pp.map((p,n)=>`<div class="photo-record"><img src="${p}"><div>${esc(i.titulo)} — foto ${x+n+1}</div></div>`).join('')}</div>`});
        }
      }
    });
    if(!items.length) pages.push({kind:'normal',content:`<h1 class="r-title">3. Não conformidades</h1><div class="notice">Não foram registradas não conformidades nos itens avaliados.</div>`});
    return pages;
  }

  function photoPages(d){
    const photos=[];
    Object.values(d.checklist||{}).forEach(i=>(i.photos||[]).forEach((p,n)=>photos.push({src:p,title:i.titulo,n:n+1,status:i.status})));
    const pages=[]; for(let i=0;i<photos.length;i+=4){
      const ch=photos.slice(i,i+4);
      pages.push({kind:'normal',content:`<h1 class="r-title">4. Registro fotográfico</h1><div class="photo-grid">${ch.map(p=>`<div class="photo-record"><img src="${p.src}"><div>${esc(p.title)} — ${esc(p.status||'')} — Foto ${p.n}</div></div>`).join('')}</div>`});
    }
    return pages;
  }

  function actionPages(d){
    const nc=Object.values(d.checklist||{}).filter(i=>i.status==='Não conforme');
    const chunks=[];for(let i=0;i<nc.length;i+=12)chunks.push(nc.slice(i,i+12));
    if(!chunks.length)chunks.push([]);
    return chunks.map((ch,idx)=>({kind:'normal',content:`<h1 class="r-title">5. Plano de ação ${chunks.length>1?`(${idx+1}/${chunks.length})`:''}</h1>
     ${ch.length?`<table class="action-table"><thead><tr><th>Não conformidade</th><th>Risco</th><th>Medida corretiva</th><th>Responsável</th><th>Prazo</th></tr></thead><tbody>
     ${ch.map(i=>`<tr><td>${esc(i.titulo)}</td><td class="${riskClass(i.risco)}">${esc(i.risco||'-')}</td><td>${esc(i.acao||'-')}</td><td>${esc(i.responsavel||'Administração do condomínio')}</td><td>${fmt(i.prazo)}</td></tr>`).join('')}</tbody></table>`:`<div class="notice">Não há ações corretivas registradas.</div>`}`}));
  }

  function finalPage(d,page,total){
    const content=`<h1 class="r-title">6. Conclusão técnica e ciência</h1>
      <h2 class="r-subtitle">Conclusão</h2><div class="conclusion-box">${esc(d.conclusao||'Não informada')}</div>
      <h2 class="r-subtitle">Recomendações gerais</h2><div class="conclusion-box">${esc(d.recomendacoes||'Não informadas')}</div>
      <div class="notice">Este relatório registra as condições observadas na data da inspeção. As recomendações devem ser analisadas e implementadas conforme a prioridade dos riscos identificados e a legislação aplicável.</div>
      <div class="signature-grid"><div class="signature">${esc(d.assinaturaSindica||d.sindica||'Responsável pelo condomínio')}<br>Responsável pelo condomínio</div><div class="signature">${esc(d.assinaturaTecnico||d.tecnico||'Responsável técnico')}<br>Responsável pela inspeção</div></div>`;
    return wrap(content,page,total);
  }

  function build(d){
    const middle=[{kind:'summary'},...checklistPages(d),...nonConformPages(d),...photoPages(d),...actionPages(d)];
    const total=1+middle.length+1;
    let page=1, html=cover(d,page++,total);
    middle.forEach(x=>{
      if(x.kind==='summary')html+=summaryPage(d,page++,total);
      else html+=wrap(x.content,page++,total);
    });
    html+=finalPage(d,page++,total);
    return `<div class="report-document">${html}</div>`;
  }

  function print(d){
    let host=document.getElementById('printHost');
    if(!host){host=document.createElement('div');host.id='printHost';document.body.appendChild(host)}
    host.className='report-preview';host.innerHTML=build(d);
    const imgs=[...host.querySelectorAll('img')];
    let left=imgs.length;
    const go=()=>setTimeout(()=>window.print(),150);
    if(!left)return go();
    const done=()=>{left--;if(left<=0)go()};
    imgs.forEach(img=>img.complete?done():(img.onload=done,img.onerror=done));
    setTimeout(go,2200);
  }
  return {build,print,esc,fmt};
})();
