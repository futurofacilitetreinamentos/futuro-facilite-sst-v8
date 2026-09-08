
const FFStorage = (() => {
  const KEY='ff_sst_v7_reports';
  const SEQ='ff_sst_v7_seq';
  function list(){ try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []} }
  function save(report){
    const all=list(), ix=all.findIndex(x=>x.id===report.id);
    if(ix>=0) all[ix]=report; else all.unshift(report);
    localStorage.setItem(KEY,JSON.stringify(all));
    return report;
  }
  function remove(id){ localStorage.setItem(KEY,JSON.stringify(list().filter(x=>x.id!==id))); }
  function get(id){ return list().find(x=>x.id===id); }
  function nextNumber(){
    const year=new Date().getFullYear();
    let s=parseInt(localStorage.getItem(SEQ)||'0',10)+1;
    localStorage.setItem(SEQ,String(s));
    return `SST-${year}-${String(s).padStart(4,'0')}`;
  }
  return {list,save,remove,get,nextNumber};
})();
