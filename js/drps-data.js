
const DRPSData=(()=>{
 const SCALE=[
  {v:1,l:'Nunca'},
  {v:2,l:'Raramente'},
  {v:3,l:'Às vezes'},
  {v:4,l:'Frequentemente'},
  {v:5,l:'Sempre'}
 ];
 const TOPICS=[
  {id:1,nome:'Assédio de qualquer natureza no trabalho',qs:[1,2,3,4,5]},
  {id:2,nome:'Falta de suporte/apoio no trabalho',qs:[6,7,8,9,10]},
  {id:3,nome:'Má gestão de mudanças organizacionais',qs:[11,12,13,14]},
  {id:4,nome:'Baixa clareza de papel/função',qs:[15,16,17,18]},
  {id:5,nome:'Baixas recompensas e reconhecimento',qs:[19,20,21]},
  {id:6,nome:'Baixo controle no trabalho / Falta de autonomia',qs:[22,23,24,25]},
  {id:7,nome:'Baixa justiça organizacional',qs:[26,27,28,29]},
  {id:8,nome:'Eventos violentos ou traumáticos',qs:[30,31,32]},
  {id:9,nome:'Baixa demanda no trabalho (Subcarga)',qs:[33,34,35,36]},
  {id:10,nome:'Excesso de demandas no trabalho (Sobrecarga)',qs:[37,38,39,40]},
  {id:11,nome:'Maus relacionamentos no local de trabalho',qs:[41,42,43]},
  {id:12,nome:'Trabalho em condições de difícil comunicação',qs:[44,45,46,47]},
  {id:13,nome:'Trabalho remoto e isolado',qs:[48,49,50]}
 ];
 const INV=new Set([2,3,5,6,7,8,9,10,12,14,15,16,17,18,19,20,22,23,26,27,28,40,43,47,50]);
 const Q=[
  [1,'Você já presenciou ou sofreu comentários ofensivos, piadas ou insinuações inadequadas no ambiente de trabalho?','Responda pensando se já presenciou ou sofreu esse tipo de situação no trabalho.'],
  [2,'Você se sente à vontade para relatar situações de assédio moral ou sexual na empresa sem medo de represálias?','Responda se você se sente seguro(a) para relatar situações de assédio na empresa.'],
  [3,'Existe um canal seguro e sigiloso para denunciar assédio na empresa?','Responda se a empresa oferece um meio seguro para denunciar assédio e outras situações.'],
  [4,'Há casos conhecidos de assédio moral ou sexual que não foram devidamente investigados ou punidos?','Responda se você percebe que situações de assédio não são tratadas corretamente.'],
  [5,'O RH e os gestores demonstram comprometimento real com a prevenção do assédio?','Responda se você percebe comprometimento real na prevenção do assédio.'],
  [6,'Você sente que pode contar com seus colegas em momentos de dificuldade?','Responda se você sente que pode contar com seus colegas quando precisa.'],
  [7,'Existe apoio da liderança para lidar com desafios relacionados ao trabalho?','Responda se seus gestores ajudam quando surgem dificuldades no trabalho.'],
  [8,'O RH está presente e atuante quando surgem conflitos ou dificuldades no trabalho?','Responda se o RH costuma apoiar quando há conflitos ou problemas.'],
  [9,'Os gestores promovem um ambiente saudável e respeitoso?','Responda como você avalia o comportamento dos gestores no dia a dia.'],
  [10,'Você sente que pode expressar suas dificuldades no trabalho sem ser julgado(a)?','Responda se você se sente à vontade para falar sobre dificuldades no trabalho.'],
  [11,'Mudanças organizacionais impactaram negativamente seu sentimento de segurança no trabalho?','Responda se mudanças na empresa afetaram sua sensação de segurança no trabalho.'],
  [12,'Há comunicação clara sobre mudanças que afetam a empresa ou os trabalhadores?','Responda se a empresa costuma explicar bem as mudanças que acontecem.'],
  [13,'Você já sentiu que seu emprego estava ameaçado sem explicações claras durante períodos de mudança?','Responda se já sentiu insegurança sobre seu emprego durante mudanças.'],
  [14,'Existe transparência na comunicação da empresa durante processos de mudança?','Responda se as mudanças são comunicadas de forma clara e aberta.'],
  [15,'Você recebe instruções claras sobre suas responsabilidades no trabalho?','Responda se você entende bem quais são suas responsabilidades.'],
  [16,'A comunicação da empresa ajuda você a entender o que é esperado do seu trabalho?','Responda se a empresa deixa claro o que espera do seu trabalho.'],
  [17,'A comunicação entre equipes e setores contribui para a clareza das suas tarefas?','Responda se a comunicação entre áreas ajuda no seu trabalho.'],
  [18,'Você se sente confortável para pedir esclarecimentos quando não entende suas funções ou prioridades?','Responda se você se sente à vontade para perguntar quando não entende algo.'],
  [19,'Você sente que seu esforço e desempenho são reconhecidos pela liderança?','Responda se você se sente valorizado(a) pelo trabalho que realiza.'],
  [20,'Você recebe feedback construtivo sobre o seu trabalho com regularidade?','Responda se você recebe orientações ou retornos sobre seu trabalho.'],
  [21,'Com que frequência você já se sentiu desmotivado(a) por falta de reconhecimento no trabalho?','Responda se a falta de reconhecimento já te deixou desmotivado(a).'],
  [22,'Você tem liberdade para tomar decisões sobre como executar suas tarefas diárias?','Responda se você pode sugerir melhorias ou decidir como fazer suas tarefas.'],
  [23,'A empresa confia na sua capacidade de organizar e gerenciar o próprio trabalho?','Responda se sente que a empresa confia na forma como você organiza seu trabalho.'],
  [24,'Existe excesso de controle ou burocracia que interfere no seu desempenho?','Responda se regras ou controles atrapalham seu desempenho.'],
  [25,'Existe excesso de supervisão que impacta negativamente na sua produtividade ou bem-estar?','Responda se a supervisão excessiva atrapalha seu trabalho ou bem-estar.'],
  [26,'Você acha justas e claras as formas que a empresa usa para avaliar o seu trabalho?','Responda se as formas de avaliar seu trabalho são claras e justas.'],
  [27,'Você sente que há igualdade no reconhecimento entre diferentes áreas ou equipes?','Responda se você percebe tratamento justo entre equipes ou setores.'],
  [28,'Você sente que há transparência nas decisões de desligamento na empresa?','Responda se a empresa é clara quando ocorrem desligamentos.'],
  [29,'Você já presenciou casos de demissões que considerasse injustas?','Responda se já presenciou demissões que considerou injustas.'],
  [30,'Você já vivenciou ou presenciou alguma situação de violência grave no trabalho (como agressão física, ameaça séria ou ataque verbal intenso)?','Responda se já viveu ou viu violência grave no trabalho.'],
  [31,'Você já passou por algum evento grave no trabalho (como acidente sério, situação de risco extremo ou episódio muito impactante)?','Responda se já passou por situações muito graves ou perigosas no trabalho.'],
  [32,'Alguma situação vivida no trabalho já foi tão marcante que deixou medo, choque ou forte abalo emocional?','Responda se alguma situação no trabalho já te causou forte abalo emocional.'],
  [33,'Você sente que, na maior parte do tempo, tem pouco trabalho a realizar durante sua jornada?','Responda se costuma ter pouco trabalho durante sua jornada.'],
  [34,'Você costuma ficar com tempo ocioso no trabalho por falta de tarefas ou demandas claras?','Responda se frequentemente fica sem tarefas para realizar.'],
  [35,'Você sente que suas habilidades ou conhecimentos são pouco utilizados no seu trabalho?','Responda se sente que suas habilidades são pouco aproveitadas.'],
  [36,'Seu trabalho costuma ser pouco desafiador ou repetitivo a ponto de gerar desânimo?','Responda se o trabalho é repetitivo ou desmotivador.'],
  [37,'Você sente que sua carga de trabalho diária é maior do que consegue realizar dentro do horário normal?','Responda se a quantidade de trabalho é maior do que consegue realizar.'],
  [38,'Você frequentemente precisa fazer horas extras ou levar trabalho para casa?','Responda se costuma trabalhar além do horário normal.'],
  [39,'Você já teve sintomas físicos ou emocionais (como exaustão, ansiedade ou insônia) devido ao excesso de trabalho?','Responda se o excesso de trabalho já afetou sua saúde.'],
  [40,'A equipe é dimensionada/dividida corretamente para a demanda/quantidade de trabalho existente?','Responda se a quantidade de pessoas é suficiente para a demanda.'],
  [41,'Você já evitou colegas ou superiores por causa de desentendimentos frequentes?','Responda se já evitou colegas ou superiores por conflitos.'],
  [42,'Você percebe rivalidade excessiva ou desnecessária entre colegas ou setores?','Responda se percebe disputas desnecessárias no trabalho.'],
  [43,'Conflitos no trabalho costumam ser resolvidos de forma justa?','Responda se os conflitos costumam ser resolvidos de forma justa.'],
  [44,'Você trabalha em condições (como turnos diferentes, trabalho externo ou distância física) que dificultam a comunicação no trabalho?','Responda se seu trabalho dificulta a comunicação com colegas ou líderes.'],
  [45,'A distância física entre você e sua equipe ou liderança dificulta a troca de informações?','Responda se a distância atrapalha a troca de informações.'],
  [46,'Você já teve dificuldade para receber informações importantes no momento certo por causa da organização do trabalho?','Responda se já recebeu informações importantes com atraso.'],
  [47,'Você tem acesso fácil aos meios necessários para se comunicar com colegas e liderança durante o trabalho?','Responda se você tem meios adequados para se comunicar no trabalho.'],
  [48,'Você trabalha grande parte do tempo de forma remota ou sozinho(a), com pouco contato presencial com colegas ou liderança?','Responda se você trabalha a maior parte do tempo sozinho(a) ou à distância.'],
  [49,'Você sente que o trabalho remoto ou isolado faz com que se sinta distante da equipe ou da empresa?','Responda se isso faz você se sentir distante da equipe ou da empresa.'],
  [50,'Mesmo trabalhando de forma remota ou isolada, você sente que recebe apoio e acompanhamento adequados da empresa?','Responda se, mesmo à distância, você recebe apoio da empresa.']
 ].map(([n,title,hint])=>({n,title,hint,logic:INV.has(n)?'Invertida':'Direta',topic:TOPICS.find(t=>t.qs.includes(n)).id}));
 function corrected(n,raw){
  const v=Number(raw);
  if(!v) return 0;
  return INV.has(n)?(6-v):v;
 }
 function gravidade(score){
  if(score>=4) return {n:3,l:'Alta'};
  if(score===3) return {n:2,l:'Média'};
  if(score>0) return {n:1,l:'Baixa'};
  return {n:0,l:'—'};
 }
 function topicAvg(answers,topic){
  const scores=topic.qs.map(n=>corrected(n,answers[n])).filter(s=>s>0);
  if(!scores.length) return 0;
  return scores.reduce((a,b)=>a+b,0)/scores.length;
 }
 function roundUp0(n){
  const x=Number(n);
  if(!Number.isFinite(x)) return 0;
  return Math.ceil(x-1e-10);
 }
 function questionRawMean(list,n){
  if(!list.length) return 0;
  return list.reduce((s,r)=>s+(Number(r.answers?.[n])||0),0)/list.length;
 }
 function questionGravidadeNum(list,n){
  const e=roundUp0(questionRawMean(list,n));
  const f=INV.has(n)?(4-e):e;
  if(f>=3) return 3;
  if(f===2) return 2;
  if(f<=1) return 1;
  return 0;
 }
 function gravidadeColetiva(media){
  if(!(media>0)) return {n:0,l:'—'};
  if(media<=1.66) return {n:1,l:'Baixa'};
  if(media<=2.32) return {n:2,l:'Média'};
  return {n:3,l:'Alta'};
 }
 const FONTES={
  1:'Cultura permissiva a desrespeito; ausência de canal de denúncia; liderança despreparada; comunicação violenta.',
  2:'Liderança ausente; falta de escuta; cobrança sem acompanhamento; RH pouco atuante.',
  3:'Comunicação inadequada; mudanças abruptas; falta de planejamento; insegurança quanto à estabilidade.',
  4:'Falta de definição de responsabilidades; ordens contraditórias; comunicação confusa; atribuições mal definidas.',
  5:'Ausência de feedback; foco exclusivo em metas; reconhecimento desigual; falta de plano de crescimento.',
  6:'Microgestão; excesso de burocracia; centralização de decisões; baixa confiança na equipe.',
  7:'Critérios pouco transparentes; favorecimento; desigualdade de tratamento; decisões pouco claras.',
  8:'Falta de protocolos de segurança; exposição a risco; ausência de treinamento; falta de suporte pós-evento.',
  9:'Subutilização de competências; ociosidade; má distribuição de tarefas; funções pouco desafiadoras.',
  10:'Metas irrealistas; equipe insuficiente; jornadas prolongadas; acúmulo de funções.',
  11:'Comunicação agressiva; rivalidade interna; conflitos mal geridos; liderança despreparada.',
  12:'Turnos desalinhados; distância física; falha nos meios de comunicação; fluxo de informação inadequado.',
  13:'Isolamento social; falta de acompanhamento; comunicação exclusivamente digital; baixa integração da equipe.'
 };
 const AGRAVOS='Transtornos psicológicos e emocionais, burnout, ansiedade, insônia, medo, desmotivação e demais agravos à saúde mental quando o fator não é identificado e controlado.';
 function bundle(list){
  list=Array.isArray(list)?list:[];
  const topicos=TOPICS.map(t=>{
   const nums=list.length?t.qs.map(n=>questionGravidadeNum(list,n)):[];
   const avg=nums.length?nums.reduce((a,b)=>a+b,0)/nums.length:0;
   const g=list.length?gravidadeColetiva(avg):{n:0,l:'—'};
   return {id:t.id,nome:t.nome,media:avg,gravidade:g.l,gravidadeN:g.n,fonte:FONTES[t.id]||'',agravo:AGRAVOS};
  });
  const porSetor={};
  list.forEach(r=>{
   const k=String(r.setor||'Não informado').trim()||'Não informado';
   porSetor[k]=(porSetor[k]||0)+1;
  });
  return {n:list.length,topicos,porSetor,altos:topicos.filter(t=>t.gravidadeN>=3)};
 }
 function applyResumo(d,resumo){
  if(!d||!Array.isArray(resumo)||!(d.n>0)) return d;
  const topicos=(d.topicos||[]).map(t=>{
   const o=resumo.find(x=>x.id===t.id);
   if(!o) return t;
   return {...t,media:Number(o.media)||0,gravidade:o.gravidade||t.gravidade,gravidadeN:Number(o.gravidadeN)||0};
  });
  return {...d,topicos,altos:topicos.filter(t=>t.gravidadeN>=3)};
 }
 const PUBLIC_BASE='https://futurofacilitetreinamentos.github.io/futuro-facilite-sst-v8/';
 function publicBase(){
  try{
   if(!/^https?:$/.test(location.protocol)) return PUBLIC_BASE;
   if(!location.hostname || location.hostname==='localhost' || location.hostname==='127.0.0.1') return PUBLIC_BASE;
   let path=location.pathname.replace(/\/[^/]+\.[^/]+$/,'/');
   if(!path.endsWith('/')) path+='/';
   if(path.length<2) return PUBLIC_BASE;
   return location.origin+path;
  }catch(e){ return PUBLIC_BASE; }
 }
 function b64url(str){
  return btoa(unescape(encodeURIComponent(str))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 }
 function unb64url(s){
  try{
   s=String(s||'').replace(/-/g,'+').replace(/_/g,'/');
   while(s.length%4) s+='=';
   return decodeURIComponent(escape(atob(s)));
  }catch(e){ return ''; }
 }
 function encodeReply(rec){
  const digits=Q.map(q=>String(Number(rec.answers?.[q.n])||0)).join('');
  return b64url(JSON.stringify({
   t:rec.token||'',
   f:rec.funcao||'',
   s:rec.setor||'',
   a:digits,
   ts:rec.ts||new Date().toISOString(),
   n:rec.condominio||''
  }));
 }
 function decodeReply(payload){
  const raw=unb64url(payload);
  if(!raw) return null;
  try{
   const o=JSON.parse(raw);
   if(!o || !o.t || !o.a) return null;
   const answers={};
   Q.forEach((q,i)=>{ const v=Number(String(o.a)[i]); if(v>=1&&v<=5) answers[q.n]=v; });
   return {
    id:'imp_'+String(o.ts||'')+'_'+(o.t||''),
    token:o.t,
    condominioId:'',
    condominio:o.n||'',
    funcao:o.f||'',
    setor:o.s||'',
    answers,
    ts:o.ts||new Date().toISOString()
   };
  }catch(e){ return null; }
 }
 function formUrl(token,nome){
  const u=new URL('drps.html', publicBase());
  u.searchParams.set('c', token||'');
  if(nome) u.searchParams.set('n', nome);
  return u.href;
 }
 function ingestUrl(rec){
  const u=new URL('drps.html', publicBase());
  u.searchParams.set('save', encodeReply(rec));
  return u.href;
 }
 function nColabs(p){
  const n=Number(p?.empresa?.numTrabalhadores);
  if(n>0) return n;
  return (p?.funcoes||[]).reduce((s,f)=>s+(Number(f.quantidade)||0),0);
 }
 return {SCALE,TOPICS,QUESTIONS:Q,corrected,gravidade,gravidadeColetiva,topicAvg,questionGravidadeNum,bundle,applyResumo,FONTES,AGRAVOS,PUBLIC_BASE,publicBase,encodeReply,decodeReply,formUrl,ingestUrl,nColabs};
})();
