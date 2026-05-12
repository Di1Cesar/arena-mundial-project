import { useState, useEffect } from 'react'
import { X, Calendar, MapPin, Trophy } from 'lucide-react'

const statusMap = {
  'SCHEDULED': 'Agendado',
  'TIMED': 'Agendado',
  'IN_PLAY': 'Ao Vivo',
  'PAUSED': 'Intervalo',
  'FINISHED': 'Encerrado',
  'SUSPENDED': 'Suspenso',
  'POSTPONED': 'Adiado',
  'CANCELLED': 'Cancelado'
}

const stageMap = {
  'FINAL': 'Final',
  'THIRD_PLACE': 'Disputa de 3º Lugar',
  'SEMI_FINALS': 'Semifinal',
  'QUARTER_FINALS': 'Quartas de Final',
  'LAST_16': 'Oitavas de Final',
  'LAST_32': 'Dezesseis-avos de Final',
  'GROUP_STAGE': 'Fase de Grupos'
}

const formatDate = (utcDate) => {
  const date = new Date(utcDate)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date)
}

export default function Partidas() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedMatch, setSelectedMatch] = useState(null)

  const fetchMatches = async () => {
    setLoading(true)
    setError(null)
    try {
      // ID 2000 é a FIFA World Cup na Football-Data API
      const response = await fetch('/api/football-data/v4/competitions/2000/matches', {
        headers: {
          'X-Auth-Token': '957dfdf42c2147f7b475dcd4a4dcc400'
        }
      })
      if (!response.ok) throw new Error('Erro ao buscar as partidas. Verifique a API.')
      
      const data = await response.json()
      setMatches(data.matches || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  return (
    <div className="pb-8">
      <h1 className="font-display text-6xl tracking-[0.2em] text-gold mb-6">
        PARTIDAS
      </h1>

      {loading ? (
        <div className="bg-card border border-border rounded-2xl p-12 flex items-center justify-center text-zinc-400">
          Carregando partidas da Copa do Mundo...
        </div>
      ) : error ? (
        <div className="bg-card border border-border rounded-2xl p-12 flex items-center justify-center text-red-500">
          {error}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {matches.map((match) => {
            const homeTeam = match.homeTeam?.name || 'A Definir'
            const awayTeam = match.awayTeam?.name || 'A Definir'
            const homeScore = match.score?.fullTime?.home ?? '-'
            const awayScore = match.score?.fullTime?.away ?? '-'
            const status = statusMap[match.status] || match.status
            const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED'

            return (
              <div 
                key={match.id} 
                onClick={() => setSelectedMatch(match)}
                className="bg-card border border-border hover:border-gold transition-colors cursor-pointer rounded-2xl p-5 flex flex-col justify-center"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">{stageMap[match.stage] || match.stage}</span>
                  <span className={`text-xs px-2 py-1 rounded-md font-bold ${isLive ? 'bg-red-500/20 text-red-500' : 'bg-surface text-zinc-400'}`}>
                    {isLive ? '🔴 ' : ''}{status}
                  </span>
                </div>

                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-3 flex-1">
                    {match.homeTeam?.crest ? <img src={match.homeTeam.crest} alt={homeTeam} className="w-8 h-8 object-contain" /> : <div className="w-8 h-8 rounded-full bg-surface border border-border" />}
                    <span className="font-display text-2xl truncate" title={homeTeam}>{homeTeam}</span>
                  </div>

                  <div className="flex items-center justify-center px-4 font-display text-3xl text-gold">
                    {homeScore} <span className="text-zinc-500 mx-2 text-xl">X</span> {awayScore}
                  </div>

                  <div className="flex items-center justify-end gap-3 flex-1 text-right">
                    <span className="font-display text-2xl truncate" title={awayTeam}>{awayTeam}</span>
                    {match.awayTeam?.crest ? <img src={match.awayTeam.crest} alt={awayTeam} className="w-8 h-8 object-contain" /> : <div className="w-8 h-8 rounded-full bg-surface border border-border" />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de Detalhes da Partida */}
      {selectedMatch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedMatch(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border flex justify-between items-center bg-surface">
              <h3 className="font-display text-2xl text-gold">Detalhes da Partida</h3>
              <button onClick={() => setSelectedMatch(null)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col items-center">
              <div className="flex w-full items-center justify-between mb-8">
                <div className="flex flex-col items-center gap-3 w-1/3 text-center">
                  {selectedMatch.homeTeam?.crest ? <img src={selectedMatch.homeTeam.crest} alt={selectedMatch.homeTeam?.name} className="w-20 h-20 object-contain drop-shadow-lg" /> : <div className="w-20 h-20 rounded-full bg-surface border border-border" />}
                  <span className="font-display text-2xl leading-none">{selectedMatch.homeTeam?.name || 'A Definir'}</span>
                </div>
                
                <div className="flex flex-col items-center justify-center w-1/3">
                  <span className="text-gold font-display text-5xl tracking-widest">{selectedMatch.score?.fullTime?.home ?? '-'} <span className="text-zinc-500 text-3xl">x</span> {selectedMatch.score?.fullTime?.away ?? '-'}</span>
                  <span className="text-zinc-400 text-xs uppercase mt-2">{statusMap[selectedMatch.status] || selectedMatch.status}</span>
                </div>

                <div className="flex flex-col items-center gap-3 w-1/3 text-center">
                  {selectedMatch.awayTeam?.crest ? <img src={selectedMatch.awayTeam.crest} alt={selectedMatch.awayTeam?.name} className="w-20 h-20 object-contain drop-shadow-lg" /> : <div className="w-20 h-20 rounded-full bg-surface border border-border" />}
                  <span className="font-display text-2xl leading-none">{selectedMatch.awayTeam?.name || 'A Definir'}</span>
                </div>
              </div>

              <div className="w-full space-y-3 bg-surface p-4 rounded-xl border border-border">
                <div className="flex items-center gap-3 text-sm text-zinc-300"><Calendar size={16} className="text-gold" /> <span>{formatDate(selectedMatch.utcDate)}</span></div>
                <div className="flex items-center gap-3 text-sm text-zinc-300"><Trophy size={16} className="text-gold" /> <span>{stageMap[selectedMatch.stage] || selectedMatch.stage} {selectedMatch.group ? `- ${selectedMatch.group}` : ''}</span></div>
                {selectedMatch.venue && <div className="flex items-center gap-3 text-sm text-zinc-300"><MapPin size={16} className="text-gold" /> <span>{selectedMatch.venue}</span></div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}