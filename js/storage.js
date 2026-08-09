
const V8Storage=(()=>{
 const KEY='ff_sst_v8_projects';
 function list(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
 function save(p){const a=list(),i=a.findIndex(x=>x.id===p.id);if(i>=0)a[i]=p;else a.unshift(p);localStorage.setItem(KEY,JSON.stringify(a));return p}
 function get(id){return list().find(x=>x.id===id)}
 function remove(id){localStorage.setItem(KEY,JSON.stringify(list().filter(x=>x.id!==id)))}
 return{list,save,get,remove}
})();
