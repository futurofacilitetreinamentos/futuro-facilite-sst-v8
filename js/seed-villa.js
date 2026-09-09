
const SeedVilla=(()=>{
 const FLAG='ff_sst_v8_seed_villa_borghese';
 const CNPJ='17456065000149';
 const NOME='CONDOMINIO DO EDIFICIO VILLA BORGHESE';
 const ITEMS=[
  'PGR disponível e atualizado','PCMSO disponível e atualizado','LTCAT disponível ou tecnicamente avaliado','ASOs admissionais, periódicos e demissionais organizados','Fichas de entrega de EPI assinadas','Treinamentos obrigatórios registrados','Eventos de SST enviados ao eSocial',
  'EPIs adequados às atividades executadas','EPIs possuem CA válido','Empregados receberam orientação de uso e conservação','Há controle de substituição e higienização dos EPIs',
  'Portaria possui condições ergonômicas adequadas','Garagem possui iluminação e sinalização adequadas','Escadas e rampas possuem corrimãos e piso seguro','Casa de máquinas possui acesso controlado','Área da piscina está sinalizada e protegida','Depósito está organizado e sem obstruções','Área de resíduos possui condições de higiene e acesso seguro',
  'Quadros elétricos estão fechados, identificados e sem partes expostas','Não há fios desencapados ou instalações improvisadas','Extintores estão sinalizados, acessíveis e dentro da validade','Rotas e saídas de emergência estão desobstruídas','Iluminação de emergência está funcionando',
  'Produtos químicos estão identificados','Produtos possuem FISPQ/SDS disponível quando aplicável','Armazenamento de produtos é ventilado e seguro','Não há mistura ou reaproveitamento inadequado de embalagens','Trabalhadores utilizam luvas e proteção adequada',
  'Escadas portáteis estão íntegras e adequadas','Ferramentas manuais estão conservadas','Atividades em altura são planejadas e executadas por trabalhador capacitado','Máquinas e equipamentos possuem proteção e manutenção','Serviços elétricos são realizados por profissional autorizado',
  'Riscos físicos foram identificados','Riscos químicos foram identificados','Riscos biológicos foram identificados','Riscos ergonômicos foram identificados','Riscos de acidentes foram identificados','Há medidas de prevenção compatíveis com os riscos encontrados'
 ];
 const OBS_EPI='Na inspeção, verificou-se que o condomínio não possui fichas de entrega de EPI devidamente preenchidas e assinadas pelos colaboradores. Isso impede a comprovação formal do fornecimento dos equipamentos, dificulta o controle de entrega, substituição e uso, e compromete o atendimento às exigências legais de segurança e saúde no trabalho.';
 const ACAO_EPI='Recomenda-se a implantação imediata do controle de entrega de EPIs por meio de fichas individuais, contendo a identificação do colaborador, descrição dos equipamentos fornecidos, datas de entrega e substituição, orientações quanto ao uso, guarda e conservação, bem como a assinatura do empregado e do responsável pela entrega. As fichas devem ser mantidas atualizadas e arquivadas para fins de controle e comprovação do atendimento às exigências legais.';
 const OBS_PORT='Na inspeção, verificou-se que a portaria apresenta condições inadequadas de conforto térmico. Em razão da grande área envidraçada voltada para a entrada, há incidência de radiação solar no período da tarde, elevando significativamente a temperatura interna e tornando o ambiente abafado, o que causa desconforto térmico ao porteiro e pode comprometer o bem-estar e o desempenho. O mobiliário utilizado para guarda de encomendas dos moradores está em altura inadequada, obrigando o porteiro a realizar flexões constantes de tronco para guardar e retirar volumes. Essa condição favorece posturas inadequadas e aumenta o risco de desconforto osteomuscular, especialmente na região lombar, podendo contribuir para agravos ocupacionais ao longo do tempo.';
 const ACAO_PORT='Recomenda-se a instalação de aparelho de ar-condicionado com capacidade compatível com o ambiente, visando proporcionar condições adequadas de conforto térmico, melhorar o bem-estar do trabalhador e contribuir para um ambiente de trabalho mais seguro e saudável. Recomenda-se a substituição ou adequação do armário por mobiliário ergonomicamente apropriado, permitindo que as encomendas sejam armazenadas e retiradas preferencialmente entre a altura dos joelhos e dos ombros, reduzindo a necessidade de flexões repetitivas da coluna e proporcionando melhores condições de trabalho ao porteiro.';
 function digits(s){ return String(s||'').replace(/\D/g,''); }
 function findCondo(){
  return V8Storage.list().find(p=>digits(p.empresa?.cnpj)===CNPJ || /villa borgh/i.test(p.empresa?.razaoSocial||''));
 }
 function equipePick(tipo){ return V8Storage.equipeByTipo(tipo)[0]||null; }
 function buildProject(){
  const sst=equipePick('sst'), med=equipePick('medico'), eng=equipePick('engenheiro');
  const crm=med?[med.registro,med.rqe].filter(Boolean).join(' / '):'';
  return {
   id:'condo_villa_borghese',
   drpsToken:'dvilla_borghese',
   salvoEm:new Date().toLocaleString('pt-BR'),
   agenda:[{id:'ag_villa_20260723',data:'2026-07-23',hora:'08:00',tecnico:'Francson Menezes Alves',obs:'Inspeção já realizada — relatório SST-2026-0001.',status:'realizada',inspecaoId:'insp_villa_sst_2026_0001'}],
   empresa:{
    razaoSocial:NOME,
    nomeFantasia:'Villa Borghese',
    cnpj:'17.456.065/0001-49',
    cnae:'8111-3/00',
    grauRisco:'2',
    numTrabalhadores:'8',
    endereco:'QUADRA QS 303 CONJUNTO 07 LOTES 01, 02 E 03, s/n',
    responsavelEmpresa:'Eliane Soares dos Santos',
    contatoEmpresa:'(61) 3436-7234',
    emailEmpresa:'',
    dataElaboracao:'2026-07-23',
    atividadeEmpresa:'Administração do condomínio edilício, portaria e serviços gerais de conservação e limpeza.',
    respSst:sst?.nome||'',
    funcaoRespSst:sst?.funcao||'Técnico de Segurança do Trabalho',
    regSst:sst?.registro||'',
    respSstId:sst?.id||'',
    medicoTrabalho:med?.nome||'',
    crmMedico:crm,
    medicoId:med?.id||'',
    engSeguranca:eng?.nome||'',
    creaEng:eng?.registro||'',
    engId:eng?.id||''
   },
   setores:[
    {nome:'Portaria',ambiente:'Guarita / atendimento',descricao:'Posto de trabalho do porteiro, com área envidraçada voltada à entrada e guarda de encomendas.'},
    {nome:'Áreas comuns',ambiente:'Condomínio',descricao:'Garagem, escadas, casa de máquinas, piscina, depósito e área de resíduos.'}
   ],
   funcoes:[
    {nome:'Porteiro',setor:'Portaria',quantidade:'4',cbo:'5174-10',atividades:'Controle de acesso, atendimento a moradores, recebimento e guarda de encomendas. Jornada 12x36 diurno e noturno.'},
    {nome:'Serviços Gerais',setor:'Áreas comuns',quantidade:'4',cbo:'5143-20',atividades:'Conservação, limpeza e apoio operacional nas áreas comuns. Jornada 6x1 diurno.'}
   ],
   ghe:[
    {nome:'GHE-01 Porteiros',setor:'Portaria',funcoes:'Porteiro',descricao:'Grupo homogêneo da portaria, exposição similar a postura, conforto térmico e atendimento ao público.'},
    {nome:'GHE-02 Serviços gerais',setor:'Áreas comuns',funcoes:'Serviços Gerais',descricao:'Grupo homogêneo de conservação e limpeza das áreas comuns.'}
   ],
   riscos:[
    {ghe:'GHE-01 Porteiros',funcao:'Porteiro',grupo:'Ergonômico',perigo:'Conforto térmico inadequado e mobiliário de encomendas em altura imprópria na portaria',fonte:'Grande área envidraçada com incidência solar à tarde; armário de encomendas em altura que exige flexão de tronco.',dano:'Desconforto térmico, redução de desempenho, desconforto osteomuscular lombar e risco de agravo ocupacional.',controles:'Não identificados controles suficientes de climatização nem mobiliário ergonômico.',prob:'4',sev:'4',acao:ACAO_PORT,responsavel:'Administração do condomínio',prazo:'2026-08-31',status:'Pendente'},
    {ghe:'GHE-01 Porteiros',funcao:'Porteiro',grupo:'Acidente',perigo:'Ausência de fichas de entrega de EPI assinadas',fonte:'Falta de controle formal de fornecimento, substituição e orientação de uso dos EPIs.',dano:'Sem comprovação legal do fornecimento; dificuldade de controle de entrega e uso; exposição jurídica e operacional.',controles:'EPIs existem nas atividades, porém sem fichas individuais assinadas.',prob:'3',sev:'4',acao:ACAO_EPI,responsavel:'Administração do condomínio',prazo:'2026-08-31',status:'Pendente'}
   ]
  };
 }
 function buildChecklist(){
  const checklist={};
  ITEMS.forEach((titulo,i)=>{
   const id='item_'+i;
   const nc=i===4||i===11;
   checklist[id]={
    titulo,
    status:nc?'Não conforme':'Conforme',
    obs:i===4?OBS_EPI:i===11?OBS_PORT:'',
    acao:i===4?ACAO_EPI:i===11?ACAO_PORT:'',
    risco:nc?'Alto':'Baixo',
    prazo:nc?'2026-08-31':'',
    responsavel:nc?'Administração do condomínio':'Administração do condomínio',
    photos:[]
   };
  });
  return checklist;
 }
 function buildReport(p){
  return {
   id:'insp_villa_sst_2026_0001',
   numero:'SST-2026-0001',
   condominioId:p.id,
   agendaId:'ag_villa_20260723',
   condominio:NOME,
   cnpj:'17.456.065/0001-49',
   endereco:p.empresa.endereco,
   sindica:'Eliane Soares dos Santos',
   telefone:'(61) 3436-7234',
   emailCondominio:'',
   dataVisita:'2026-07-23',
   tecnico:'Francson Menezes Alves',
   objetivo:'Avaliar as condições de segurança e saúde no ambiente de trabalho do condomínio, identificar perigos e recomendar medidas preventivas e corretivas.',
   totalEmpregados:'8',
   proprios:'8',
   terceirizados:'0',
   funcoes:'Porteiro e Serviços Gerais',
   jornadas:'12x36 diurno e noturno e 6x1 diurno',
   conclusao:'A inspeção realizada identificou 2 não conformidade(s) nas condições avaliadas, sendo 2 classificada(s) como risco alto. Recomenda-se a implementação das medidas corretivas indicadas neste relatório (fichas de EPI e adequação ergonômica/térmica da portaria), priorizando os prazos estabelecidos. Após as adequações, recomenda-se nova verificação das condições de trabalho.',
   recomendacoes:'1) Implantar fichas individuais de entrega de EPI, assinadas e arquivadas. 2) Instalar ar-condicionado compatível na portaria e adequar o mobiliário de encomendas à altura entre joelhos e ombros.',
   assinaturaSindica:'Eliane Soares dos Santos',
   assinaturaTecnico:'Francson Menezes Alves',
   fotoCapa:'',
   checklist:buildChecklist(),
   salvoEm:'23/07/2026, 10:47:15'
  };
 }
 function saveReport(p){
  const KEY='ff_sst_v7_reports';
  const SEQ='ff_sst_v7_seq';
  let all=[];
  try{ all=JSON.parse(localStorage.getItem(KEY)||'[]'); }catch(e){ all=[]; }
  if(all.some(r=>r.id==='insp_villa_sst_2026_0001' || r.condominioId===p.id || /villa borgh/i.test(r.condominio||''))) return;
  all.unshift(buildReport(p));
  localStorage.setItem(KEY,JSON.stringify(all));
  const seq=parseInt(localStorage.getItem(SEQ)||'0',10);
  if(seq<1) localStorage.setItem(SEQ,'1');
 }
 function run(){
  let p=findCondo();
  if(!p){
   p=buildProject();
   V8Storage.save(p);
  }
  saveReport(p);
  localStorage.setItem(FLAG,'1');
  return p;
 }
 return {run};
})();
