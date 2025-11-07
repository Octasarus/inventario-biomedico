import "../styles/globals.css";import Link from "next/link";
export default function RootLayout({children}:{children:React.ReactNode}){
  return(<html lang="es"><body className="min-h-screen grid md:grid-cols-[240px_1fr]">
  <aside className="hidden md:block border-r border-[#1f2937] bg-[#0f172a]/70 backdrop-blur">
    <div className="p-4 border-b border-[#1f2937] flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl" style={{background:'linear-gradient(135deg,#2563eb,#22d3ee)'}}/>
      <div><div className="font-bold">Inventario Biomédico</div><div className="text-xs text-slate-400">Vista profesional</div></div>
    </div>
    <nav className="p-2 text-slate-300">
      <NavItem href="/dashboard" label="Panel"/><NavItem href="/equipos" label="Equipos"/>
      <NavItem href="/insumos" label="Insumos"/><NavItem href="/mantenimientos" label="Mantenimientos"/>
      <NavItem href="/usuarios" label="Usuarios"/><NavItem href="/importar" label="Importar CSV"/>
    </nav></aside><main className="p-5">{children}</main></body></html>);}
function NavItem({href,label}:{href:string,label:string}){return <Link href={href} className="block px-3 py-2 rounded-lg hover:bg-[#0b1c33]">{label}</Link>}
