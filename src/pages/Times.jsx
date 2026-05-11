export default function Times() {
  return (
    <div>
      <h1 className="font-display text-6xl tracking-[0.2em] text-gold mb-6">
        TIMES
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-zinc-400 uppercase text-sm">Seleção</p>
          <h2 className="font-display text-5xl">🇧🇷 Brasil</h2>

          <div className="mt-6 space-y-3">
            {['Alisson', 'Marquinhos', 'Casemiro', 'Vinicius Jr.'].map((j) => (
              <div key={j} className="bg-surface rounded-xl px-4 py-3 border border-border">
                {j}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-card to-surface border border-border rounded-2xl p-6">
          <h3 className="font-display text-3xl mb-4">Integrações Preparadas</h3>

          <ul className="space-y-3 text-zinc-300">
            <li>✔ React Router configurado</li>
            <li>✔ Estrutura modularizada</li>
            <li>✔ Tailwind configurado</li>
            <li>✔ Layout inspirado na identidade Arena Mundial</li>
            <li>✔ Componentização pronta para APIs</li>
          </ul>
        </div>
      </div>
    </div>
  )
}