
const SeedLira=(()=>{
 const FLAG='ff_sst_v8_seed_dona_lira_ii';
 const CNPJ='09584230000110';
 const NOME='Condomínio do Residencial Dona Lira II';
 const ITEMS=[
  'PGR disponível e atualizado','PCMSO disponível e atualizado','LTCAT disponível ou tecnicamente avaliado','ASOs admissionais, periódicos e demissionais organizados','Fichas de entrega de EPI assinadas','Treinamentos obrigatórios registrados','Eventos de SST enviados ao eSocial',
  'EPIs adequados às atividades executadas','EPIs possuem CA válido','Empregados receberam orientação de uso e conservação','Há controle de substituição e higienização dos EPIs',
  'Portaria possui condições ergonômicas adequadas','Garagem possui iluminação e sinalização adequadas','Escadas e rampas possuem corrimãos e piso seguro','Casa de máquinas possui acesso controlado','Área da piscina está sinalizada e protegida','Depósito está organizado e sem obstruções','Área de resíduos possui condições de higiene e acesso seguro',
  'Quadros elétricos estão fechados, identificados e sem partes expostas','Não há fios desencapados ou instalações improvisadas','Extintores estão sinalizados, acessíveis e dentro da validade','Rotas e saídas de emergência estão desobstruídas','Iluminação de emergência está funcionando',
  'Produtos químicos estão identificados','Produtos possuem FISPQ/SDS disponível quando aplicável','Armazenamento de produtos é ventilado e seguro','Não há mistura ou reaproveitamento inadequado de embalagens','Trabalhadores utilizam luvas e proteção adequada',
  'Escadas portáteis estão íntegras e adequadas','Ferramentas manuais estão conservadas','Atividades em altura são planejadas e executadas por trabalhador capacitado','Máquinas e equipamentos possuem proteção e manutenção','Serviços elétricos são realizados por profissional autorizado',
  'Riscos físicos foram identificados','Riscos químicos foram identificados','Riscos biológicos foram identificados','Riscos ergonômicos foram identificados','Riscos de acidentes foram identificados','Há medidas de prevenção compatíveis com os riscos encontrados'
 ];
 const ACAO_EPI='Fornecimento e manutenção dos EPIs listados no PGR (luva CA 37277, óculos CA 10346, botina, protetor auditivo e boné árabe), com ficha de entrega assinada. Treinamento NR-6 de uso, guarda, conservação e higienização. Inspeção visual mensal dos equipamentos.';
 const ACAO_UV='Fornecer vestimenta com proteção UV e capuz/boné árabe nas atividades de jardinagem a céu aberto. Treinar o uso do EPI (NR-6).';
 const ACAO_QUIM='Manter luva nitrílica (CA 37277) e óculos de proteção (CA 10346) com CA vigente. Exigir e fiscalizar o uso durante a limpeza com produtos domissanitários.';
 const ACAO_BIO='Uso constante de luva e óculos na limpeza, jardinagem e recolhimento de lixo. Treinamento NR-6.';
 const ACAO_ERGO='Orientação postural (NR-17), alongamentos ao longo da jornada, pausas programadas e cartaz/panfleto de exercícios compensatórios.';
 const ACAO_CARGA='Orientação para transporte de cargas, luva contra acidentes mecânicos, alongamentos e pausas programadas.';
 const ACAO_QUEDA='Uso de calçado tipo botina e treinamento NR-6. Fiscalizar o uso durante o transporte de cargas.';
 const ACAO_PECONHA='Uso de botina e luva nas atividades de jardinagem. Treinamento NR-6.';
 const ACAO_CORTE='Treinamento de uso, guarda e conservação do EPI nas atividades com tesoura de jardinagem e materiais perfurocortantes.';
 function digits(s){ return String(s||'').replace(/\D/g,''); }
 function findCondo(){
  return V8Storage.list().find(p=>digits(p.empresa?.cnpj)===CNPJ || /dona lira/i.test(p.empresa?.razaoSocial||''));
 }
 function equipePick(tipo, hint){
  const list=V8Storage.equipeByTipo(tipo)||[];
  if(hint){
   const h=hint.toLowerCase();
   const hit=list.find(x=>String(x.nome||'').toLowerCase().includes(h));
   if(hit) return hit;
  }
  return list[0]||null;
 }
 function buildProject(){
  const sst=equipePick('sst','daniel'), med=equipePick('medico','leticia'), eng=equipePick('engenheiro');
  const crm=med?[med.registro,med.rqe].filter(Boolean).join(' / '):'31140/DF';
  const resp='Administração do condomínio';
  return {
   id:'condo_dona_lira_ii',
   drpsToken:'dlira_ii',
   salvoEm:new Date().toLocaleString('pt-BR'),
   agenda:[{id:'ag_lira_20260304',data:'2026-03-04',hora:'08:00',tecnico:sst?.nome||'Daniel Mateus da Silva de Holanda',obs:'Visita técnica dos laudos PGR / PCMSO / LTCAT — 04/03/2026.',status:'realizada',inspecaoId:'insp_lira_2026_0304'}],
   empresa:{
    razaoSocial:NOME,
    nomeFantasia:NOME,
    cnpj:'09.584.230/0001-10',
    cnae:'8111-3/00',
    grauRisco:'2',
    numTrabalhadores:'1',
    endereco:'Quadra QR 404 Conj. 04-A Lote 01, Samambaia Norte, Brasília-DF, CEP 72.318-105',
    responsavelEmpresa:'Administração (Facilite Condominial)',
    contatoEmpresa:'(61) 98208-2748',
    emailEmpresa:'dp@facilitecondominial.com.br',
    dataElaboracao:'2026-03-04',
    atividadeEmpresa:'Administração do condomínio edilício, zeladoria, limpeza de ambientes, jardinagem e conservação do patrimônio.',
    respSst:sst?.nome||'Daniel Mateus da Silva de Holanda',
    funcaoRespSst:sst?.funcao||'Técnico de Segurança do Trabalho',
    regSst:sst?.registro||'0010748/DF',
    respSstId:sst?.id||'',
    medicoTrabalho:med?.nome||'Dra. Leticia de Lara Rocha Silva',
    crmMedico:crm,
    medicoId:med?.id||'',
    engSeguranca:eng?.nome||'',
    creaEng:eng?.registro||'',
    engId:eng?.id||''
   },
   setores:[
    {nome:'Zeladoria',ambiente:'Áreas comuns do edifício',descricao:'Não possui posto fixo. Atua em todo o perímetro do edifício: limpeza, jardinagem, recolhimento de lixo e pequenos reparos.'}
   ],
   funcoes:[
    {nome:'Zelador',setor:'Zeladoria',quantidade:'1',cbo:'5141-20',atividades:'Zela pela segurança das pessoas e do patrimônio. Atende e controla a movimentação de pessoas; recebe objetos, mercadorias, materiais e equipamentos; conduz o elevador; realiza limpeza com produtos domissanitários, jardinagem e pequenos reparos. Jornada 44 h semanais (8 h diárias).'}
   ],
   ghe:[
    {nome:'GHE 1: Zeladoria',setor:'Zeladoria',funcoes:'Zelador',descricao:'Grupo homogêneo da zeladoria: limpeza de ambientes com ferramental padrão e produtos domissanitários, jardinagem a céu aberto e recolhimento de lixo.'}
   ],
   riscos:[
    {ghe:'GHE 1: Zeladoria',funcao:'Zelador',grupo:'Físico',perigo:'Radiação não ionizante',fonte:'Trabalhos de jardinagem a céu aberto.',dano:'Exposição pode aumentar o risco de câncer e queimaduras.',controles:'Não identificado.',prob:'3',sev:'1',acao:ACAO_UV,responsavel:resp,prazo:'2026-04-30',status:'Pendente'},
    {ghe:'GHE 1: Zeladoria',funcao:'Zelador',grupo:'Químico',perigo:'Produtos domissanitários',fonte:'Água sanitária, álcool 70% e desinfetante na limpeza dos ambientes.',dano:'Intoxicação, irritação à pele e ocular, eritema, alergia, irritação nas vias aéreas, náuseas, tosse e lesões nos olhos.',controles:'Luva de proteção (CA 37277); óculos de proteção (CA 10346).',prob:'3',sev:'1',acao:ACAO_QUIM,responsavel:resp,prazo:'2026-04-30',status:'Pendente'},
    {ghe:'GHE 1: Zeladoria',funcao:'Zelador',grupo:'Biológico',perigo:'Agentes biológicos infecciosos ou infectocontagiosos',fonte:'Limpeza, jardinagem e recolhimento de lixo.',dano:'Contaminação e transmissão de diferentes patologias.',controles:'Luva de proteção (CA 37277); óculos de proteção (CA 10346).',prob:'3',sev:'1',acao:ACAO_BIO,responsavel:resp,prazo:'2026-04-30',status:'Pendente'},
    {ghe:'GHE 1: Zeladoria',funcao:'Zelador',grupo:'Ergonômico',perigo:'Trabalho em posturas incômodas por longos períodos',fonte:'Limpeza dos ambientes, jardinagem e recolhimento de lixo ao longo da jornada.',dano:'Lombalgias, DORT, desvios posturais e cervicalgias.',controles:'Alternância postural e de atividades durante a jornada.',prob:'3',sev:'1',acao:ACAO_ERGO,responsavel:resp,prazo:'2026-04-30',status:'Pendente'},
    {ghe:'GHE 1: Zeladoria',funcao:'Zelador',grupo:'Ergonômico',perigo:'Levantamento e transporte manual de cargas ou volumes',fonte:'Transporte de sacos de lixo, lixeiras e insumos em grandes quantidades.',dano:'Lombalgias, DORT e sobrecarga osteomuscular.',controles:'Não identificado.',prob:'1',sev:'1',acao:ACAO_CARGA,responsavel:resp,prazo:'2026-04-30',status:'Pendente'},
    {ghe:'GHE 1: Zeladoria',funcao:'Zelador',grupo:'Acidente',perigo:'Queda de objetos',fonte:'Levantamento e transporte manual de cargas.',dano:'Traumas, concussões, fraturas e escoriações.',controles:'Calçado tipo botina com bico de aço (CA não identificado).',prob:'1',sev:'1',acao:ACAO_QUEDA,responsavel:resp,prazo:'2026-04-30',status:'Pendente'},
    {ghe:'GHE 1: Zeladoria',funcao:'Zelador',grupo:'Acidente',perigo:'Animais peçonhentos',fonte:'Atividades de jardinagem.',dano:'Hemorragia, infecção, necrose na picada e insuficiência renal.',controles:'Botina e luva de proteção (CA 37277).',prob:'3',sev:'3',acao:ACAO_PECONHA,responsavel:resp,prazo:'2026-04-30',status:'Pendente'},
    {ghe:'GHE 1: Zeladoria',funcao:'Zelador',grupo:'Acidente',perigo:'Equipamentos perfurocortantes',fonte:'Uso de tesoura de jardinagem.',dano:'Cortes, perfurações, hemorragias e transmissão de patógenos (HIV, hepatites B e C).',controles:'Não identificado.',prob:'3',sev:'3',acao:ACAO_CORTE,responsavel:resp,prazo:'2026-04-30',status:'Pendente'},
    {ghe:'GHE 1: Zeladoria',funcao:'Zelador',grupo:'Acidente',perigo:'Controle formal de EPI e treinamento NR-6',fonte:'Necessidade de ficha de entrega, CA vigente e fiscalização de uso.',dano:'Sem comprovação legal do fornecimento e uso inadequado do EPI.',controles:'Luvas, óculos, botina e protetor auditivo já existentes; ficha de controle sugerida no Apêndice A.',prob:'3',sev:'2',acao:ACAO_EPI,responsavel:resp,prazo:'2026-04-30',status:'Pendente'}
   ]
  };
 }
 function buildChecklist(){
  const checklist={};
  ITEMS.forEach((titulo,i)=>{
   checklist['item_'+i]={
    titulo,
    status:'Conforme',
    obs:'',
    acao:'',
    risco:'Baixo',
    prazo:'',
    responsavel:'Administração do condomínio',
    photos:[]
   };
  });
  return checklist;
 }
 function buildReport(p){
  const e=p.empresa||{};
  return {
   id:'insp_lira_2026_0304',
   numero:'SST-2026-LIRA',
   condominioId:p.id,
   agendaId:'ag_lira_20260304',
   condominio:NOME,
   cnpj:e.cnpj,
   endereco:e.endereco,
   sindica:e.responsavelEmpresa,
   telefone:e.contatoEmpresa,
   emailCondominio:e.emailEmpresa,
   dataVisita:'2026-03-04',
   tecnico:e.respSst,
   objetivo:'Visita técnica para elaboração do PGR, PCMSO e LTCAT: reconhecimento dos perigos da zeladoria, GHE, EPIs existentes e medidas propostas.',
   totalEmpregados:'1',
   proprios:'1',
   terceirizados:'0',
   funcoes:'Zelador',
   jornadas:'44 h semanais (8 h diárias)',
   conclusao:'A visita técnica identificou um GHE de zeladoria, com exposição qualitativa a radiação solar, produtos de limpeza, agentes biológicos, posturas, cargas, queda de objetos, animais peçonhentos e perfurocortantes. Não foram registradas não conformidades de checklist. As medidas de EPI, treinamento NR-6 e orientação ergonômica constam do plano de ação do PGR.',
   recomendacoes:'Manter EPIs com CA vigente, fichas de entrega assinadas, treinamento NR-6, orientação postural e reanálise do PGR até janeiro de 2027.',
   assinaturaSindica:e.responsavelEmpresa,
   assinaturaTecnico:e.respSst,
   fotoCapa:'',
   checklist:buildChecklist(),
   salvoEm:'04/03/2026, 09:00:00'
  };
 }
 function saveReport(p){
  const KEY='ff_sst_v7_reports';
  let all=[];
  try{ all=JSON.parse(localStorage.getItem(KEY)||'[]'); }catch(e){ all=[]; }
  if(all.some(r=>r.id==='insp_lira_2026_0304' || r.condominioId===p.id || /dona lira/i.test(r.condominio||''))) return;
  all.unshift(buildReport(p));
  localStorage.setItem(KEY,JSON.stringify(all));
 }
 function run(){
  let p=findCondo();
  const created=!p;
  if(!p){
   p=buildProject();
   V8Storage.save(p,{ativo:false});
  }
  saveReport(p);
  localStorage.setItem(FLAG,'1');
  if(created) V8Storage.setAtivo(p.id);
  return p;
 }
 return {run};
})();
