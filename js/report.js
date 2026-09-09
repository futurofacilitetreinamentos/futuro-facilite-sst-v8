
const V8Report=(()=>{
 const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
 const fmt=d=>{if(!d)return'-';const p=String(d).split('-');return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:d};
 const logo='assets/logo.jpeg';
 const capa='assets/capa-pgr.jpg';
 const E=typeof EvolueDocs!=='undefined'?EvolueDocs:{mesAno:d=>d||'—',mesAnoCapa:d=>d||'—',dataExtenso:d=>d||'—',te:()=>'E',pd:()=>'B',gr:()=>'T',teNome:c=>c,pdNome:c=>c,grNome:c=>c,grupoLetra:()=>'F',groups:p=>[{ghe:{nome:'Ambientes',setor:'',funcoes:'',descricao:''},funcoes:p.funcoes||[],riscos:p.riscos||[]}],PGR:{},PCMSO:{},LTCAT:{},NR1:{}};
 function head(_title,n,total){return `<div class="pgr-head"><img src="${logo}" alt="Futuro Facilite Treinamentos"></div><div class="pgr-foot"><span>(61) 98515-0519 · futurofacilitetreinamentos@gmail.com</span><span>Página ${n} de ${total}</span></div>`}
 function page(title,content,n,total){return `<section class="pgr-page">${head(title,n,total)}<div class="pgr-content">${content}</div></section>`}
 function doc(coverHtml,innerPages,headTitle){
  const total=innerPages.length+1;let html=coverHtml,n=2;
  innerPages.forEach(c=>{html+=page(headTitle,c,n++,total)});
  return `<div class="pgr-doc">${html}</div>`;
 }
 function level(score){return score<=4?'Baixo':score<=9?'Moderado':score<=16?'Alto':'Crítico'}
 function emp(p){return p.empresa||{}}
 function cover(p,{badge,title,respNome,respFuncao,regLabel,respReg}){
  const e=emp(p);
  const rebadge=badge && badge!=='PGR';
  return `<section class="pgr-page pgr-cover pgr-cover-ff"><img class="pgr-cover-bg" src="${capa}" alt=""><div class="pgr-cover-overlay">${rebadge?`<div class="pgr-cover-mask"></div><div class="pgr-cover-rebadge">${esc(badge)}</div><div class="pgr-cover-retitle">${title||''}</div>`:''}<div class="pgr-cover-id"><h2>${esc(e.razaoSocial||'—')}</h2><p><b>RESPONSÁVEL TÉCNICO:</b> ${esc((respNome||'—').toUpperCase())}</p><p>${esc((respFuncao||'—').toUpperCase())}</p><p><b>${esc(regLabel||'MTE')}:</b> ${esc(respReg||'—')}</p><p><b>DATA DE ELABORAÇÃO:</b> ${esc((E.mesAnoCapa||E.mesAno)(e.dataElaboracao))}</p></div></div></section>`;
 }
 function identTable(p){
  const e=emp(p);
  return `<table class="pgr-table"><tr><th>Razão social</th><td colspan="3">${esc(e.razaoSocial||'—')}</td></tr><tr><th>Nome fantasia</th><td>${esc(e.nomeFantasia||'—')}</td><th>CNPJ</th><td>${esc(e.cnpj||'—')}</td></tr><tr><th>CNAE</th><td>${esc(e.cnae||'—')}</td><th>Grau de risco</th><td>${esc(e.grauRisco||'—')}</td></tr><tr><th>Trabalhadores</th><td>${esc(e.numTrabalhadores||'0')}</td><th>Responsável</th><td>${esc(e.responsavelEmpresa||'—')}</td></tr><tr><th>Telefone</th><td>${esc(e.contatoEmpresa||'—')}</td><th>E-mail</th><td>${esc(e.emailEmpresa||'—')}</td></tr><tr><th>Logradouro</th><td colspan="3">${esc(e.endereco||'—')}</td></tr><tr><th>Atividade</th><td colspan="3">${esc(e.atividadeEmpresa||'—')}</td></tr></table>`;
 }
 function revTable(p,itens){
  const e=emp(p);
  return `<div class="pgr-text">${esc(E.PGR.revisoes||'O controle de revisões registra as alterações do documento ao longo da vigência.')}</div><h2 class="pgr-sub">Controle de revisões</h2><table class="pgr-table"><thead><tr><th>Revisão nº</th><th>Data</th><th>Itens revisados</th></tr></thead><tbody><tr><td>001</td><td>${fmt(e.dataElaboracao)}</td><td>${esc(itens||'Documento-base e anexos')}</td></tr></tbody></table>`;
 }
 function sumario(list){return `<h1 class="pgr-title">Sumário</h1><ol class="pgr-sumario">${(list||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`}
 function respBlock(p,{titulo,texto,nome,funcao,reg}){
  const e=emp(p);
  return `<h1 class="pgr-title">${esc(titulo)}</h1><div class="pgr-text">${esc(texto)}</div><div class="pgr-text">A implementação e o desenvolvimento deste documento são de responsabilidade de ${esc(e.razaoSocial||'a organização')}, que deve disponibilizar os recursos necessários e atender às solicitações das autoridades competentes.</div><div class="pgr-text">Brasília-DF, ${esc(E.dataExtenso(e.dataElaboracao))}.</div><div class="sign-grid"><div class="sign">${esc(nome||'Responsável técnico')}<br>${esc(funcao||'')}${reg?'<br>'+esc(reg):''}</div><div class="sign">${esc(e.responsavelEmpresa||'Responsável pela organização')}<br>Representante da organização</div></div>`;
 }
 function legend(){
  return `<h2 class="pgr-sub">Legenda</h2><table class="pgr-table compact"><thead><tr><th>Grupo</th><th>TE</th><th>PD</th><th>GR</th></tr></thead><tbody><tr><td>F Físico · Q Químico · B Biológico · E Ergonômico · A Acidente</td><td>E Eventual · I Intermitente · P Permanente</td><td>B Baixo · M Médio · A Alto · C Crítico</td><td>T Tolerável · M Moderado · S Substancial · IT Intolerável</td></tr></tbody></table>`;
 }
 function matrix(){
  return `<h2 class="pgr-sub">Matriz de graduação de risco (GR = S × F)</h2><div class="pgr-text">Tempo de exposição: Eventual (menos de 30 minutos da jornada); Intermitente (30 minutos a 6 horas); Permanente (mais de 6 horas). Potencial de dano: Baixo, Médio, Alto ou Crítico.</div><table class="pgr-table compact"><thead><tr><th></th><th>Permanente</th><th>Intermitente</th><th>Eventual</th></tr></thead><tbody><tr><th>Baixo</th><td>Moderado</td><td>Tolerável</td><td>Tolerável</td></tr><tr><th>Médio</th><td>Substancial</td><td>Moderado</td><td>Tolerável</td></tr><tr><th>Alto</th><td>Intolerável</td><td>Substancial</td><td>Moderado</td></tr><tr><th>Crítico</th><td>Intolerável</td><td>Intolerável</td><td>Substancial</td></tr></tbody></table><table class="pgr-table compact" style="margin-top:3mm"><thead><tr><th>GR</th><th>Ações necessárias</th></tr></thead><tbody><tr><td>Tolerável</td><td>Não é necessária a adoção de novas medidas.</td></tr><tr><td>Moderado</td><td>Reavaliar os meios de controle e, quando necessário, adotar medidas complementares.</td></tr><tr><td>Substancial</td><td>Implantar novas medidas de controle ou corrigir falhas nas existentes.</td></tr><tr><td>Intolerável</td><td>Implantar novas medidas, adotando ação de caráter imediato.</td></tr></tbody></table>`;
 }
 function gheRows(g){
  const letters=['F','Q','B','E','A'];
  const rows=[];
  letters.forEach(L=>{
   const rs=(g.riscos||[]).filter(r=>E.grupoLetra(r.grupo)===L);
   if(!rs.length) rows.push({L,perigo:'Ausência de fator de risco',fonte:'—',te:'—',pd:'—',gr:'—',controles:'—',acao:'—',dano:'—'});
   else rs.forEach(r=>rows.push({L,perigo:r.perigo||'—',fonte:r.fonte||'—',te:E.te(r.prob),pd:E.pd(r.sev),gr:E.gr(r.prob,r.sev),controles:r.controles||'—',acao:r.acao||'—',dano:r.dano||'—'}));
  });
  (g.riscos||[]).filter(r=>E.grupoLetra(r.grupo)==='P').forEach(r=>rows.push({L:'P',perigo:r.perigo||'—',fonte:r.fonte||'—',te:E.te(r.prob),pd:E.pd(r.sev),gr:E.gr(r.prob,r.sev),controles:r.controles||'—',acao:r.acao||'—',dano:r.dano||'—'}));
  return rows;
 }
 function gheAmbiente(p,g){
  const s=(p.setores||[]).find(x=>x.nome===g.ghe.setor);
  return s?`${s.ambiente||''}${s.descricao?' — '+s.descricao:''}`.trim():(g.ghe.setor||'Ambientes do condomínio');
 }
 function gheIdent(p,g,ix,prefix){
  const fn=(g.funcoes||[]).map(f=>`<tr><td>${esc(f.nome)}</td><td>${esc(f.quantidade||'—')} trabalhador(es)</td><td>${esc(f.cbo||'—')}</td></tr>`).join('')||`<tr><td>${esc(g.ghe.funcoes||'—')}</td><td>—</td><td>—</td></tr>`;
  const atv=(g.funcoes||[]).map(f=>`<p><b>${esc(f.nome)}:</b> ${esc(f.atividades||'—')}</p>`).join('')||`<p>${esc(g.ghe.descricao||'—')}</p>`;
  return `<h1 class="pgr-title">${esc(prefix)}. ${esc(g.ghe.nome||('GHE '+(ix+1)))}</h1><table class="pgr-table"><tr><th>Tipo de atividade</th><td>${esc(g.ghe.descricao||((g.funcoes||[]).map(f=>f.atividades).filter(Boolean).join(' '))||'Atividades do condomínio')}</td></tr><tr><th>Descrição do ambiente</th><td>${esc(gheAmbiente(p,g))}</td></tr></table><h2 class="pgr-sub">Identificação das funções</h2><table class="pgr-table compact"><thead><tr><th>Cargo / função</th><th>Quantidade</th><th>CBO</th></tr></thead><tbody>${fn}</tbody></table><h2 class="pgr-sub">Descrição das atividades</h2><div class="pgr-text">${atv}</div>`;
 }
 function gheInventario(g){
  const rows=gheRows(g);
  const inv=rows.map(r=>`<tr><td>${esc(r.L)}</td><td>${esc(r.perigo)}</td><td>${esc(r.fonte)}</td><td>${esc(r.te)}</td><td>${esc(r.pd)}</td><td>${esc(r.gr)}</td><td>${esc(r.controles)}</td><td>${esc(r.acao)}</td></tr>`).join('');
  const dano=rows.filter(r=>r.perigo!=='Ausência de fator de risco').map(r=>`<tr><td>${esc(r.L)}</td><td>${esc(r.perigo)}</td><td>${esc(r.dano)}</td></tr>`).join('')||'<tr><td colspan="3">Sem agravos cadastrados neste GHE.</td></tr>';
  return `<h2 class="pgr-sub">Inventário de riscos e perigos</h2><table class="pgr-table compact"><thead><tr><th></th><th>Fator de exposição</th><th>Fonte geradora</th><th>TE</th><th>PD</th><th>GR</th><th>Controles existentes</th><th>Propostas</th></tr></thead><tbody>${inv}</tbody></table>${legend()}<h2 class="pgr-sub">Indicativos de possível comprometimento à saúde</h2><table class="pgr-table compact"><thead><tr><th></th><th>Agente</th><th>Possíveis danos à saúde</th></tr></thead><tbody>${dano}</tbody></table>`;
 }
 const EPI_ITENS=[
  {id:'luva',nome:'Luva de proteção nitrílica',uso:'Produtos químicos, limpeza e risco biológico',img:'assets/epi/luva.jpg',re:/luva|quím|domissanit|limpeza|biol|álcool|sanit|nitr/i},
  {id:'luva-latex',nome:'Luva de procedimento (látex / vinil)',uso:'Higienização, resíduos e contato com umidade',img:'assets/epi/luva-latex.jpg',re:/luva|procedimento|látex|latex|resíduo|residuo|lixo|umid/i},
  {id:'pff2',nome:'Respirador purificador de ar tipo PFF2',uso:'Poeiras, aerossóis e agentes biológicos',img:'assets/epi/pff2.jpg',re:/pff|respir|máscara|mascara|poeira|quím|biol|lixo|resíduo/i},
  {id:'bota',nome:'Calçado ocupacional tipo bota, solado antiderrapante',uso:'Piso molhado, queda e escorregão',img:'assets/epi/bota.png',re:/bota|queda|escorreg|piso|calçado|calcado/i},
  {id:'bone',nome:'Boné árabe / proteção contra radiação solar',uso:'Trabalho externo e incidência solar (portaria / áreas comuns)',img:'assets/epi/bone.png',re:/sol|térmic|termic|calor|portaria|extern|radiação|bone|boné/i},
  {id:'oculos',nome:'Óculos de proteção',uso:'Projeção de partículas, produtos químicos e limpeza',img:'assets/epi/oculos.jpg',re:/óculos|oculos|partícula|particula|quím|limpeza|resping/i},
  {id:'protetor',nome:'Protetor auditivo tipo concha',uso:'Exposição a ruído (máquinas, portaria e áreas externas)',img:'assets/epi/protetor.jpg',re:/ruído|ruido|audit|barulho|máquin|maquin/i}
 ];
 function epiFromRiscos(_p){
  return EPI_ITENS;
 }
 function epiExistentes(p){
  const rows=(p.riscos||[]).map(r=>{
   const t=[r.controles,r.acao,r.perigo].join(' ');
   const epis=EPI_ITENS.filter(e=>e.re.test(t)).map(e=>e.nome);
   if(!epis.length && /epi/i.test(t)) epis.push('EPI citado no inventário (especificar CA)');
   if(!epis.length) return '';
   return `<tr><td>${esc(r.ghe||r.funcao||'—')}</td><td>${esc(r.perigo||'—')}</td><td>${esc(epis.join('; '))}</td><td>${esc(r.controles||'—')}</td></tr>`;
  }).filter(Boolean).join('');
  return rows||'<tr><td colspan="4">Na visita técnica não foi comprovado controle formal de entrega de EPI. Os equipamentos devem ser implantados conforme o item 10.2 e o Apêndice A.</td></tr>';
 }
 function epiGallery(itens){
  return `<div class="pgr-epi-grid">${itens.map(e=>`<div class="pgr-epi-card"><img src="${e.img}" alt="${esc(e.nome)}"><b>${esc(e.nome)}</b><span>${esc(e.uso)}</span></div>`).join('')}</div>`;
 }
 function epiFicha(){
  const lines=Array.from({length:8},()=>'<tr><td style="height:8mm"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>').join('');
  return `<h1 class="pgr-title">Apêndice A — Ficha de controle de EPI</h1><div class="pgr-text">Modelo sugerido para registro do fornecimento, nos termos da NR-6. Preencher uma linha por entrega ou substituição. Manter arquivado com o PGR.</div><table class="pgr-table compact" style="margin-top:3mm"><thead><tr><th>Colaborador</th><th>Função</th><th>EPI</th><th>CA</th><th>Data entrega</th><th>Substituição</th><th>Ass. empregado</th><th>Ass. responsável</th></tr></thead><tbody>${lines}</tbody></table>`;
 }
 function visitaBlock(p){
  const i=p.inspecao;
  const T=E.PGR;
  let html=`<h1 class="pgr-title">6. Avaliação dos riscos e perigos</h1><h2 class="pgr-sub">6.1. Visita técnica</h2><div class="pgr-text">${esc(T.visita)}</div>`;
  if(i){
   html+=`<table class="pgr-table"><tr><th>Relatório SST</th><td>${esc(i.numero||'—')}</td><th>Data da visita</th><td>${fmt(i.dataVisita)}</td></tr><tr><th>Técnico responsável</th><td colspan="3">${esc(i.tecnico||'—')}</td></tr><tr><th>Itens avaliados</th><td>${esc(i.nItens||0)}</td><th>Não conformidades</th><td>${esc(i.nNc||0)}</td></tr></table>`;
   if(i.objetivo) html+=`<div class="pgr-text"><b>Objetivo da visita:</b> ${esc(i.objetivo)}</div>`;
   if((i.ncs||[]).length){
    html+=`<h2 class="pgr-sub">Constatações da inspeção SST</h2><table class="pgr-table compact"><thead><tr><th>Item</th><th>Irregularidade</th><th>Risco</th><th>Medida recomendada</th></tr></thead><tbody>${i.ncs.map(x=>`<tr><td>${esc(x.titulo)}</td><td>${esc(x.obs||'—')}</td><td>${esc(x.risco||'—')}</td><td>${esc(x.acao||'—')}</td></tr>`).join('')}</tbody></table>`;
   }
   if(i.conclusao) html+=`<div class="pgr-text" style="margin-top:2mm">${esc(i.conclusao)}</div>`;
  }else{
   html+=`<div class="pgr-text">A visita técnica ainda não foi registrada neste condomínio. O inventário usa os dados do cadastro (setores, funções, GHE e riscos). Após a inspeção SST do passo a passo, as constatações, prazos e o registro fotográfico passam a integrar automaticamente este PGR e o LTCAT.</div>`;
  }
  html+=`<h2 class="pgr-sub">6.2. Avaliação qualitativa</h2><div class="pgr-text">${esc(T.qualitativa)}</div>${matrix()}`;
  return html;
 }
 function planoRows(p){
  const fromRiscos=(p.riscos||[]).filter(r=>r.acao).map(r=>({
   risco:r.perigo,gr:E.grNome(E.gr(r.prob,r.sev)),acao:r.acao,resp:r.responsavel,prazo:r.prazo,status:r.status||'Pendente',origem:'Inventário'
  }));
  const fromNc=((p.inspecao&&p.inspecao.ncs)||[]).filter(x=>x.acao).map(x=>({
   risco:x.titulo,gr:x.risco||'—',acao:x.acao,resp:x.responsavel,prazo:x.prazo,status:'Pendente',origem:'Inspeção'
  }));
  return fromRiscos.concat(fromNc);
 }
 function fotoPages(p,titulo,intro){
  const photos=(p.inspecao&&p.inspecao.photos)||[];
  if(!photos.length){
   return [`<h1 class="pgr-title">${esc(titulo)}</h1><div class="pgr-text">${esc(intro)} A visita técnica ainda não possui registro fotográfico. Após a inspeção SST, as imagens capturadas no checklist passam a constar automaticamente nesta seção.</div>`];
  }
  const chunks=[];
  for(let i=0;i<photos.length;i+=4) chunks.push(photos.slice(i,i+4));
  return chunks.map((ch,ix)=>`<h1 class="pgr-title">${esc(titulo)}${chunks.length>1?` (${ix+1}/${chunks.length})`:''}</h1>${ix===0?`<div class="pgr-text">${esc(intro)}</div>`:''}<div class="pgr-foto-grid">${ch.map(f=>`<div class="pgr-foto-card"><img src="${f.src}" alt="${esc(f.titulo)}"><b>${esc(f.titulo)}</b>${f.obs?`<span>${esc(f.obs)}</span>`:''}</div>`).join('')}</div>`);
 }
 function drpsBlock(p){
  const d=p.drps||{n:0,topicos:[],altos:[],porSetor:{}};
  const topics=(d.topicos&&d.topicos.length)?d.topicos:(typeof DRPSData!=='undefined'?DRPSData.TOPICS.map(t=>({id:t.id,nome:t.nome,media:0,gravidade:'—',gravidadeN:0,fonte:DRPSData.FONTES[t.id]||'',agravo:DRPSData.AGRAVOS})):[]);
  const nResp=d.n||0;
  const setores=Object.entries(d.porSetor||{}).map(([k,v])=>`${esc(k)} (${v})`).join('; ')||'—';
  const intro=nResp
   ? `Esta seção atende à NR-1 quanto à identificação, avaliação e informação dos riscos psicossociais relacionados ao trabalho. O Diagnóstico de Riscos Psicossociais (DRPS) foi aplicado de forma confidencial (50 questões, 13 tópicos). Os resultados entram neste PGR apenas de forma coletiva, sem identificação nominal dos trabalhadores.`
   : `A NR-1 exige que os riscos psicossociais relacionados ao trabalho sejam identificados, avaliados e informados neste PGR. O Diagnóstico de Riscos Psicossociais (DRPS) ainda não foi aplicado neste condomínio. Esta seção permanece aberta até a coleta das respostas dos trabalhadores.`;
  const rows=topics.map(t=>{
   const media=nResp && t.media?Number(t.media).toFixed(2):'—';
   const g=nResp?esc(t.gravidade||'—'):'A avaliar';
   const cls=t.gravidadeN>=3?' class="alta"':'';
   return `<tr${cls}><td>${esc(t.nome)}</td><td>${media}</td><td>${g}</td></tr>`;
  }).join('')||'<tr><td colspan="3">Tópicos do DRPS indisponíveis.</td></tr>';
  const fontes=topics.map(t=>{
   const cls=t.gravidadeN>=3?' class="alta"':'';
   return `<tr${cls}><td>${esc(t.nome)}</td><td>${esc(t.gravidade||'—')}</td><td>${esc(t.fonte||'')}</td></tr>`;
  }).join('');
  const page1=`<h1 class="pgr-title">8. Riscos psicossociais (DRPS / NR-1)</h1><div class="pgr-text">${intro}</div><div class="pgr-kpi"><span><b>${nResp}</b> resposta(s) coletiva(s)</span><span><b>${(d.altos||[]).length}</b> tópico(s) em gravidade alta</span><span>Setores: ${setores}</span></div><h2 class="pgr-sub">Inventário coletivo por tópico</h2><table class="pgr-table compact"><thead><tr><th>Tópico / fator psicossocial</th><th>Média (1–3)</th><th>Gravidade</th></tr></thead><tbody>${rows}</tbody></table><div class="pgr-text" style="margin-top:3mm">Questionário: 1 Nunca · 2 Raramente · 3 Às vezes · 4 Frequentemente · 5 Sempre. A média coletiva por tópico está na escala de gravidade 1 Baixa · 2 Média · 3 Alta (modelo NR-01). Classificação: ≤ 1,66 Baixa; ≤ 2,32 Média; > 2,32 Alta.</div>`;
  const page2=`<h1 class="pgr-title">8. Riscos psicossociais — fontes e agravos</h1><h2 class="pgr-sub">Fonte geradora por tópico</h2><table class="pgr-table compact"><thead><tr><th>Tópico</th><th>Gravidade</th><th>Fonte geradora (circunstâncias)</th></tr></thead><tbody>${fontes}</tbody></table><div class="pgr-text" style="margin-top:3mm"><b>Possíveis agravos:</b> ${esc(topics[0]?.agravo||'transtornos psicológicos e emocionais, burnout, ansiedade, insônia, medo, desmotivação e demais agravos à saúde mental.')}</div><h2 class="pgr-sub">Medidas organizacionais</h2><div class="pgr-text">Os fatores em gravidade alta devem ser tratados no plano de ação deste PGR, com medidas organizacionais e relacionais — canal de denúncia, suporte da liderança, clareza de papel, dimensionamento de equipe, comunicação e reconhecimento — sem exposição nominal dos trabalhadores. Reaplicar o DRPS após as intervenções ou quando houver mudança relevante na organização do trabalho.</div><div class="pgr-text">Confidencialidade: as respostas individuais não constam deste documento. O PGR informa apenas o resultado coletivo, por tópico.</div>`;
  return nResp?[page1,page2]:[page1];
 }
 function build(p){
  const e=emp(p);
  const T=E.PGR;
  const ghes=E.groups(p);
  const actions=planoRows(p);
  const actionChunks=[];for(let i=0;i<actions.length;i+=8)actionChunks.push(actions.slice(i,i+8));if(!actionChunks.length)actionChunks.push([]);
  const pages=[];
  pages.push(revTable(p,'Documento-base, inventário de riscos, DRPS e plano de ação'));
  pages.push(`<h1 class="pgr-title">Apresentação</h1><div class="pgr-text">${esc(T.apresentacao)}</div>`+sumario(T.sumario));
  pages.push(`<h1 class="pgr-title">1. Introdução</h1><div class="pgr-text">${esc(T.intro)}</div><h1 class="pgr-title">2. Documento-base</h1><div class="pgr-text">${esc(T.base)}</div><h2 class="pgr-sub">2.1. Integração com o PCMSO</h2><div class="pgr-text">${esc(T.pcmso)}</div>`);
  pages.push(`<h1 class="pgr-title">3. Identificação da empresa</h1>${identTable(p)}<h2 class="pgr-sub">Responsáveis técnicos cadastrados</h2><table class="pgr-table"><tr><th>SST</th><td>${esc(e.respSst||'—')}${e.regSst?' · Registro '+esc(e.regSst):''}</td></tr><tr><th>Médico do Trabalho</th><td>${esc(e.medicoTrabalho||'—')}${e.crmMedico?' · CRM '+esc(e.crmMedico):''}</td></tr><tr><th>Engenharia de Segurança</th><td>${esc(e.engSeguranca||'—')}${e.creaEng?' · CREA '+esc(e.creaEng):''}</td></tr></table>`);
  pages.push(`<h1 class="pgr-title">4. Estrutura do PGR</h1><div class="pgr-text">${esc(T.estrutura)}</div><h2 class="pgr-sub">4.1. Planejamento continuado</h2><div class="pgr-text">Revisão no mínimo a cada dois anos ou antes: após implementação de medidas (risco residual); inovações em tecnologias, ambientes, processos ou organização do trabalho; inadequação das medidas; acidente ou doença relacionada ao trabalho; mudança de requisito legal. Organizações com certificação em gestão de SST podem adotar prazo de até três anos.</div><h2 class="pgr-sub">4.2. Plano das ações</h2><div class="pgr-text">O plano de ações informa como e quando serão desenvolvidas, acompanhadas e aferidas as medidas de prevenção. As ações deste condomínio saem do inventário de riscos e das não conformidades da inspeção SST, com responsável, prazo e status.</div><h2 class="pgr-sub">4.3. Estratégia e metodologia de ações</h2><div class="pgr-text">${esc(T.hierarquia)}</div><h2 class="pgr-sub">4.4. Registro e divulgação de dados</h2><div class="pgr-text">${esc(T.registro)}</div>`);
  pages.push(`<h1 class="pgr-title">5. Desenvolvimento do PGR</h1><h2 class="pgr-sub">5.1. Identificação dos agentes de riscos ocupacionais</h2><div class="pgr-text"><b>Físicos:</b> energia capaz de causar lesão ou agravo (ruído, vibração, temperaturas extremas, radiações, umidade, entre outros).<br><b>Químicos:</b> substâncias que penetram por via respiratória, cutânea ou ingestão (poeiras, fumos, névoas, gases, vapores, produtos de limpeza).<br><b>Biológicos:</b> microrganismos, parasitas ou materiais de origem orgânica capazes de acarretar agravo à saúde.<br><b>Ergonômicos (NR-17):</b> postura inadequada, ritmo excessivo, levantamento de peso, turno/noturno, jornada prolongada, esforço, monotonia e demais fatores de estresse físico ou psíquico.<br><b>Acidente:</b> arranjo físico, armazenamento, iluminação, máquinas sem proteção, eletricidade, queda, ferramentas e demais condições do ambiente.</div><h2 class="pgr-sub">5.2. Perigos</h2><div class="pgr-text">O perigo é a situação com potencial de prejuízo à saúde, ao ambiente ou ao patrimônio — o fator causador do dano. A identificação neste documento usa os setores, funções, GHE e riscos cadastrados do condomínio.</div>`);
  pages.push(visitaBlock(p));
  pages.push(`<h1 class="pgr-title">7. Inventário de riscos e perigos</h1><h2 class="pgr-sub">7.1. Grupo homogêneo de exposição — GHE</h2><div class="pgr-text">${esc(T.ghe)}</div><table class="pgr-table compact"><thead><tr><th>GHE</th><th>Setor</th><th>Funções</th><th>Descrição</th></tr></thead><tbody>${ghes.map(g=>`<tr><td>${esc(g.ghe.nome)}</td><td>${esc(g.ghe.setor||'—')}</td><td>${esc(g.ghe.funcoes||(g.funcoes||[]).map(f=>f.nome).join(', ')||'—')}</td><td>${esc(g.ghe.descricao||'—')}</td></tr>`).join('')}</tbody></table>`);
  ghes.forEach((g,ix)=>{
   pages.push(gheIdent(p,g,ix,'7.1.'+(ix+1)));
   pages.push(`<h1 class="pgr-title">7.1.${ix+1}. Inventário — ${esc(g.ghe.nome)}</h1>`+gheInventario(g));
  });
  drpsBlock(p).forEach(c=>pages.push(c));
  pages.push(`<h1 class="pgr-title">9. Implantação de medidas de controle</h1><div class="pgr-text">${esc(T.controles)}</div><div class="pgr-text">${esc(T.hierarquia)}</div><div class="pgr-text">Quando comprovada a inviabilidade técnica de proteção coletiva, ou quando esta for insuficiente, complementar ou emergencial, adotam-se medidas administrativas e, em seguida, o Equipamento de Proteção Individual — EPI (NR-6).</div>`);
  const epis=epiFromRiscos(p);
  pages.push(`<h1 class="pgr-title">10. Equipamento de proteção individual</h1><div class="pgr-text">${esc(T.epi)}</div><h2 class="pgr-sub">10.1. Equipamentos de proteção individual existentes</h2><div class="pgr-text">${esc(T.epiExistentes)}</div><table class="pgr-table compact" style="margin-top:2mm"><thead><tr><th>GHE / função</th><th>Fator de exposição</th><th>EPI</th><th>Controle informado</th></tr></thead><tbody>${epiExistentes(p)}</tbody></table>`);
  pages.push(`<h1 class="pgr-title">10.2. Equipamentos de proteção individual recomendados</h1><div class="pgr-text">${esc(T.epiRecomendados)}</div><table class="pgr-table compact" style="margin-top:2mm"><thead><tr><th>EPI</th><th>Uso previsto no condomínio</th></tr></thead><tbody>${epis.map(e=>`<tr><td>${esc(e.nome)}</td><td>${esc(e.uso)}</td></tr>`).join('')}</tbody></table><h2 class="pgr-sub">10.3. Certificado de Aprovação — CA</h2><div class="pgr-text">${esc(T.epiCa)}</div><h2 class="pgr-sub">10.4. Validade do Certificado de Aprovação</h2><div class="pgr-text">${esc(T.epiValidade)}</div>`);
  actionChunks.forEach((ch,ix)=>{
   pages.push(`<h1 class="pgr-title">11. Plano de ação ${actionChunks.length>1?`(${ix+1}/${actionChunks.length})`:''}</h1>${ix===0?`<div class="pgr-text">O cumprimento das ações é de responsabilidade da organização, observando prazos, metas e prioridades. Inclui as medidas do inventário, as não conformidades da inspeção SST, o controle de EPI e, quando o DRPS indicar gravidade alta, as intervenções organizacionais do item 8.</div>`:''}<table class="pgr-table compact"><thead><tr><th>Origem</th><th>Risco / item</th><th>GR</th><th>Medida proposta</th><th>Responsável</th><th>Prazo</th><th>Status</th></tr></thead><tbody>${ch.map(r=>`<tr><td>${esc(r.origem)}</td><td>${esc(r.risco)}</td><td>${esc(r.gr)}</td><td>${esc(r.acao)}</td><td>${esc(r.resp)}</td><td>${fmt(r.prazo)}</td><td>${esc(r.status||'Pendente')}</td></tr>`).join('')||'<tr><td colspan="7">Nenhuma ação cadastrada no inventário nem na inspeção.</td></tr>'}</tbody></table>`);
  });
  pages.push(`<h1 class="pgr-title">12. Considerações finais</h1><div class="pgr-text">${esc(T.final)}</div><h1 class="pgr-title">13. Referências</h1><div class="pgr-text">${esc(T.refs)}</div>`);
  pages.push(respBlock(p,{
   titulo:'14. Responsabilidade técnica',
   texto:'A produção técnica contida neste Programa de Gerenciamento de Riscos (PGR), elaborado com base no cadastro da organização e na visita técnica, é de responsabilidade do profissional competente abaixo especificado, sob supervisão da Futuro Facilite Treinamentos.',
   nome:e.respSst,funcao:e.funcaoRespSst||'Técnico de Segurança do Trabalho',reg:e.regSst?'Registro '+e.regSst:''
  }));
  pages.push(epiFicha());
  pages.push(`<h1 class="pgr-title">Apêndice B — Imagens dos EPIs recomendados</h1><div class="pgr-text">As imagens ilustram os equipamentos típicos para as atividades de condomínio. O modelo adquirido deve ter CA válido e corresponder ao risco do GHE.</div>${epiGallery(epis)}`);
  return doc(cover(p,{badge:'PGR',respNome:e.respSst,respFuncao:e.funcaoRespSst||'Técnico de Segurança do Trabalho',regLabel:'MTE',respReg:e.regSst}),pages,'PROGRAMA DE GERENCIAMENTO DE RISCOS<br>NR-1 / GRO');
 }
 function examFlags(e){
  const t=String(e.tipos||'').toUpperCase();
  return {a:/A/.test(t)?'X':'',meses:/P/.test(t)?(String(e.periodo||'').toLowerCase().includes('anual')?'12':(e.periodo||'—')):'—',p:/P/.test(t)?(e.periodo||'Anual'):'',d:/D/.test(t)?'X':''};
 }
 function buildPcmso(p){
  const e=emp(p);
  const T=E.PCMSO;
  const plan=typeof PCMSOData!=='undefined'?PCMSOData.plan(p):{medico:{},byFunc:[],riscos:[]};
  const med=plan.medico||{};
  const pages=[];
  pages.push(revTable(p,'Documento-base, planejamento de exames e anexos'));
  pages.push(`<h1 class="pgr-title">Apresentação</h1><div class="pgr-text">${esc(T.apresentacao)}</div>`+sumario(T.sumario));
  pages.push(`<h1 class="pgr-title">1. Identificação do estabelecimento</h1>${identTable(p)}`);
  pages.push(`<h1 class="pgr-title">2. Introdução</h1><div class="pgr-text">${esc(T.intro)}</div><h2 class="pgr-sub">2.1. Médico responsável do PCMSO</h2><div class="pgr-text">A organização, por meio deste PCMSO, indica ${esc(med.nome||'o Médico do Trabalho a ser selecionado no cadastro')} ${med.crm?'CRM '+esc(med.crm):''} como médico responsável. Caso observe inconsistências no inventário de riscos, deve reavaliá-las em conjunto com os responsáveis pelo PGR. Em caso de substituição, os prontuários devem ser formalmente transferidos ao sucessor.</div>`);
  pages.push(`<h1 class="pgr-title">3. Desenvolvimento</h1><div class="pgr-text">${esc(T.tipos)}</div><h2 class="pgr-sub">3.1. Exame admissional</h2><div class="pgr-text">Realizado antes de o empregado assumir as atividades.</div><h2 class="pgr-sub">3.2. Exame periódico</h2><div class="pgr-text">Anual (ou menor, a critério médico) para expostos a riscos classificados no PGR; a cada dois anos para os demais.</div><h2 class="pgr-sub">3.3. Exame de retorno ao trabalho</h2><div class="pgr-text">Após ausência igual ou superior a 30 dias por doença ou acidente.</div><h2 class="pgr-sub">3.4. Exame de mudança de risco ocupacional</h2><div class="pgr-text">Antes da mudança, adequando o controle médico aos novos riscos.</div><h2 class="pgr-sub">3.5. Exame demissional</h2><div class="pgr-text">Em até 10 dias do término do contrato, podendo ser dispensado se o exame clínico mais recente estiver dentro dos prazos da NR-7 conforme o grau de risco.</div><h2 class="pgr-sub">3.6. Exames complementares</h2><div class="pgr-text">Podem ser realizados outros exames complementares, a critério do médico responsável, desde que relacionados aos riscos ocupacionais classificados no PGR e tecnicamente justificados neste PCMSO.</div>`);
  pages.push(`<h1 class="pgr-title">4. Atestado de Saúde Ocupacional — ASO</h1><div class="pgr-text">${esc(T.aso)}</div><h1 class="pgr-title">5. Registro e documentações obrigatórias</h1><div class="pgr-text">${esc(T.registro)} O relatório analítico anual deve considerar, no mínimo, o número de exames clínicos e complementares; estatística de resultados anormais; incidência de doenças relacionadas ao trabalho; CAT; e análise comparativa com o período anterior.</div>`);
  pages.push(`<h1 class="pgr-title">6. Planejamento de exames médicos clínicos e complementares</h1><div class="pgr-text">O quadro abaixo é montado automaticamente a partir das funções e dos riscos cadastrados no PGR deste condomínio. Cada função corresponde a um grupo de exames clínicos e complementares, no padrão da NR-7.</div>`);
  (plan.byFunc||[]).forEach((f,ix)=>{
   const riscos=(f.riscos||[]).map(r=>`<tr><td>${esc(r.grupo||'—')}</td><td>${esc(r.perigo||'—')}</td><td>${esc(r.dano||'—')}</td></tr>`).join('')||'<tr><td colspan="3">Exame clínico de base (NR-7), sem risco específico cadastrado nesta função.</td></tr>';
   const exames=(f.exames||[]).map(ex=>{
    const fl=examFlags(ex);
    const nome=ex.esocial?`${ex.exame} (${ex.esocial})`:ex.exame;
    return `<tr><td>${esc(nome)}</td><td>${fl.a}</td><td>${esc(fl.meses)}</td><td>${esc(fl.p)}</td><td>${fl.d}</td></tr>`;
   }).join('');
   pages.push(`<h1 class="pgr-title">6.${ix+1}. ${esc(f.funcao)}</h1><table class="pgr-table"><tr><th>Cargo / função</th><td>${esc(f.funcao)}</td><th>Quantidade</th><td>${esc(f.qtd||'—')}</td></tr><tr><th>Setor</th><td colspan="3">${esc(f.setor||'—')}</td></tr></table><h2 class="pgr-sub">Riscos importados do PGR</h2><table class="pgr-table compact"><thead><tr><th>Grupo</th><th>Agente</th><th>Possíveis agravos</th></tr></thead><tbody>${riscos}</tbody></table><h2 class="pgr-sub">Exames médicos clínicos e complementares</h2><table class="pgr-table compact"><thead><tr><th>Descrição do exame (cód. eSocial)</th><th>Admissional</th><th>Meses após admissional</th><th>Periódico</th><th>Demissional</th></tr></thead><tbody>${exames}</tbody></table>`);
  });
  pages.push(`<h1 class="pgr-title">7. Disposições finais</h1><div class="pgr-text">${esc(T.final)}</div>`);
  pages.push(respBlock(p,{
   titulo:'8. Responsabilidade técnica',
   texto:'A produção técnica contida neste Programa de Controle Médico de Saúde Ocupacional (PCMSO), elaborado com base no PGR, é de responsabilidade do profissional competente abaixo especificado, sob supervisão da Futuro Facilite Treinamentos.',
   nome:med.nome||'Médico do Trabalho',funcao:'Médico responsável pelo PCMSO',reg:med.crm?'CRM '+med.crm:''
  }));
  pages.push(`<h1 class="pgr-title">9. Anexos — eSocial e procedimentos diagnósticos</h1><div class="pgr-text">${esc(T.esocial)} As informações referentes aos exames médicos constam da tabela n.º 27 do Anexo I dos leiautes do eSocial (Procedimentos Diagnósticos), no portal esocial.gov.br.</div>`);
  return doc(cover(p,{badge:'PCMSO',title:'Programa de<br>controle médico de<br>saúde ocupacional',respNome:med.nome,respFuncao:'Médico responsável',regLabel:'CRM',respReg:med.crm}),pages,'PROGRAMA DE CONTROLE MÉDICO<br>DE SAÚDE OCUPACIONAL · NR-7');
 }
 function parecerGhe(g,plan){
  const nomes=(g.funcoes||[]).map(f=>f.nome);
  const ag=(plan.agentes||[]).filter(a=>a.ghe===g.ghe.nome || nomes.includes(a.ghe));
  const tem=ag.length>0;
  const ins=tem
   ? 'Foram identificados agentes físicos, químicos ou biológicos no inventário. Sem medição que comprove ultrapassagem dos limites da NR-15, não se caracteriza adicional de insalubridade neste parecer qualitativo.'
   : 'Após análise dos cargos deste GHE, conclui-se que não há exposição ocupacional capaz de tornar o ambiente de trabalho insalubre. Os trabalhadores não fazem jus à percepção do adicional de insalubridade (NR-15).';
  const per='Conforme as avaliações deste GHE, não se constatam atividades ou operações perigosas da NR-16. Os colaboradores não fazem jus a adicional de periculosidade.';
  const apo=tem
   ? 'Há fator ambiental a registrar no PGR/PCMSO. Sem comprovação de exposição habitual e permanente acima dos critérios do Anexo IV do Decreto 3.048/99, não há enquadramento para aposentadoria especial.'
   : 'Os colaboradores deste GHE não possuem exposição a riscos ambientais capazes de gerar condições para aposentadoria especial, de acordo com o Anexo IV do Decreto 3.048/99.';
  return {ag,ins,per,apo};
 }
 function buildLtcat(p){
  const e=emp(p);
  const T=E.LTCAT;
  const plan=typeof LTCATData!=='undefined'?LTCATData.plan(p):{eng:{},agentes:[],conclusao:''};
  const eng=plan.eng||{};
  const ghes=E.groups(p);
  const pages=[];
  pages.push(revTable(p,'Documento-base, constatações por GHE e parecer técnico'));
  pages.push(`<h1 class="pgr-title">Apresentação</h1><div class="pgr-text">${esc(T.apresentacao)}</div>`+sumario(T.sumario));
  pages.push(`<h1 class="pgr-title">1. Introdução</h1><div class="pgr-text">${esc(T.intro)}</div><h1 class="pgr-title">2. Objetivos específicos</h1><div class="pgr-text">${esc(T.objetivos)}</div>`);
  pages.push(`<h1 class="pgr-title">3. Identificação do estabelecimento avaliado</h1>${identTable(p)}<h2 class="pgr-sub">3.1. Definição dos riscos ambientais</h2><div class="pgr-text">${esc(T.ambientais)} Agentes físicos (ruído, calor, umidade, radiações), químicos (poeiras, fumos, gases, vapores, produtos) e biológicos (microrganismos patogênicos). Riscos ergonômicos, de acidente e psicossociais permanecem no PGR, sem enquadramento automático no Anexo IV.</div>`);
  pages.push(`<h1 class="pgr-title">4. Técnica empregada</h1><div class="pgr-text">${esc(T.tecnica)}</div><h2 class="pgr-sub">4.1. Análise qualitativa</h2><div class="pgr-text">${esc(E.PGR.qualitativa)}</div>${matrix()}`);
  pages.push(`<h1 class="pgr-title">5. Disposições legais</h1><h2 class="pgr-sub">5.1. Insalubridade</h2><div class="pgr-text">O exercício em condições de insalubridade assegura adicional sobre o salário mínimo da região: 40% (grau máximo), 20% (médio) ou 10% (mínimo). Incidindo mais de um fator, considera-se apenas o de grau mais elevado. A eliminação ou neutralização cessa o pagamento. Insalubridade e periculosidade não são cumulativos.</div><h2 class="pgr-sub">5.2. Periculosidade</h2><div class="pgr-text">Atividades e operações perigosas constam dos anexos da NR-16 (explosivos, inflamáveis, violência física em segurança patrimonial, energia elétrica, motocicleta, radiações ionizantes). O adicional é de 30% sobre o salário, sem acréscimos de gratificações.</div><h2 class="pgr-sub">5.3. Aposentadoria especial</h2><div class="pgr-text">A constatação serve exclusivamente para determinar direito ou não à aposentadoria especial (art. 58 da Lei 8.213/91 e Anexo IV do Decreto 3.048/99). O PPP é atualizado pelo evento S-2240 do eSocial.</div>`);
  const insp=p.inspecao;
  pages.push(`<h1 class="pgr-title">6. Constatações durante a visita técnica</h1><div class="pgr-text">A abordagem dos riscos ambientais e das atividades perigosas foi realizada por Grupo Homogêneo de Exposição (GHE). Profissional legalmente habilitado: ${esc(eng.nome||'Engenheiro de Segurança do Trabalho a selecionar no cadastro')}${eng.crea?' · CREA '+esc(eng.crea):''}. Apoio SST: ${esc(plan.sst?.nome||e.respSst||'—')}${plan.sst?.reg||e.regSst?' · Registro '+esc(plan.sst?.reg||e.regSst):''}.</div>${insp?`<table class="pgr-table"><tr><th>Relatório SST</th><td>${esc(insp.numero||'—')}</td><th>Data da visita</th><td>${fmt(insp.dataVisita)}</td></tr><tr><th>Técnico da inspeção</th><td colspan="3">${esc(insp.tecnico||'—')}</td></tr></table>${insp.conclusao?`<div class="pgr-text">${esc(insp.conclusao)}</div>`:''}`:`<div class="pgr-text">A visita técnica ainda não foi registrada. As constatações por GHE usam o inventário cadastrado; o registro fotográfico e as não conformidades entram após a inspeção SST.</div>`}`);
  const resumo=[];
  ghes.forEach((g,ix)=>{
   const par=parecerGhe(g,plan);
   pages.push(gheIdent(p,g,ix,'6.'+(ix+1)));
   const agRows=par.ag.length
    ? par.ag.map(a=>`<tr><td>${esc(E.grupoLetra(a.grupo))}</td><td>${esc(a.agente)}</td><td>${esc(a.fonte)}</td><td>Qualitativa</td><td>${esc(a.controles)}</td></tr>`).join('')
    : '<tr><td>F/Q/B</td><td>Ausência de fator de risco ambiental enquadrável</td><td>—</td><td>Qualitativa</td><td>—</td></tr>';
   pages.push(`<h1 class="pgr-title">6.${ix+1}. Análise da exposição — ${esc(g.ghe.nome)}</h1><h2 class="pgr-sub">Agentes nocivos físicos, químicos e biológicos</h2><table class="pgr-table compact"><thead><tr><th></th><th>Agente</th><th>Fonte geradora</th><th>Técnica</th><th>Medidas de controle</th></tr></thead><tbody>${agRows}</tbody></table><h2 class="pgr-sub">Parecer técnico conclusivo</h2><table class="pgr-table compact"><thead><tr><th>Fator de direito</th><th>Conclusão</th></tr></thead><tbody><tr><td>Insalubridade</td><td>${esc(par.ins)}</td></tr><tr><td>Periculosidade</td><td>${esc(par.per)}</td></tr><tr><td>Aposentadoria especial</td><td>${esc(par.apo)}</td></tr></tbody></table>`);
   const cargos=(g.funcoes||[]).map(f=>f.nome).join(', ')||g.ghe.funcoes||'—';
   resumo.push(`<tr><td>${esc(g.ghe.nome)}</td><td>${esc(cargos)}</td><td>Insalubridade</td><td>Não faz jus à percepção do adicional de insalubridade.</td></tr><tr><td></td><td></td><td>Periculosidade</td><td>Não faz jus à percepção do adicional de periculosidade.</td></tr><tr><td></td><td></td><td>Aposentadoria especial (09.01.001)</td><td>Não faz jus ao direito de aposentadoria especial neste parecer qualitativo.</td></tr>`);
  });
  pages.push(`<h1 class="pgr-title">7. Resumo do parecer técnico</h1><table class="pgr-table compact"><thead><tr><th>GHE</th><th>Cargo / função</th><th>Direito</th><th>Conclusão</th></tr></thead><tbody>${resumo.join('')}</tbody></table><div class="pgr-text" style="margin-top:3mm">${esc(plan.conclusao||T.final)}</div>`);
  fotoPages(p,'8. Registro fotográfico do estabelecimento','O registro fotográfico documenta as condições observadas na visita técnica, no mesmo padrão dos laudos da Futuro Facilite Treinamentos.').forEach(c=>pages.push(c));
  pages.push(respBlock(p,{
   titulo:'9. Responsabilidade técnica',
   texto:'A produção técnica contida neste Laudo Técnico das Condições Ambientais do Trabalho (LTCAT), elaborado com base no levantamento de dados da visita técnica e no inventário do PGR, é de responsabilidade do engenheiro de segurança do trabalho abaixo especificado, sob supervisão da Futuro Facilite Treinamentos.',
   nome:eng.nome||'Engenheiro de Segurança do Trabalho',funcao:'Engenheira de Segurança do Trabalho — PLH do LTCAT',reg:eng.crea?'CREA '+eng.crea:''
  }));
  pages.push(`<h1 class="pgr-title">Anexo — eSocial</h1><div class="pgr-text">Os agentes nocivos e atividades para aposentadoria especial constam da tabela n.º 24 do Anexo I dos leiautes do eSocial. O financiamento da aposentadoria especial e a redução do tempo de contribuição constam da tabela n.º 02. Consulte o portal esocial.gov.br nas versões vigentes.</div>`);
  return doc(cover(p,{badge:'LTCAT',title:'Laudo técnico das<br>condições ambientais<br>do trabalho',respNome:eng.nome,respFuncao:'Engenheira de Segurança do Trabalho',regLabel:'CREA',respReg:eng.crea}),pages,'LAUDO TÉCNICO DAS CONDIÇÕES<br>AMBIENTAIS DO TRABALHO · LTCAT');
 }
 function buildNr1(p){
  const e=emp(p);
  const T=E.NR1||{};
  const d=p.drps||{n:0,topicos:[],altos:[],porSetor:{}};
  const topics=(d.topicos&&d.topicos.length)?d.topicos:(typeof DRPSData!=='undefined'?DRPSData.TOPICS.map(t=>({id:t.id,nome:t.nome,media:0,gravidade:'—',gravidadeN:0,fonte:DRPSData.FONTES[t.id]||'',agravo:DRPSData.AGRAVOS})):[]);
  const nResp=d.n||0;
  const setores=Object.entries(d.porSetor||{}).map(([k,v])=>`${esc(k)} (${v})`).join('; ')||'—';
  const rows=topics.map(t=>{
   const media=nResp && t.media?Number(t.media).toFixed(2):'—';
   const g=nResp?esc(t.gravidade||'—'):'A avaliar';
   const cls=t.gravidadeN>=3?' class="alta"':'';
   return `<tr${cls}><td>${esc(t.nome)}</td><td>${media}</td><td>${g}</td></tr>`;
  }).join('')||'<tr><td colspan="3">Tópicos do DRPS indisponíveis.</td></tr>';
  const fontes=topics.map(t=>{
   const cls=t.gravidadeN>=3?' class="alta"':'';
   return `<tr${cls}><td>${esc(t.nome)}</td><td>${nResp?esc(t.gravidade||'—'):'A avaliar'}</td><td>${esc(t.fonte||'')}</td></tr>`;
  }).join('');
  const pages=[];
  pages.push(revTable(p,'Diagnóstico coletivo de riscos psicossociais (DRPS / NR-1)'));
  pages.push(`<h1 class="pgr-title">Apresentação</h1><div class="pgr-text">${esc(T.apresentacao)}</div>`+sumario(T.sumario));
  pages.push(`<h1 class="pgr-title">1. Identificação da organização</h1>${identTable(p)}<h2 class="pgr-sub">Responsável técnico</h2><table class="pgr-table"><tr><th>SST</th><td>${esc(e.respSst||'—')}${e.regSst?' · MTE '+esc(e.regSst):''}</td></tr></table>`);
  pages.push(`<h1 class="pgr-title">2. Objetivo e fundamento legal</h1><div class="pgr-text">${esc(T.objetivo)}</div><h1 class="pgr-title">3. Metodologia do DRPS</h1><div class="pgr-text">${esc(T.metodo)}</div><div class="pgr-kpi"><span><b>${nResp}</b> resposta(s) coletiva(s)</span><span><b>${(d.altos||[]).length}</b> tópico(s) em gravidade alta</span><span>Setores: ${setores}</span></div><div class="pgr-text">${nResp?'O diagnóstico abaixo consolida as respostas já registradas neste condomínio.': 'O DRPS ainda não foi aplicado neste condomínio. As tabelas permanecem abertas até a coleta das respostas dos trabalhadores.'}</div>`);
  pages.push(`<h1 class="pgr-title">4. Resultado coletivo por tópico</h1><table class="pgr-table compact"><thead><tr><th>Tópico / fator psicossocial</th><th>Média (1–3)</th><th>Gravidade</th></tr></thead><tbody>${rows}</tbody></table><div class="pgr-text" style="margin-top:3mm">Questionário: 1 Nunca · 2 Raramente · 3 Às vezes · 4 Frequentemente · 5 Sempre. A média coletiva por tópico está na escala de gravidade 1 Baixa · 2 Média · 3 Alta (modelo NR-01). Classificação: ≤ 1,66 Baixa; ≤ 2,32 Média; > 2,32 Alta.</div>`);
  pages.push(`<h1 class="pgr-title">5. Fontes geradoras e agravos</h1><table class="pgr-table compact"><thead><tr><th>Tópico</th><th>Gravidade</th><th>Fonte geradora (circunstâncias)</th></tr></thead><tbody>${fontes}</tbody></table><div class="pgr-text" style="margin-top:3mm"><b>Possíveis agravos:</b> ${esc(topics[0]?.agravo||'transtornos psicológicos e emocionais, burnout, ansiedade, insônia, medo, desmotivação e demais agravos à saúde mental.')}</div>`);
  pages.push(`<h1 class="pgr-title">6. Medidas organizacionais e integração com o PGR</h1><div class="pgr-text">${esc(T.medidas)}</div><div class="pgr-text">${esc(T.confidencial)}</div><div class="pgr-text">${esc(T.final)}</div>`);
  pages.push(respBlock(p,{
   titulo:'7. Responsabilidade técnica',
   texto:'A produção técnica contida neste diagnóstico de riscos psicossociais relacionados ao trabalho (NR-1 / DRPS), elaborado com base no cadastro da organização e nas respostas coletivas dos trabalhadores, é de responsabilidade do profissional competente abaixo especificado, sob supervisão da Futuro Facilite Treinamentos.',
   nome:e.respSst,funcao:e.funcaoRespSst||'Técnico de Segurança do Trabalho',reg:e.regSst?'Registro '+e.regSst:''
  }));
  return doc(cover(p,{badge:'NR-1',title:'Diagnóstico de<br>riscos psicossociais<br>relacionados ao trabalho',respNome:e.respSst,respFuncao:e.funcaoRespSst||'Técnico de Segurança do Trabalho',regLabel:'MTE',respReg:e.regSst}),pages,'DIAGNÓSTICO DE RISCOS<br>PSICOSSOCIAIS · NR-1 / DRPS');
 }
 function printDoc(html){let h=document.getElementById('printHost');if(!h){h=document.createElement('div');h.id='printHost';document.body.appendChild(h)}h.className='report-preview';h.innerHTML=html;const imgs=[...h.querySelectorAll('img')];let left=imgs.length;const go=()=>setTimeout(()=>window.print(),150);if(!left)return go();const done=()=>{left--;if(left<=0)go()};imgs.forEach(i=>i.complete?done():(i.onload=done,i.onerror=done));setTimeout(go,1800)}
 function print(p){printDoc(build(p))}
 function printPcmso(p){printDoc(buildPcmso(p))}
 function printLtcat(p){printDoc(buildLtcat(p))}
 function printNr1(p){printDoc(buildNr1(p))}
 return{build,print,buildPcmso,printPcmso,buildLtcat,printLtcat,buildNr1,printNr1,level,esc,fmt}
})();
