
'use client';
import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { loadEquipments, loadSupplies } from '@/lib/csv';

type Row = { tenant?:string; assetTag:string; name:string; brand?:string; loc?:string; location?:string; status?:string; nextServiceAt?:string; next?:string };

const MOCK: Row[] = [
  {assetTag:'ECG-001', name:'Electrocardiógrafo', brand:'GE MAC2000', loc:'Cardiología', status:'OPERATIONAL', nextServiceAt:'2025-12-12', tenant:'pedi'},
  {assetTag:'VENT-002', name:'Ventilador', brand:'Dräger V500', loc:'UCI', status:'MAINTENANCE', nextServiceAt:'2025-11-25', tenant:'pedi'},
  {assetTag:'MON-010', name:'Monitor multiparámetro', brand:'Mindray', loc:'Pediatría', status:'OPERATIONAL', nextServiceAt:'2025-12-03', tenant:'pedi'},
];

const SUP_MOCK = [{name:'Sensor SpO2 pediátrico', qty:5}, {name:'Gel ECG', qty:8}];

export default function Dashboard(){
  const [tenant,setTenant]=useState<string>('_all');
  const [q,setQ]=useState('');
  const [rows,setRows]=useState<Row[]>(MOCK);
  const [sup,setSup]=useState<{name:string;qty:number}[]>(SUP_MOCK);

  useEffect(()=>{
    const eq = loadEquipments();
    if(eq && eq.length){ setRows(eq.map(e=>({ assetTag:e.assetTag, name:e.name, brand:e.brand, loc:e.location, status:e.status, nextServiceAt:e.nextServiceAt, tenant:e.tenant }))); }
    const sp = loadSupplies();
    if(sp && sp.length){ setSup(sp.map(s=>({ name:s.name, qty: Number(s.quantity||0) }))); }
  },[]);

  const filtered = useMemo(()=> rows
    .filter(r=> tenant==='_all' || (r.tenant||'')===tenant)
    .filter(r=> (r.assetTag+r.name+(r.brand||'')+(r.loc||'')).toLowerCase().includes(q.toLowerCase()))
  ,[rows,tenant,q]);

  const soon = filtered.filter(r=>{
    const s = r.nextServiceAt || r.next;
    if(!s) return false; const d=new Date(s); const diff=(+d-+new Date())/86400000;
    return diff>=0 && diff<=30;
  }).length;

  return (
    <div className='space-y-5'>
      <div className='flex flex-wrap gap-3 items-center'>
        <select value={tenant} onChange={e=>setTenant(e.target.value)} className='rounded-lg border border-[#163253] bg-[#0b1c33] px-3 py-2'>
          <option value='_all'>Todos</option><option value='pedi'>Pediátrico</option><option value='gine'>Ginecología</option>
        </select>
        <input placeholder='Buscar equipo/ubicación...' value={q} onChange={e=>setQ(e.target.value)} className='rounded-lg border border-[#163253] bg-[#0b1c33] px-3 py-2 min-w-[260px]' />
      </div>

      <div className='grid md:grid-cols-3 gap-4'>
        <div className='card'><div className='text-xs text-slate-400'>Equipos totales</div><div className='text-3xl font-extrabold'>{filtered.length}</div></div>
        <div className='card'><div className='text-xs text-slate-400'>Insumos bajo stock</div><div className='text-3xl font-extrabold text-red-300'>{sup.filter(x=>x.qty<10).length}</div></div>
        <div className='card'><div className='text-xs text-slate-400'>Mantenimientos próximos (30 días)</div><div className='text-3xl font-extrabold text-amber-300'>{soon}</div></div>
      </div>

      <div className='grid md:grid-cols-3 gap-4'>
        <div className='md:col-span-2 card'>
          <h2 className='text-lg font-semibold mb-2'>Equipos</h2>
          <div className='overflow-auto'>
            <table className='table w-full'>
              <thead><tr><th>Activo</th><th>Equipo</th><th>Marca/Modelo</th><th>Ubicación</th><th>Estado</th><th>Próx. serv.</th></tr></thead>
              <tbody>
                {filtered.map((r,i)=>(
                  <tr key={i}>
                    <td>{r.assetTag}</td><td>{r.name}</td><td>{r.brand}</td><td>{r.loc}</td>
                    <td>{r.status}</td><td>{r.nextServiceAt? new Date(r.nextServiceAt).toLocaleDateString():''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className='card'>
          <h2 className='text-lg font-semibold mb-2'>Bajo stock</h2>
          <ResponsiveContainer width='100%' height={240}>
            <BarChart data={sup}><XAxis dataKey='name' hide /><YAxis /><Tooltip /><Bar dataKey='qty' /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
