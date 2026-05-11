const grupos = [
  ['Brasil', 9],
  ['Argentina', 6],
  ['Alemanha', 3],
  ['Camarões', 0],
]

export default function Classificacao() {
  return (
    <div>
      <h1 className="font-display text-6xl tracking-[0.2em] text-gold mb-6">
        CLASSIFICAÇÃO
      </h1>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface">
            <tr className="text-left text-zinc-400">
              <th className="p-4">Pos</th>
              <th className="p-4">Seleção</th>
              <th className="p-4">Pontos</th>
            </tr>
          </thead>

          <tbody>
            {grupos.map((time, index) => (
              <tr key={time[0]} className="border-t border-border">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{time[0]}</td>
                <td className="p-4 text-gold font-bold">{time[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}