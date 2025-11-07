
'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { loadEquipments } from '@/lib/csv';

type Row = { id?:number; assetTag:string; name:string; brand?:string; model?:string; serial?:string; status?:string; location?:string };

const MOCK: Row[] = [
  {assetTag:'BED-001', name:'Cama hospitalaria eléctrica', brand:'STRYKER', model:'SV3', serial:'151215739 (3005)', status:'Remanufacturado'},
  {assetTag:'BED-002', name:'Cama hospitalaria eléctrica', brand:'STRYKER', model:'SV3', serial:'170215725 (3005)', status:'Remanufacturado'},
];

export default function Equipos(){
  const [q,setQ]=useState(''); const [rows,setRows]=useState<Row[]>(MOCK);
  useEffect(()=>{ const eq=loadEquipments(); if(eq && eq.length){ setRows(eq.map(e=>({assetTag:e.assetTag,name:e.name,brand:e.brand,model:e.model,serial:'',status:e.status,location:e.location})) ); } },[]);
  const filtered = useMemo(()=> rows.filter(r => (r.assetTag+r.name+(r.brand||'')+(r.model||'')+(r.serial||'')+(r.location||'')).toLowerCase().includes(q.toLowerCase())), [rows,q]);
  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold text-center'>Búsqueda en Inventario</h1>
      <div className='flex gap-3 justify-center'>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder='Buscar...' className='rounded-xl border border-[#163253] bg-[#0b1c33] px-4 py-3 min-w-[320px]' />
        <button className='btn'>Buscar</button>
      </div>
      <div className='flex gap-3 justify-center'>
        <Link href='/equipos/nuevo' className='btn'>Añadir Equipo</Link>
        <Link href='/insumos' className='btn'>Búsqueda de Insumo</Link>
        <Link href='/login' className='btn bg-red-700 border-red-600'>Cerrar Sesión</Link>
      </div>
      <div className='card'>
        <table className='table w-full'>
          <thead><tr><th>Imagen</th><th>Nombre del Equipo</th><th>Marca</th><th>Modelo</th><th>Número de Serie</th><th>Estado</th><th>Fecha de Salida</th><th>Formato</th><th>Acción</th></tr></thead>
          <tbody>
            {filtered.map((r,i)=>(
              <tr key={i}><td className='text-slate-400'>—</td><td>{r.name}</td><td>{r.brand}</td><td>{r.model}</td><td>{r.serial}</td><td>{r.status}</td><td>—</td>
                <td className='space-x-2'><button className='badge'>Formatos</button><button className='badge'>QR</button></td>
                <td className='space-x-2'><a className='underline'>Editar</a> | <a className='underline'>Eliminar</a> | <a className='underline'>Inhabilitar</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
