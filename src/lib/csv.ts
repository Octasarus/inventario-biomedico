
export type Equipment = { tenant?:string; assetTag:string; name:string; brand?:string; model?:string; location?:string; status?:string; lastServiceAt?:string; serviceEveryDays?:string; nextServiceAt?:string; notes?:string };
export type Supply = { tenant?:string; code:string; name:string; unit?:string; quantity?:string; reorderPoint?:string; expiresAt?:string; notes?:string };

export const KEYS = { eq:'equiposData', sup:'insumosData' } as const;

export function parseCSV(text:string): Record<string,string>[]{
  const rows: string[][] = []; let row:string[] = []; let cur = ""; let i=0; let inQ=false;
  while(i<text.length){ const c=text[i];
    if(inQ){ if(c==='"'){ if(text[i+1]==='"'){cur+='"'; i++;} else {inQ=false;} } else {cur+=c;} }
    else { if(c==='"'){inQ=true;} else if(c===','){row.push(cur);cur='';} else if(c==='\n'||c==='\r'){ if(cur!==''||row.length>0){row.push(cur);rows.push(row);row=[];cur='';} if(c==='\r' && text[i+1]==='\n') i++; } else {cur+=c;} }
    i++;
  }
  if(cur!==''||row.length>0){row.push(cur);rows.push(row);}
  if(rows.length===0) return [];
  const headers = rows[0].map(h=>h.trim());
  return rows.slice(1).filter(r=>r.length>1 || (r[0] && r[0].trim()!=='')).map(r=>{
    const o:Record<string,string>={}; headers.forEach((h,idx)=>o[h]=(r[idx]||'').trim()); return o;
  });
}

export function saveEquipments(items:Equipment[]){ if(typeof window==='undefined') return; localStorage.setItem(KEYS.eq, JSON.stringify(items)); }
export function saveSupplies(items:Supply[]){ if(typeof window==='undefined') return; localStorage.setItem(KEYS.sup, JSON.stringify(items)); }
export function loadEquipments():Equipment[]{ if(typeof window==='undefined') return []; try{ const s=localStorage.getItem(KEYS.eq); return s? JSON.parse(s):[] }catch{return []} }
export function loadSupplies():Supply[]{ if(typeof window==='undefined') return []; try{ const s=localStorage.getItem(KEYS.sup); return s? JSON.parse(s):[] }catch{return []} }
