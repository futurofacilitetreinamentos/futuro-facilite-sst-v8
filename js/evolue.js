
const EvolueDocs=(()=>{
 const MESES=['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'];
 function mesAno(d){
  if(!d) return '—';
  const p=String(d).split('-');
  if(p.length===3) return (MESES[Number(p[1])-1]||p[1])+' DE '+p[0];
  return d;
 }
 function mesAnoCapa(d){
  const meses=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const p=String(d||'').split('-');
  if(p.length===3){
   const m=meses[Number(p[1])-1]||p[1];
   return m.charAt(0).toUpperCase()+m.slice(1)+' de '+p[0];
  }
  return d||'—';
 }
 function dataExtenso(d){
  const meses=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const p=String(d||'').split('-');
  if(p.length===3) return Number(p[2])+' de '+meses[Number(p[1])-1]+' de '+p[0];
  const now=new Date();
  return now.getDate()+' de '+meses[now.getMonth()]+' de '+now.getFullYear();
 }
 function te(prob){
  const n=Number(prob);
  if(n>=4) return 'P';
  if(n>=2) return 'I';
  return 'E';
 }
 function teNome(code){ return code==='P'?'Permanente':code==='I'?'Intermitente':'Eventual'; }
 function pd(sev){
  const n=Number(sev);
  if(n>=5) return 'C';
  if(n>=4) return 'A';
  if(n>=3) return 'M';
  return 'B';
 }
 function pdNome(code){ return code==='C'?'Crítico':code==='A'?'Alto':code==='M'?'Médio':'Baixo'; }
 function gr(prob,sev){
  const s=Number(prob)*Number(sev);
  if(s>=17) return 'IT';
  if(s>=10) return 'S';
  if(s>=5) return 'M';
  return 'T';
 }
 function grNome(code){ return code==='IT'?'Intolerável':code==='S'?'Substancial':code==='M'?'Moderado':'Tolerável'; }
 function grupoLetra(g){
  const t=String(g||'').toLowerCase();
  if(/qu[ií]m/.test(t)) return 'Q';
  if(/biol/.test(t)) return 'B';
  if(/ergo/.test(t)) return 'E';
  if(/acid/.test(t)) return 'A';
  if(/psico/.test(t)) return 'P';
  return 'F';
 }
 function groups(p){
  const ghes=p.ghe||[];
  const funcoes=p.funcoes||[];
  const riscos=p.riscos||[];
  if(ghes.length){
   return ghes.map(g=>{
    const fn=funcoes.filter(f=>f.setor===g.setor || String(g.funcoes||'').toLowerCase().includes(String(f.nome||'').toLowerCase()));
    const rs=riscos.filter(r=>r.ghe===g.nome || fn.some(f=>f.nome===r.funcao));
    return {ghe:g, funcoes:fn.length?fn:funcoes.filter(f=>f.setor===g.setor), riscos:rs.length?rs:riscos.filter(r=>r.ghe===g.nome)};
   });
  }
  if(funcoes.length){
   return funcoes.map(f=>({
    ghe:{nome:'GHE '+f.nome,setor:f.setor||'',funcoes:f.nome,descricao:f.atividades||''},
    funcoes:[f],
    riscos:riscos.filter(r=>r.funcao===f.nome || r.ghe===f.nome)
   }));
  }
  return [{ghe:{nome:'Ambientes do condomínio',setor:'',funcoes:'',descricao:p.empresa?.atividadeEmpresa||''},funcoes:[],riscos}];
 }
 const PGR={
  apresentacao:'O presente documento foi desenvolvido em atendimento à Norma Regulamentadora nº 01, do Ministério do Trabalho e Emprego, que estabelece os requisitos necessários para o Gerenciamento de Riscos Ocupacionais (GRO), que deve constituir um Programa de Gerenciamento de Riscos (PGR) por parte de todos os empregadores e instituições que admitam trabalhadores como empregados, aprovado pela Portaria SEPRT n.º 6.730, de 09 de março de 2020.',
  sumario:['1. Introdução','2. Documento-base','2.1. Integração com o PCMSO','3. Identificação da empresa','4. Estrutura do PGR','5. Identificação dos agentes de riscos ocupacionais','6. Avaliação dos riscos e perigos','7. Inventário de riscos e perigos (GHE)','8. Riscos psicossociais (DRPS / NR-1)','9. Implantação de medidas de controle e EPI','10. Plano de ação','11. Considerações finais','12. Referências','13. Responsabilidade técnica'],
  intro:'O Gerenciamento de Riscos Ocupacionais (GRO) é o sistema de melhoria contínua dos ambientes de trabalho. O Programa de Gerenciamento de Riscos (PGR) é a ferramenta essencial para prevenção da saúde e proteção da integridade dos trabalhadores: identifica, avalia, monitora e controla perigos e riscos. O PGR deve estar integrado ao PCMSO (NR-7), ao LTCAT e às demais ações de SST do estabelecimento.',
  base:'O documento-base apresenta a estratégia e a metodologia de ação, as formas de registro, manutenção e divulgação dos dados, a periodicidade de avaliação e o planejamento das metas. Este programa, suas alterações e complementações devem ficar disponíveis aos trabalhadores interessados ou seus representantes e à Inspeção do Trabalho.',
  pcmso:'O PGR constitui as informações do inventário de riscos ocupacionais, devendo estar articulado com as demais NRs, em especial com o Programa de Controle Médico de Saúde Ocupacional (PCMSO) previsto na NR-7.',
  estrutura:'O PGR descrito neste documento-base contém: inventário de riscos; planejamento continuado; plano de ações; registro e manutenção de dados. A revisão ocorre no mínimo a cada dois anos ou antes, quando houver mudança relevante de processo, ambiente, controles, acidente, doença relacionada ao trabalho ou requisito legal.',
  hierarquia:'A hierarquia de controles observa: (1) eliminação dos fatores de risco; (2) medidas de proteção coletiva; (3) medidas administrativas ou de organização do trabalho; (4) proteção individual (EPI).',
  visita:'A visita técnica identifica as situações de risco com a colaboração dos trabalhadores e das chefias. A metodologia de reconhecimento segue a NR-1/NR-9: identificação dos perigos e agentes, funções expostas, fonte geradora, possíveis danos à saúde e medidas de controle existentes e propostas.',
  qualitativa:'A avaliação qualitativa utiliza a matriz de Graduação de Risco (GR = Severidade × Frequência), com Tempo de Exposição Eventual, Intermitente ou Permanente e Potencial de Dano Baixo, Médio, Alto ou Crítico. As ações seguem a graduação: Tolerável, Moderado, Substancial ou Intolerável.',
  ghe:'A abordagem de risco é feita por Grupo Homogêneo de Exposição (GHE): trabalhadores com exposições similares, de forma que a avaliação de parte do grupo represente os demais.',
  controles:'Devem ser adotadas medidas suficientes para eliminar, minimizar ou controlar os riscos quando a NR exigir, quando a classificação assim determinar, quando houver evidência de agravo à saúde associado ao trabalho, ou quando avaliações quantitativas excederem os limites da NR-15 ou da ACGIH.',
  epi:'O empregador deve registrar o fornecimento de EPI (NR-6), orientar uso, guarda e conservação, e fiscalizar o uso. Fichas individuais de entrega devem permanecer atualizadas e arquivadas.',
  final:'Este PGR permanece vinculado aos dados cadastrados no sistema. Inventário, DRPS coletivo e plano de ação devem ser atualizados sempre que houver mudança nos processos, ambientes, atividades, organização do trabalho ou controles.',
  registro:'O inventário de riscos e o histórico das atualizações devem ser mantidos por no mínimo 20 anos, disponíveis aos trabalhadores e às autoridades competentes, conforme NR-1.',
  revisoes:'O controle de revisões serve ao propósito de registrar as alterações do documento, facilitando o manejo de dados atualizados para gestão integrada de qualidade, saúde e meio ambiente, bem como norteador para acompanhamento do envio de informações que sofram alterações ao longo da vigência do programa.',
  refs:'NR-1 (GRO/PGR) — Portaria SEPRT n.º 6.730/2020; NR-6; NR-7; NR-9; NR-15; NR-16; NR-17; Portaria MTP n.º 25/94; Lei 9.732/1998; Decreto 3.048/99; IN INSS/PRES n.º 77/2015; NHO FUNDACENTRO; Manual de Orientação do eSocial (leiautes vigentes).'
 };
 const PCMSO={
  apresentacao:'O presente documento foi desenvolvido em atendimento à Norma Regulamentadora nº 07, do Ministério do Trabalho e Emprego, que estabelece diretrizes e requisitos para o desenvolvimento do Programa de Controle Médico de Saúde Ocupacional (PCMSO) nas organizações, com o objetivo de proteger e preservar a saúde de seus empregados em relação aos riscos ocupacionais. Aprovado pela Portaria n.º 3.214, de 08 de junho de 1978.',
  sumario:['1. Identificação do estabelecimento','2. Introdução','2.1. Médico responsável do PCMSO','3. Desenvolvimento (exames A/P/R/M/D)','4. Atestado de Saúde Ocupacional — ASO','5. Registro e documentações obrigatórias','6. Planejamento de exames clínicos e complementares','7. Disposições finais','8. Responsabilidade técnica','9. Anexos — eSocial'],
  intro:'Este programa atende à NR-7 e está harmonizado com o PGR do estabelecimento. Tem caráter de prevenção, rastreamento e diagnóstico precoce dos agravos à saúde relacionados ao trabalho, inclusive de natureza subclínica.',
  tipos:'No desenvolvimento do PCMSO incluem-se os exames: admissional; periódico; de retorno ao trabalho; de mudança de risco ocupacional; e demissional. Compreendem exame clínico e exames complementares, conforme esta NR e as demais aplicáveis.',
  aso:'Para cada exame clínico ocupacional o médico emitirá ASO, disponibilizado ao empregado. O ASO contém, no mínimo: razão social e CNPJ; identificação do empregado e função; perigos do PGR que necessitem de controle médico; exames realizados; apto ou inapto; e identificação do médico.',
  registro:'Os dados dos exames devem ser registrados em prontuário médico individual, mantido por no mínimo 20 anos após o desligamento. Anualmente o médico elabora o relatório analítico do PCMSO.',
  final:'Este PCMSO deve ser reavaliado quando houver revisão do PGR, mudança de postos, funções ou modos de trabalho, ou por recomendação de autoridade competente.',
  esocial:'Os exames e riscos ocupacionais devem observar a nomenclatura e os leiautes vigentes do eSocial (tabela de procedimentos diagnósticos e eventos de SST).'
 };
 const LTCAT={
  apresentacao:'O presente laudo foi desenvolvido em atendimento à Lei 9.732, de 11/12/1998, e às Normas Regulamentadoras nº 15 e 16, do Ministério do Trabalho e Emprego, que estabelecem os parâmetros e a obrigatoriedade da elaboração por parte de todos os empregadores e instituições que admitam trabalhadores como empregados, com o intuito de fornecer parecer acerca do direito a insalubridade, periculosidade e aposentadoria especial.',
  sumario:['1. Introdução','2. Objetivos específicos','3. Identificação do estabelecimento avaliado','3.1. Definição dos riscos ambientais','4. Técnica empregada','4.1. Análise qualitativa','5. Disposições legais (insalubridade, periculosidade e aposentadoria especial)','6. Constatações durante a visita técnica (GHE)','7. Resumo do parecer técnico','8. Responsabilidade técnica','Anexo — eSocial agentes nocivos'],
  intro:'A Lei 9.732/1998 instituiu critérios de verificação das condições do ambiente de trabalho para concessão de aposentadoria especial, mediante LTCAT. A empresa que não mantiver o laudo atualizado ou emitir comprovação em desacordo com o laudo sujeita-se às penalidades legais (Decreto 3.048/99).',
  objetivos:'Objetivos específicos: garantir a saúde e a integridade dos trabalhadores; avaliar atividades e locais frente às NR-15 e NR-16 e anexos; definir funções com direito a adicional de insalubridade ou periculosidade; fundamentar o PPP.',
  ambientais:'Consideram-se riscos ambientais os agentes físicos, químicos e biológicos que, em função da natureza, concentração ou intensidade e tempo de exposição, sejam capazes de causar danos à saúde.',
  tecnica:'A técnica segue a NR-15, a NR-16, a IN INSS/PRES nº 77/2015 e as NHO da FUNDACENTRO. Neste laudo a análise dos agentes é qualitativa, com base no inventário do PGR. Medições quantitativas, quando existirem, devem ser anexadas.',
  final:'Este LTCAT deve ser atualizado quando houver mudança de processo, ambiente, função, controles ou resultados quantitativos. Não substitui o PGR nem o PCMSO.'
 };
 const NR1={
  apresentacao:'O presente diagnóstico foi desenvolvido em atendimento à Norma Regulamentadora nº 01, do Ministério do Trabalho e Emprego, quanto à identificação, avaliação e informação dos riscos psicossociais relacionados ao trabalho. Os resultados subsidiam o Gerenciamento de Riscos Ocupacionais (GRO) e integram o Programa de Gerenciamento de Riscos (PGR) da organização.',
  sumario:['1. Identificação da organização','2. Objetivo e fundamento legal','3. Metodologia do DRPS','4. Resultado coletivo por tópico','5. Fontes geradoras e agravos','6. Medidas organizacionais e integração com o PGR','7. Responsabilidade técnica'],
  objetivo:'A NR-1 exige que os riscos psicossociais relacionados ao trabalho sejam identificados, avaliados e informados no PGR. Este documento registra o Diagnóstico de Riscos Psicossociais (DRPS) de forma coletiva e confidencial, sem identificação nominal dos trabalhadores.',
  metodo:'O instrumento contém 50 questões distribuídas em 13 tópicos, com escala de 1 (Nunca) a 5 (Sempre). Parte das questões é de lógica invertida. A gravidade por tópico usa a média arredondada: ≥ 4 Alta; = 3 Média; ≤ 2 Baixa. A participação é confidencial e voluntária, por link exclusivo do condomínio.',
  medidas:'Os tópicos em gravidade alta devem ser tratados no plano de ação do PGR, com medidas organizacionais e relacionais — canal de denúncia, suporte da liderança, clareza de papel, dimensionamento de equipe, comunicação e reconhecimento. Reaplicar o DRPS após as intervenções ou quando houver mudança relevante na organização do trabalho.',
  confidencial:'As respostas individuais não constam deste documento. Informa-se apenas o resultado coletivo, por tópico, disponível aos trabalhadores interessados, aos seus representantes e à Inspeção do Trabalho, nos termos da NR-1.',
  final:'Este diagnóstico permanece vinculado ao cadastro e às respostas coletadas no sistema. Deve ser atualizado sempre que o DRPS for reaplicado ou quando o PGR for revisado.'
 };
 return {mesAno,mesAnoCapa,dataExtenso,te,teNome,pd,pdNome,gr,grNome,grupoLetra,groups,PGR,PCMSO,LTCAT,NR1};
})();
