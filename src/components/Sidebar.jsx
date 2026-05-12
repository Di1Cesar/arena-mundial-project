import { Trophy, LayoutDashboard, CalendarDays, Shield } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png' // Altere para .svg ou .jpg se necessário

const items = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Classificação', path: '/classificacao', icon: Trophy },
  { label: 'Partidas', path: '/partidas', icon: CalendarDays },
  { label: 'Times', path: '/times', icon: Shield },
]

export default function Sidebar() {
  return (
    <aside className="w-[240px] fixed inset-y-0 left-0 bg-surface border-r border-border p-5">
      <div className="mb-8 flex flex-col gap-4">
        <img src={logo} alt="Logo Arena Mundial" className="w-16 h-auto object-contain" />
        <div>
          <h1 className="font-display text-5xl text-gold tracking-[0.2em] leading-none">ARENA</h1>
          <h2 className="font-display text-5xl tracking-[0.2em] leading-none">MUNDIAL</h2>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all border ${
                  isActive
                    ? 'bg-gold/10 border-gold text-gold'
                    : 'border-transparent hover:border-border text-zinc-400'
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}