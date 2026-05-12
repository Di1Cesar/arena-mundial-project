import { useState, useEffect } from 'react'

const stats = [
  { title: 'Gols Marcados', value: '28' },
  { title: 'Partidas Hoje', value: '6' },
  { title: 'Seleções', value: '32' },
]

export default function Dashboard() {
  const [liveMatch, setLiveMatch] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/football-data/v4/competitions/2000/matches', {
          headers: { 'X-Auth-Token': '957dfdf42c2147f7b475dcd4a4dcc400' }
        })
        if (!response.ok) throw new Error('Erro na API')
        const data = await response.json()
        const matches = data.matches || []

        // Lógica de Prioridade: Ao Vivo > Último Encerrado > Próximo Agendado
        const inPlay = matches.find(m => m.status === 'IN_PLAY' || m.status === 'PAUSED')
        const finished = [...matches].reverse().find(m => m.status === 'FINISHED')
        const scheduled = matches.find(m => m.status === 'SCHEDULED' || m.status === 'TIMED')

        setLiveMatch(inPlay || finished || scheduled || null)
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

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

        <div className="bg-black rounded-xl p-6 flex justify-between items-center min-h-[120px]">
          {loading ? (
            <p className="text-zinc-500 w-full text-center">Buscando dados da partida ao vivo...</p>
          ) : liveMatch ? (
            <>
              <div>
                <p className="text-zinc-500 text-sm uppercase">
                  {liveMatch.competition?.name || 'COPA DO MUNDO'} {new Date(liveMatch.utcDate).getFullYear()}
                </p>
                <div className="font-display text-5xl flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-3">
                    {liveMatch.homeTeam?.crest && <img src={liveMatch.homeTeam.crest} alt="Home" className="w-10 h-10 object-contain drop-shadow-md" />}
                    <span>{liveMatch.homeTeam?.tla || liveMatch.homeTeam?.name?.substring(0, 3).toUpperCase() || 'TBD'}</span>
                  </div>
                  <span className="text-gold">
                    {liveMatch.score?.fullTime?.home ?? '-'} <span className="text-zinc-500 text-3xl">x</span> {liveMatch.score?.fullTime?.away ?? '-'}
                  </span>
                  <div className="flex items-center gap-3">
                    <span>{liveMatch.awayTeam?.tla || liveMatch.awayTeam?.name?.substring(0, 3).toUpperCase() || 'TBD'}</span>
                    {liveMatch.awayTeam?.crest && <img src={liveMatch.awayTeam.crest} alt="Away" className="w-10 h-10 object-contain drop-shadow-md" />}
                  </div>
                </div>
              </div>

              <div className={`px-4 py-2 rounded-lg font-bold text-sm tracking-wider ${
                ['IN_PLAY', 'PAUSED'].includes(liveMatch.status) ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-surface text-zinc-400'
              }`}>
                {['IN_PLAY', 'PAUSED'].includes(liveMatch.status) ? '🔴 AO VIVO' : liveMatch.status === 'FINISHED' ? 'ENCERRADO' : 'AGENDADO'}
              </div>
            </>
          ) : (
            <p className="text-zinc-500 w-full text-center">Nenhuma partida encontrada.</p>
          )}
        </div>
      </div>
    </div>
  )
}