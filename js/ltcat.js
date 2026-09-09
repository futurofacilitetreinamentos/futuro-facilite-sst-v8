
const LTCATData=(()=>{
 function txt(r){return (String(r.grupo||'')+' '+String(r.perigo||'')+' '+String(r.fonte||'')+' '+String(r.dano||'')).toLowerCase()}
 function isAgente(r){
  const g=String(r.grupo||'').toLowerCase();
  const t=txt(r);
  return /f[ií]sico|qu[ií]mico|biol/.test(g) || /ru[ií]do|calor|t[ée]rmic|poeira|vapor|cloro|biol|esgoto|radia/.test(t);
 }
 function metodo(r){
  const t=txt(r);
  if(/ru[ií]do/.test(t)) return 'Qualitativa neste laudo. Quando houver indício de exposição continuada, complementar com dosimetria (NHO-01 / NR-15).';
  if(/calor|t[ée]rmic/.test(t)) return 'Qualitativa neste laudo. Complementar com IBUTG (NHO-06 / NR-15) se a exposição for habitual.';
  if(/qu[ií]mico|poeira|vapor|cloro/.test(t)) return 'Qualitativa neste laudo. Avaliar quantitativamente o agente específico quando a exposição for habitual.';
  if(/biol/.test(t)) return 'Qualitativa, conforme NR-32/NR-1 e natureza da atividade (contato com agentes biológicos).';
  return 'Avaliação qualitativa a partir do inventário de riscos do PGR.';
 }
 function enquadramento(r){
  const t=txt(r);
  if(/ru[ií]do/.test(t)) return 'Ruído (Anexo IV). Enquadramento para aposentadoria especial somente se a exposição habitual e permanente ultrapassar os limites, comprovada por medição.';
  if(/calor|t[ée]rmic/.test(t)) return 'Calor (Anexo IV). Enquadramento previdenciário depende de medição (IBUTG) e habitualidade.';
  if(/qu[ií]mico|poeira|vapor|cloro/.test(t)) return 'Agente químico. Enquadramento no Anexo IV somente se houver exposição habitual ao agente listado, acima dos critérios legais.';
  if(/biol/.test(t)) return 'Agente biológico. Enquadramento previdenciário restrito às hipóteses do Anexo IV, não se confundindo com o controle ocupacional do PGR.';
  return 'Não caracteriza agente nocivo do Anexo IV do Decreto 3.048/99 para aposentadoria especial.';
 }
 function exposicao(r){
  const score=Number(r.prob)*Number(r.sev);
  if(score>=10) return 'Exposição ocupacional relevante no PGR; habitualidade previdenciária não comprovada sem avaliação quantitativa.';
  if(score>=5) return 'Exposição ocupacional moderada; não caracterizada como habitual e permanente para fins previdenciários neste laudo.';
  return 'Exposição ocupacional baixa ou eventual; sem caracterização de agente nocivo para aposentadoria especial.';
 }
 function plan(p){
  const riscos=p.riscos||[];
  const agentes=riscos.filter(isAgente).map(r=>({
   ghe:r.ghe||r.funcao||'-',
   grupo:r.grupo||'-',
   agente:r.perigo||'-',
   fonte:r.fonte||'-',
   dano:r.dano||'-',
   controles:r.controles||'-',
   metodo:metodo(r),
   enquadramento:enquadramento(r),
   exposicao:exposicao(r)
  }));
  const ocupacionais=riscos.filter(r=>!isAgente(r));
  const temMedicao=riscos.some(r=>/medi[cç]|dosi|ibutg|quantit/i.test(String(r.controles||'')+' '+String(r.fonte||'')));
  let conclusao='Com base na avaliação qualitativa do PGR deste condomínio, não se caracteriza exposição habitual e permanente a agentes nocivos do Anexo IV do Decreto 3.048/99 para fins de aposentadoria especial. Os riscos ocupacionais permanecem gerenciados no PGR e no PCMSO.';
  if(agentes.length && !temMedicao)
   conclusao='Foram identificados fatores físicos, químicos ou biológicos no inventário. Este LTCAT registra avaliação qualitativa. Sem medições que comprovem exposição habitual e permanente acima dos limites legais, não há enquadramento para aposentadoria especial. Recomenda-se avaliação quantitativa dos agentes indicados. O controle ocupacional segue no PGR/PCMSO.';
  if(!riscos.length)
   conclusao='Não há inventário de riscos cadastrado. Complete o PGR para fundamentar o LTCAT.';
  return {
   eng:{nome:p.empresa?.engSeguranca||'',crea:p.empresa?.creaEng||''},
   sst:{nome:p.empresa?.respSst||'',reg:p.empresa?.regSst||''},
   agentes,
   ocupacionais,
   conclusao,
   temMedicao
  };
 }
 return {plan,isAgente};
})();
