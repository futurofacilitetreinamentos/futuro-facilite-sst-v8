
const V8Storage=(()=>{
 const KEY='ff_sst_v8_projects';
 const ATIVO='ff_sst_v8_ativo';
 const REPORTS='ff_sst_v7_reports';
 function list(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
 function save(p){
  p.agenda=Array.isArray(p.agenda)?p.agenda:[];
  const a=list(),i=a.findIndex(x=>x.id===p.id);
  if(i>=0)a[i]=p;else a.unshift(p);
  localStorage.setItem(KEY,JSON.stringify(a));
  setAtivo(p.id);
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
 return{list,save,get,remove,ativoId,setAtivo,ativo,blank,inspections}
})();
