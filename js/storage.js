
const V8Storage=(()=>{
 const KEY='ff_sst_v8_projects';
 const ATIVO='ff_sst_v8_ativo';
 const REPORTS='ff_sst_v7_reports';
 const DRPS='ff_sst_v8_drps';
 function list(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
 function save(p,opts){
  p.agenda=Array.isArray(p.agenda)?p.agenda:[];
  if(!p.drpsToken) p.drpsToken='d'+p.id+Math.random().toString(36).slice(2,8);
  const a=list(),i=a.findIndex(x=>x.id===p.id);
  if(i>=0)a[i]=p;else a.unshift(p);
  localStorage.setItem(KEY,JSON.stringify(a));
  if(!opts || opts.ativo!==false) setAtivo(p.id);
  return p;
 }
 function get(id){return list().find(x=>x.id===id)}
 function remove(id){
  localStorage.setItem(KEY,JSON.stringify(list().filter(x=>x.id!==id)));
  if(ativoId()===id){
   const next=list()[0];
   if(next) setAtivo(next.id); else localStorage.removeItem(ATIVO);
  }
 }
 function ativoId(){return localStorage.getItem(ATIVO)||''}
 function setAtivo(id){if(id) localStorage.setItem(ATIVO,id); else localStorage.removeItem(ATIVO)}
 function ativo(){const id=ativoId(); return (id&&get(id))||list()[0]||null}
 function blank(){return {id:Date.now().toString(),empresa:{},setores:[],funcoes:[],ghe:[],riscos:[],agenda:[],salvoEm:''}}
 function inspections(condoId){
  try{
   const all=JSON.parse(localStorage.getItem(REPORTS)||'[]');
   if(!condoId) return all;
   const nome=String(get(condoId)?.empresa?.razaoSocial||'').trim().toLowerCase();
   return all.filter(r=>r.condominioId===condoId || (!r.condominioId && nome && String(r.condominio||'').trim().toLowerCase()===nome));
  }catch(e){return[]}
 }
 function ensureDrpsToken(p){
  if(!p.drpsToken){ p.drpsToken='d'+p.id+Math.random().toString(36).slice(2,8); }
  return p.drpsToken;
 }
 function byDrpsToken(token){ return list().find(p=>p.drpsToken===token) }
 function drpsList(condoId){
  try{
   const all=JSON.parse(localStorage.getItem(DRPS)||'[]');
   if(!condoId) return all;
   const tok=get(condoId)?.drpsToken;
   return all.filter(r=>r.condominioId===condoId || (tok && r.token===tok));
  }catch(e){return[]}
 }
 function saveDrps(rec){
  const all=drpsList();
  all.unshift(rec);
  localStorage.setItem(DRPS,JSON.stringify(all));
  return rec;
 }
 const EQUIPE='ff_sst_v8_equipe';
 function equipeList(){try{return JSON.parse(localStorage.getItem(EQUIPE)||'[]')}catch(e){return[]}}
 function equipeGet(id){return equipeList().find(x=>x.id===id)}
 function equipeByTipo(tipo){return equipeList().filter(x=>x.tipo===tipo)}
 function saveEquipe(p){
  const a=equipeList();
  if(!p.id) p.id='eq_'+Date.now();
  const i=a.findIndex(x=>x.id===p.id);
  if(i>=0)a[i]=p;else a.unshift(p);
  localStorage.setItem(EQUIPE,JSON.stringify(a));
  return p;
 }
 function removeEquipe(id){
  localStorage.setItem(EQUIPE,JSON.stringify(equipeList().filter(x=>x.id!==id)));
 }
 return{list,save,get,remove,ativoId,setAtivo,ativo,blank,inspections,ensureDrpsToken,byDrpsToken,drpsList,saveDrps,equipeList,equipeGet,equipeByTipo,saveEquipe,removeEquipe}
})();
