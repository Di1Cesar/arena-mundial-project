const stats = [
  { title: 'Gols Marcados', value: '28' },
  { title: 'Partidas Hoje', value: '6' },
  { title: 'Seleções', value: '32' },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-6xl tracking-[0.2em] text-gold">DASHBOARD</h1>
        <p className="text-zinc-400">Central de controle da Arena Mundial</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {stats.map((item) => (
          <div key={item.title} className="bg-card border border-border rounded-2xl p-6">
            <p className="text-zinc-400 text-sm uppercase">{item.title}</p>
            <h2 className="font-display text-6xl text-gold">{item.value}</h2>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-display text-3xl tracking-widest mb-4">Overlay Live</h3>

        <div className="bg-black rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-zinc-500 text-sm">COPA DO MUNDO 2026</p>
            <h2 className="font-display text-5xl">
              🇧🇷 BRA <span className="text-gold">2 x 1</span> ARG 🇦🇷
            </h2>
          </div>

          <div className="bg-red text-white px-4 py-2 rounded-lg font-bold">
            🔴 AO VIVO
          </div>
        </div>
      </div>
    </div>
  )
}