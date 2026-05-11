const jogos = [
  { casa: 'Brasil', visitante: 'Argentina', placar: '2 x 1', status: 'AO VIVO' },
  { casa: 'França', visitante: 'Espanha', placar: '3 x 1', status: 'ENCERRADO' },
]

export default function Partidas() {
  return (
    <div>
      <h1 className="font-display text-6xl tracking-[0.2em] text-gold mb-6">
        PARTIDAS
      </h1>

      <div className="grid gap-4">
        {jogos.map((jogo) => (
          <div key={jogo.casa} className="bg-card border border-border rounded-2xl p-5 flex justify-between items-center">
            <div>
              <p className="text-zinc-400">{jogo.status}</p>
              <h2 className="font-display text-4xl">
                {jogo.casa} <span className="text-gold">{jogo.placar}</span> {jogo.visitante}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}