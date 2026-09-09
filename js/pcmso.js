
const PCMSOData=(()=>{
 const BASE={exame:'Avaliação clínica ocupacional',esocial:'0295',tipos:'A / P / R / M / D',periodo:'Anual',motivo:'NR-7 — avaliação clínica de todos os trabalhadores'};
 const HEMO={exame:'Hemograma completo',esocial:'0693',tipos:'A / P / D',periodo:'Anual',motivo:'Exame complementar de base (eSocial tabela 27)'};
 function addUnique(arr,item){
  if(!arr.some(x=>x.exame===item.exame)) arr.push(item);
 }
 function extras(r,funcao){
  const g=String(r.grupo||'').toLowerCase();
  const p=(String(r.perigo||'')+' '+String(r.dano||'')+' '+String(r.fonte||'')).toLowerCase();
  const f=String(funcao||r.funcao||r.ghe||'').toLowerCase();
  const list=[];
  if(/ru[ií]do|auditiv|barulho/.test(p+f) || /porteiro|vigilante/.test(f))
   list.push({exame:'Audiometria tonal',esocial:'0281',tipos:'A / P / D',periodo:'Anual',motivo:r.perigo||'Exposição a ruído / comunicação no trabalho'});
  if(/poeira|fumos|vapor|químico|cloro|limpeza|solvente|gás|produto qu[ií]m/.test(p) || g.includes('quím'))
   list.push({exame:'Espirometria',esocial:'0523',tipos:'A / P / D',periodo:'Anual',motivo:r.perigo||'Risco químico / respiratório'});
  if(/biol|esgoto|lixo|res[ií]duo|secre|limpeza|jardin|fossa/.test(p+f) || g.includes('biol'))
   list.push({exame:'Avaliação de risco biológico e atualização vacinal',esocial:'',tipos:'A / P',periodo:'Anual',motivo:r.perigo||'Risco biológico'});
  if(/ergo|postura|levan|lomb|repetitiv|sobrecarga|peso/.test(p) || g.includes('ergo'))
   list.push({exame:'Avaliação osteomuscular',esocial:'',tipos:'A / P / R',periodo:'Anual',motivo:r.perigo||'Risco ergonômico'});
  if(/vis[aã]o|altura|elétr|motorista|porteiro|vigilante|queda/.test(p+f) || g.includes('acidente'))
   list.push({exame:'Acuidade visual',esocial:'0105',tipos:'A / P',periodo:'Anual',motivo:r.perigo||'Função de vigilância / risco de acidente'});
  if(/psico|ass[eé]dio|estresse|mental|burnout/.test(p) || g.includes('psico'))
   list.push({exame:'Avaliação de saúde mental relacionada ao trabalho',esocial:'',tipos:'A / P / R',periodo:'Anual',motivo:r.perigo||'Risco psicossocial'});
  if(/calor|t[ée]rmic/.test(p))
   list.push({exame:'Avaliação clínica para sobrecarga térmica',esocial:'',tipos:'A / P',periodo:'Anual',motivo:r.perigo||'Exposição ao calor'});
  return list;
 }
 function linkedRiscos(riscos,nome){
  return (riscos||[]).filter(r=>{
   const rf=String(r.funcao||'').trim();
   const rg=String(r.ghe||'').trim();
   if(!rf && !rg) return true;
   const n=String(nome||'').toLowerCase();
   return rf===nome || rg===nome || rf.toLowerCase()===n || rg.toLowerCase().includes(n);
  });
 }
 function plan(p){
  const funcoes=p.funcoes||[];
  const riscos=p.riscos||[];
  let names=funcoes.map(f=>f.nome).filter(Boolean);
  if(!names.length) names=[...new Set(riscos.map(r=>r.funcao||r.ghe).filter(Boolean))];
  if(!names.length) names=['Trabalhadores do condomínio'];
  const byFunc=names.map(nome=>{
   const f=funcoes.find(x=>x.nome===nome)||{nome,quantidade:'',setor:'',atividades:''};
   const linked=linkedRiscos(riscos,nome);
   const exames=[{...BASE},{...HEMO}];
   linked.forEach(r=>extras(r,nome).forEach(e=>addUnique(exames,e)));
   return {funcao:f.nome,setor:f.setor||'',qtd:f.quantidade||'',atividades:f.atividades||'',riscos:linked,exames};
  });
  return {
   medico:{nome:p.empresa?.medicoTrabalho||'',crm:p.empresa?.crmMedico||''},
   byFunc,
   riscos,
   nExames:byFunc.reduce((a,f)=>a+f.exames.length,0),
   nFuncoes:byFunc.length
  };
 }
 return {plan,BASE};
})();
