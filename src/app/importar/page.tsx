
'use client';
import { parseCSV, saveEquipments, saveSupplies, Equipment, Supply } from '@/lib/csv';
import Link from 'next/link';
import { useState } from 'react';

export default function Importar(){
  const [eqCount,setEq]=useState(0); const [spCount,setSp]=useState(0);
  async function onUpload(kind:'eq'|'sup', file?:File|null){
    if(!file) return;
    const text = await file.text();
    const rows = parseCSV(text);
    if(kind==='eq'){
      const mapped:Equipment[] = rows.map(r=>({ tenant:r['tenant'], assetTag:r['assetTag'], name:r['name'], brand:r['brand'], model:r['model'], location:r['location'], status:r['status'], lastServiceAt:r['lastServiceAt'], serviceEveryDays:r['serviceEveryDays'], nextServiceAt:r['nextServiceAt'], notes:r['notes'] }));
      saveEquipments(mapped); setEq(mapped.length);
    }else{
      const mapped:Supply[] = rows.map(r=>({ tenant:r['tenant'], code:r['code'], name:r['name'], unit:r['unit'], quantity:r['quantity'], reorderPoint:r['reorderPoint'], expiresAt:r['expiresAt'], notes:r['notes'] }));
      saveSupplies(mapped); setSp(mapped.length);
    }
  }

  return (
    <div className='space-y-4 max-w-3xl'>
      <h1 className='text-2xl font-bold'>Importar CSV</h1>
      <div className='card grid gap-3'>
        <div><b>Equipos</b> — columnas: tenant?, assetTag, name, brand, model, location, status, lastServiceAt, serviceEveryDays, nextServiceAt, notes</div>
        <input type='file' accept='.csv' onChange={e=>onUpload('eq', e.target.files?.[0])}/>
        <div className='text-slate-300'>Cargados: <span className='badge'>{eqCount}</span></div>
      </div>
      <div className='card grid gap-3'>
        <div><b>Insumos</b> — columnas: tenant?, code, name, unit, quantity, reorderPoint, expiresAt, notes</div>
        <input type='file' accept='.csv' onChange={e=>onUpload('sup', e.target.files?.[0])}/>
        <div className='text-slate-300'>Cargados: <span className='badge'>{spCount}</span></div>
      </div>
      <div className='flex gap-3'>
        <Link href='/dashboard' className='btn'>Ver Dashboard</Link>
        <Link href='/equipos' className='btn'>Ver Equipos</Link>
      </div>
      <p className='text-slate-400 text-sm'>Los datos se guardan en tu navegador (localStorage). No se suben a ningún servidor.</p>
    </div>
  )
}
