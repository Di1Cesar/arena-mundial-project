import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Classificacao from './pages/Classificacao'
import Partidas from './pages/Partidas'
import Times from './pages/Times'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-white flex">
      <Sidebar />

      <main className="flex-1 ml-[240px]">
        <Topbar />
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/classificacao" element={<Classificacao />} />
            <Route path="/partidas" element={<Partidas />} />
            <Route path="/times" element={<Times />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}