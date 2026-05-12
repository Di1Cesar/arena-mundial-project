import { useState, useEffect } from 'react'
import Select from 'react-select'
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core'
import { Eye, X, AlertCircle } from 'lucide-react'

const worldCupData = {
    "area": {
        "id": 2267,
        "name": "World",
        "code": "INT",
        "flag": null
    },
    "id": 2000,
    "name": "FIFA World Cup",
    "code": "WC",
    "type": "CUP",
    "emblem": "https://crests.football-data.org/wm26.png",
    "currentSeason": {
        "id": 2398,
        "startDate": "2026-06-11",
        "endDate": "2026-07-19",
        "currentMatchday": 1,
        "winner": null
    }
}

const wcOptions = [{
  value: worldCupData.currentSeason.id,
  label: `Copa ${worldCupData.currentSeason.startDate.split('-')[0]}`
}]

const teamOptions = [
  { value: '764', label: 'Brasil', titles: 5, crest: 'https://crests.football-data.org/764.svg' },
  { value: '759', label: 'Alemanha', titles: 4, crest: 'https://crests.football-data.org/759.svg' },
  { value: '784', label: 'Itália', titles: 4, crest: 'https://crests.football-data.org/784.svg' },
  { value: '762', label: 'Argentina', titles: 3, crest: 'https://crests.football-data.org/762.png' },
  { value: '773', label: 'França', titles: 2, crest: 'https://crests.football-data.org/773.svg' },
  { value: '758', label: 'Uruguai', titles: 2, crest: 'https://crests.football-data.org/758.svg' },
  { value: '770', label: 'Inglaterra', titles: 1, crest: 'https://crests.football-data.org/770.svg' },
  { value: '760', label: 'Espanha', titles: 1, crest: 'https://crests.football-data.org/760.svg' },
  { value: '776', label: 'México', titles: 0, crest: 'https://crests.football-data.org/776.svg' },
  { value: '777', label: 'Estados Unidos', titles: 0, crest: 'https://crests.football-data.org/777.svg' },
  { value: '801', label: 'Canadá', titles: 0, crest: 'https://crests.football-data.org/801.svg' },
  { value: '765', label: 'Portugal', titles: 0, crest: 'https://crests.football-data.org/765.svg' },
  { value: '8614', label: 'Holanda', titles: 0, crest: 'https://crests.football-data.org/8614.svg' },
  { value: '805', label: 'Bélgica', titles: 0, crest: 'https://crests.football-data.org/805.svg' },
  { value: '794', label: 'Croácia', titles: 0, crest: 'https://crests.football-data.org/794.svg' },
  { value: '839', label: 'Japão', titles: 0, crest: 'https://crests.football-data.org/839.svg' },
  { value: '772', label: 'Coreia do Sul', titles: 0, crest: 'https://crests.football-data.org/772.svg' },
  { value: '815', label: 'Marrocos', titles: 0, crest: 'https://crests.football-data.org/815.svg' },
  { value: '828', label: 'Senegal', titles: 0, crest: 'https://crests.football-data.org/828.svg' },
  { value: '804', label: 'Suíça', titles: 0, crest: 'https://crests.football-data.org/804.svg' },
  { value: '819', label: 'Dinamarca', titles: 0, crest: 'https://crests.football-data.org/819.svg' },
  { value: '792', label: 'Suécia', titles: 0, crest: 'https://crests.football-data.org/792.svg' },
  { value: '840', label: 'Colômbia', titles: 0, crest: 'https://crests.football-data.org/840.svg' },
  { value: '837', label: 'Chile', titles: 0, crest: 'https://crests.football-data.org/837.svg' },
  { value: '825', label: 'Equador', titles: 0, crest: 'https://crests.football-data.org/825.svg' },
  { value: '823', label: 'Peru', titles: 0, crest: 'https://crests.football-data.org/823.svg' },
  { value: '808', label: 'Austrália', titles: 0, crest: 'https://crests.football-data.org/808.svg' },
  { value: '821', label: 'Camarões', titles: 0, crest: 'https://crests.football-data.org/821.svg' },
  { value: '799', label: 'Sérvia', titles: 0, crest: 'https://crests.football-data.org/799.svg' },
  { value: '824', label: 'Nigéria', titles: 0, crest: 'https://crests.football-data.org/824.svg' }
].sort((a, b) => b.titles - a.titles || a.label.localeCompare(b.label))

const formationOptions = [
  { value: '4-4-2', label: '4-4-2' },
  { value: '4-3-3', label: '4-3-3' },
  { value: '3-5-2', label: '3-5-2' },
  { value: '4-2-3-1', label: '4-2-3-1' },
  { value: '5-3-2', label: '5-3-2' },
]

const translatePosition = (pos) => {
  const map = {
    'Goalkeeper': 'Goleiro',
    'Centre-Back': 'Zagueiro',
    'Left-Back': 'Lateral Esquerdo',
    'Right-Back': 'Lateral Direito',
    'Defensive Midfield': 'Volante',
    'Central Midfield': 'Meio-campo Central',
    'Attacking Midfield': 'Meia Ofensivo',
    'Left Midfield': 'Meia Esquerda',
    'Right Midfield': 'Meia Direita',
    'Left Winger': 'Ponta Esquerda',
    'Right Winger': 'Ponta Direita',
    'Centre-Forward': 'Centroavante',
    'Striker': 'Atacante',
    'Defence': 'Defesa',
    'Defender': 'Defensor',
    'Midfield': 'Meio-campo',
    'Midfielder': 'Meio-campista',
    'Offence': 'Ataque',
    'Attacker': 'Atacante'
  }
  return map[pos] || pos
}

const getPlayerCategory = (pos) => {
  if (!pos) return 'other'
  const p = pos.toLowerCase()
  if (p.includes('goalkeeper')) return 'gk'
  if (p.includes('back') || p.includes('defen')) return 'df'
  if (p.includes('midfield')) return 'mf'
  if (p.includes('forward') || p.includes('wing') || p.includes('strik') || p.includes('attack') || p.includes('offen')) return 'at'
  return 'other'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const [year, month, day] = dateString.split('-');
  if (!day || !month || !year) return dateString;
  return `${day}/${month}/${year}`;
}

const calculateAge = (dateString) => {
  if (!dateString) return 'N/A';
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return `${age} anos`;
}

const lineNames = { at: 'ATA', mf: 'MEI', df: 'DEF', gk: 'GOL' }

const colorMap = {
  'Red': 'Vermelho', 'Blue': 'Azul', 'Yellow': 'Amarelo', 'Green': 'Verde',
  'White': 'Branco', 'Black': 'Preto', 'Sky Blue': 'Azul Celeste', 'Navy Blue': 'Azul Marinho',
  'Orange': 'Laranja', 'Purple': 'Roxo', 'Grey': 'Cinza', 'Brown': 'Marrom', 'Silver': 'Prata', 'Gold': 'Dourado'
}
const translateColors = (colorsStr) => {
  if (!colorsStr) return 'N/A'
  return colorsStr.split(' / ').map(c => colorMap[c] || c).join(' / ')
}

const getFormationRequirements = (fmt) => {
  switch (fmt) {
    case '4-3-3': return { df: 4, mf: 3, at: 3 }
    case '3-5-2': return { df: 3, mf: 5, at: 2 }
    case '4-2-3-1': return { df: 4, mf: 5, at: 1 }
    case '5-3-2': return { df: 5, mf: 3, at: 2 }
    case '4-4-2':
    default: return { df: 4, mf: 4, at: 2 }
  }
}

const customSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: '#18181b', // bg-surface
    borderColor: '#3f3f46',     // border-border
    color: '#fff',
    borderRadius: '0.75rem',
    boxShadow: 'none',
    '&:hover': { borderColor: '#fACC15' } // text-gold
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#18181b',
    border: '1px solid #3f3f46',
    borderRadius: '0.75rem',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#fACC15' : '#18181b',
    color: state.isFocused ? '#000' : '#fff',
    cursor: 'pointer',
  }),
  singleValue: (base) => ({ ...base, color: '#fff' }),
  indicatorSeparator: () => ({ display: 'none' })
}

function DroppableSlot({ id, line, index, className, style, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { line, index }
  })
  return (
    <div
      ref={setNodeRef}
      className={`${className || ''} transition-all ${
        isOver ? 'ring-2 ring-gold bg-white/10' : ''
      }`}
      style={style}
    >
      {children}
    </div>
  )
}

function DraggablePlayer({ player, sourceData, onViewPlayer, onRemovePlayer }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: player.id.toString(),
    data: { player, sourceData }
  })
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 10,
    opacity: isDragging ? 0.8 : 1,
  } : { zIndex: 10 }

  const nameParts = player.name.split(' ')
  const displayName = nameParts[nameParts.length - 1]

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="flex flex-col items-center group cursor-grab active:cursor-grabbing w-14 md:w-16 relative">
      <div className="absolute -top-8 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onViewPlayer(player)}
          className="bg-gold text-black w-7 h-7 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-transform"
          title="Ver detalhes"
        >
          <Eye size={14} />
        </button>
        {onRemovePlayer && (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onRemovePlayer(player)}
            className="bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-transform"
            title="Remover"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="w-8 h-8 md:w-10 md:h-10 bg-surface border-2 border-gold rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-white shadow-lg group-hover:bg-gold group-hover:text-black transition-colors overflow-hidden">
        {player.picture || player.photo || player.image ? (
          <img src={player.picture || player.photo || player.image} alt={displayName} className="w-full h-full object-cover" draggable={false} />
        ) : (
          player.shirtNumber || '-'
        )}
      </div>
      <span className="text-[10px] md:text-xs text-white bg-black/70 px-1 py-0.5 rounded mt-1 truncate w-full text-center pointer-events-none">
        {displayName}
      </span>
    </div>
  )
}

function BenchPlayer({ player, onViewPlayer }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'bench-' + player.id.toString(),
    data: { player, sourceData: 'bench' }
  })
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 10,
    opacity: isDragging ? 0.8 : 1,
  } : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="flex items-center gap-4 bg-surface border border-border p-4 rounded-xl cursor-grab active:cursor-grabbing relative group min-w-0">
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onViewPlayer(player)}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-gold text-black p-1.5 rounded-md shadow-lg hover:scale-110 transition-transform"
        title="Ver detalhes"
      >
        <Eye size={14} />
      </button>
      <div className="w-12 h-12 bg-card border-2 border-border rounded-full flex items-center justify-center text-sm font-bold text-zinc-400 shrink-0 overflow-hidden">
        {player.picture || player.photo || player.image ? (
          <img src={player.picture || player.photo || player.image} alt={player.name} className="w-full h-full object-cover" draggable={false} />
        ) : (
          player.shirtNumber || '-'
        )}
      </div>
      <div className="flex-1 pointer-events-none pr-2">
        <p className="text-sm text-white leading-tight break-words">{player.name}</p>
        <p className="text-[10px] text-zinc-500 uppercase mt-0.5">{translatePosition(player.position)}</p>
      </div>
    </div>
  )
}

export default function Times() {
  const [query, setQuery] = useState('764') // 764 é o Brasil
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formation, setFormation] = useState(formationOptions[0])
  const [pitch, setPitch] = useState({ gk: [], df: [], mf: [], at: [] })
  const [bench, setBench] = useState([])
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [benchSearchQuery, setBenchSearchQuery] = useState('')
  const [selectedWc, setSelectedWc] = useState(wcOptions[0])
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const fetchTeam = async (teamId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/football-data/v4/teams/${teamId}`, {
        headers: {
          'X-Auth-Token': '957dfdf42c2147f7b475dcd4a4dcc400'
        }
      })

      if (!response.ok) {
        throw new Error('Time não encontrado ou limite de requisições atingido.')
      }

      // Verifica se a resposta realmente é um JSON antes de fazer o parse
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("A API não retornou um formato JSON válido. Verifique se o proxy está rodando.");
      }
      
      const data = await response.json()
      setTeam(data)
      
    } catch (err) {
      setError(err.message || 'Erro ao buscar dados.')
      setTeam(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeam('764')
  }, [])

  useEffect(() => {
    if (!team) {
      setPitch({ gk: [], df: [], mf: [], at: [] })
      setBench([])
      return
    }
    
    const squad = team.squad || []
    const gks = squad.filter(p => getPlayerCategory(p.position) === 'gk')
    const dfs = squad.filter(p => getPlayerCategory(p.position) === 'df')
    const mfs = squad.filter(p => getPlayerCategory(p.position) === 'mf')
    const ats = squad.filter(p => getPlayerCategory(p.position) === 'at')
    
    const req = getFormationRequirements(formation.value)
    
    const pick = (pool, count) => ({
      picked: pool.slice(0, count),
      rem: pool.slice(count)
    })
    
    const { picked: startGk, rem: remGk } = pick(gks, 1)
    const { picked: startDf, rem: remDf } = pick(dfs, req.df)
    const { picked: startMf, rem: remMf } = pick(mfs, req.mf)
    const { picked: startAt, rem: remAt } = pick(ats, req.at)
    
    const pad = (arr, len) => {
      const res = [...arr]
      while (res.length < len) res.push(null)
      return res
    }
    
    setPitch({
      gk: pad(startGk, 1),
      df: pad(startDf, req.df),
      mf: pad(startMf, req.mf),
      at: pad(startAt, req.at)
    })

    const knownIds = new Set([
      ...startGk, ...startDf, ...startMf, ...startAt,
      ...remGk, ...remDf, ...remMf, ...remAt
    ].map(p => p?.id).filter(Boolean))
    
    const others = squad.filter(p => !knownIds.has(p.id))
    setBench([...remGk, ...remDf, ...remMf, ...remAt, ...others])
  }, [team, formation])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current
    if (!activeData) return

    const player = activeData.player
    const source = activeData.sourceData

    // Soltou no banco
    if (over.id === 'bench') {
      if (source === 'bench') return 
      
      setPitch(prev => {
        const newLine = [...prev[source.line]]
        newLine[source.index] = null
        return { ...prev, [source.line]: newLine }
      })
      setBench(prev => [...prev, player])
      return
    }

    // Soltou no campo
    if (!overData) return
    const destLine = overData.line
    const destIndex = overData.index
    
    const category = getPlayerCategory(player.position)
    if (destLine === 'gk' && category !== 'gk') {
      showNotification("Apenas goleiros podem atuar nesta posição.", "error")
      return
    }
    if (destLine !== 'gk' && category === 'gk') {
      showNotification("O goleiro deve atuar na sua posição específica.", "error")
      return
    }

    if (source === 'bench') {
      setPitch(prev => {
        const destPlayer = prev[destLine][destIndex]
        const newLine = [...prev[destLine]]
        newLine[destIndex] = player
        
        setBench(b => {
          const newBench = b.filter(p => p.id !== player.id)
          if (destPlayer) newBench.push(destPlayer)
          return newBench
        })
        
        return { ...prev, [destLine]: newLine }
      })
    } else {
      const destPlayer = pitch[destLine][destIndex]
      if (destPlayer && getPlayerCategory(destPlayer.position) === 'gk' && source.line !== 'gk') {
        showNotification("O goleiro não pode ser movido para a linha.", "error")
        return
      }

      setPitch(prev => {
        const destPlayerInner = prev[destLine][destIndex]
        const srcLine = source.line
        const srcIndex = source.index

        const newSrc = [...prev[srcLine]]
        const newDest = srcLine === destLine ? newSrc : [...prev[destLine]]

        newSrc[srcIndex] = destPlayerInner
        newDest[destIndex] = player

        return { ...prev, [srcLine]: newSrc, [destLine]: newDest }
      })
    }
  }

  const handleRemoveFromPitch = (player, line, index) => {
    setPitch(prev => {
      const newLine = [...prev[line]]
      newLine[index] = null
      return { ...prev, [line]: newLine }
    })
    setBench(prev => [...prev, player])
  }

  const filteredBench = bench.filter(player => 
    player.name.toLowerCase().includes(benchSearchQuery.toLowerCase())
  )

  const benchGks = filteredBench.filter(p => getPlayerCategory(p.position) === 'gk')
  const benchDfs = filteredBench.filter(p => getPlayerCategory(p.position) === 'df')
  const benchMfs = filteredBench.filter(p => getPlayerCategory(p.position) === 'mf')
  const benchAts = filteredBench.filter(p => getPlayerCategory(p.position) === 'at')
  const benchOthers = filteredBench.filter(p => getPlayerCategory(p.position) === 'other')

  const renderBenchSection = (title, players) => {
    if (players.length === 0) return null
    return (
      <div className="mb-6 last:mb-0 w-full">
        <h4 className="text-zinc-400 text-sm uppercase mb-4 font-semibold border-b border-border pb-2">{title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {players.map(player => (
            <BenchPlayer key={player.id} player={player} onViewPlayer={setSelectedPlayer} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-6xl tracking-[0.2em] text-gold">
          TIMES
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            options={wcOptions}
            value={selectedWc}
            onChange={setSelectedWc}
            styles={customSelectStyles}
            isSearchable={false}
            placeholder="Copa do Mundo"
            className="w-full sm:w-48 z-50"
          />
          <Select
            options={teamOptions}
            value={teamOptions.find(t => t.value === query) || null}
            onChange={(option) => {
              setQuery(option.value);
              fetchTeam(option.value);
            }}
            formatOptionLabel={({ label, crest }) => (
              <div className="flex items-center gap-2">
                <img src={crest} alt={`Escudo ${label}`} className="w-5 h-5 object-contain" />
                <span>{label}</span>
              </div>
            )}
            styles={customSelectStyles}
            placeholder="Selecione a Seleção..."
            className="w-full sm:w-56 z-50"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-2xl p-12 flex items-center justify-center text-zinc-400">
          Buscando dados...
        </div>
      ) : error ? (
        <div className="bg-card border border-border rounded-2xl p-12 flex items-center justify-center text-red-500">
          {error}
        </div>
      ) : team ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Informações do Time */}
          <div className="bg-card border border-border rounded-2xl p-6 lg:col-span-1 h-fit">
            <div className="flex items-center gap-4 mb-6">
              {team.crest && (
                <img src={team.crest} alt={`Escudo do ${team.name}`} className="w-20 h-20 object-contain" />
              )}
              <div>
                <p className="text-zinc-400 uppercase text-sm">{team.area?.name || 'Desconhecido'}</p>
                <h2 className="font-display text-4xl">{team.name}</h2>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="bg-surface rounded-xl px-4 py-3 border border-border flex justify-between items-center">
                <span className="text-zinc-400">Títulos Mundiais:</span>
                <span className="text-right text-gold font-bold text-lg">{teamOptions.find(t => t.value === team.id?.toString())?.titles ?? 0}</span>
              </div>
              <div className="bg-surface rounded-xl px-4 py-3 border border-border flex justify-between">
                <span className="text-zinc-400">Estádio:</span>
                <span className="text-right">{team.venue || 'N/A'}</span>
              </div>
              <div className="bg-surface rounded-xl px-4 py-3 border border-border flex justify-between">
                <span className="text-zinc-400">Técnico:</span>
                <span className="text-right">{team.coach?.name || 'N/A'}</span>
              </div>
              <div className="bg-surface rounded-xl px-4 py-3 border border-border flex justify-between">
                <span className="text-zinc-400">Cores:</span>
                <span className="text-right">{translateColors(team.clubColors)}</span>
              </div>
              <div className="bg-surface rounded-xl px-4 py-3 border border-border flex justify-between">
                <span className="text-zinc-400">Ano de Fundação:</span>
                <span className="text-right">{team.founded || 'N/A'}</span>
              </div>
            </div>

            {team.runningCompetitions && team.runningCompetitions.length > 0 && (
              <div className="mt-8">
                <h3 className="font-display text-3xl text-gold mb-4">Competições</h3>
                <div className="flex flex-wrap gap-2">
                  {team.runningCompetitions.map(comp => (
                    <span key={comp.id} className="bg-surface border border-border px-3 py-1 rounded-lg text-sm text-zinc-300">
                      {comp.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Campinho com Elenco */}
          <DndContext onDragEnd={handleDragEnd}>
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display text-3xl text-gold">Elenco Titular</h3>
                  <div className="w-40">
                    <Select
                      options={formationOptions}
                      value={formation}
                      onChange={setFormation}
                      styles={customSelectStyles}
                      isSearchable={false}
                      placeholder="Tática"
                    />
                  </div>
                </div>
              
                <div className="relative w-full flex-1 min-h-[600px] bg-[#1a472a] rounded-xl border-4 border-white/30 p-6 flex flex-col justify-between overflow-hidden shadow-inner">
                  <div className="absolute top-1/2 left-0 w-full border-t-2 border-white/30 -translate-y-1/2 z-0"></div>
                  <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 z-0"></div>
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 z-0"></div>
                  <div className="absolute top-0 left-1/2 w-64 h-24 border-2 border-t-0 border-white/30 -translate-x-1/2 bg-[#1a472a] z-0"></div>
                  <div className="absolute bottom-0 left-1/2 w-64 h-24 border-2 border-b-0 border-white/30 -translate-x-1/2 bg-[#1a472a] z-0"></div>
                  <div className="absolute top-24 left-1/2 w-32 h-16 border-b-2 border-white/30 rounded-b-full -translate-x-1/2 z-0"></div>
                  <div className="absolute bottom-24 left-1/2 w-32 h-16 border-t-2 border-white/30 rounded-t-full -translate-x-1/2 z-0"></div>

                  {['at', 'mf', 'df', 'gk'].map((line) => (
                    <div key={line} className={`relative z-10 flex justify-center gap-2 md:gap-4 flex-wrap ${line === 'at' ? 'mt-2' : line === 'gk' ? 'mb-2' : 'mt-auto mb-auto'}`}>
                      {pitch[line].map((p, i) => (
                        <DroppableSlot 
                          key={`slot-${line}-${i}`} 
                          id={`slot-${line}-${i}`} 
                          line={line} 
                          index={i}
                          className="w-14 md:w-16 flex flex-col items-center justify-end rounded-xl"
                          style={{ minHeight: '80px' }}
                        >
                          {p ? <DraggablePlayer player={p} sourceData={{ line, index: i }} onViewPlayer={setSelectedPlayer} onRemovePlayer={() => handleRemoveFromPitch(p, line, i)} /> : <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-white/30 border-dashed rounded-full flex items-center justify-center text-white/40 text-[10px] uppercase font-bold">{lineNames[line]}</div>}
                        </DroppableSlot>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <h3 className="font-display text-3xl text-gold m-0">Banco de Reservas</h3>
                  <input
                    type="text"
                    placeholder="Buscar no banco..."
                    value={benchSearchQuery}
                    onChange={(e) => setBenchSearchQuery(e.target.value)}
                    className="bg-surface border border-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-gold w-full sm:w-64"
                  />
                </div>
                <DroppableSlot id="bench" className="w-full h-full min-h-[100px] rounded-xl flex flex-col">
                  {filteredBench.length === 0 && <span className="text-zinc-500">Nenhum jogador encontrado</span>}
                  {renderBenchSection('Goleiros', benchGks)}
                  {renderBenchSection('Defensores', benchDfs)}
                  {renderBenchSection('Meio-campistas', benchMfs)}
                  {renderBenchSection('Atacantes', benchAts)}
                  {renderBenchSection('Outros', benchOthers)}
                </DroppableSlot>
              </div>
            </div>
          </DndContext>
        </div>
      ) : null}

      {/* Modal do Jogador */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedPlayer(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border flex justify-between items-center bg-surface">
              <h3 className="font-display text-2xl text-gold">Detalhes do Jogador</h3>
              <button onClick={() => setSelectedPlayer(null)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-surface border-4 border-gold rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg overflow-hidden mb-4">
                {selectedPlayer.picture || selectedPlayer.photo || selectedPlayer.image ? (
                  <img src={selectedPlayer.picture || selectedPlayer.photo || selectedPlayer.image} alt={selectedPlayer.name} className="w-full h-full object-cover" />
                ) : (
                  selectedPlayer.shirtNumber || '-'
                )}
              </div>
              <h2 className="text-3xl font-bold text-white mb-1">{selectedPlayer.name}</h2>
              <p className="text-gold uppercase tracking-wider text-sm font-semibold mb-6">{translatePosition(selectedPlayer.position)}</p>
                
              <div className="w-full grid grid-cols-2 gap-4 text-left">
                <div className="bg-surface p-3 rounded-xl border border-border">
                  <p className="text-zinc-500 text-[10px] uppercase mb-1">Nacionalidade</p>
                  <p className="text-white text-sm font-medium truncate" title={selectedPlayer.nationality}>{selectedPlayer.nationality || 'N/A'}</p>
                </div>
                <div className="bg-surface p-3 rounded-xl border border-border">
                  <p className="text-zinc-500 text-[10px] uppercase mb-1">Idade</p>
                  <p className="text-white text-sm font-medium">{calculateAge(selectedPlayer.dateOfBirth)}</p>
                </div>
                <div className="bg-surface p-3 rounded-xl border border-border col-span-2">
                  <p className="text-zinc-500 text-[10px] uppercase mb-1">Nascimento (DD/MM/YYYY)</p>
                  <p className="text-white text-sm font-medium">{formatDate(selectedPlayer.dateOfBirth)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shadcn UI Alerta Flutuante (Toast) */}
      {notification && (
        <div className="fixed top-6 right-6 z-[110] animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`flex items-start gap-3 p-4 rounded-lg shadow-xl border backdrop-blur-md w-80 ${notification.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-surface border-border text-white'}`}>
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <h4 className="font-semibold text-sm leading-none">{notification.type === 'error' ? 'Ação Inválida' : 'Informação'}</h4>
              <p className="text-sm opacity-90 leading-tight">{notification.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}