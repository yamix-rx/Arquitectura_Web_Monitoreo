"use client"

import { useMQTT } from "@/hooks/use-mqtt"
import { TechCard } from "@/components/tech-card"
import { CircularGauge } from "@/components/circular-gauge"
import { TrendChart } from "@/components/trend-chart"
import { CommandPanel } from "@/components/command-panel" // Import command panel
import { Wifi, WifiOff, Cpu, Thermometer, Droplets, Wind, Ruler, AlertTriangle, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { SettingsModal } from "@/components/settings-modal"

export default function Dashboard() {
  const { data, status, isSimulated, saveCredentials, publishMessage } = useMQTT() // Get publishMessage function
  const [currentTime, setCurrentTime] = useState<string>("")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString())
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSendCommand = (command: string) => {
    return publishMessage("comandos/control", command)
  }

  return (
    <main className="min-h-screen p-4 md:p-8 relative">
      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onSave={saveCredentials} />

      {/* Background Grid Effect */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <header className="relative z-10 mb-8 flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-6">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="p-3 bg-neon-blue/10 border border-neon-blue/30 rounded-lg">
            <Cpu className="w-8 h-8 text-neon-blue" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-white text-glow-blue">
              MONITOREO DE <span className="text-neon-blue">INCUBADORA</span>
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-slate-400 font-mono text-sm tracking-wider">Monitoreo de proyecto de incubadora</p>
              {isSimulated && (
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs border border-yellow-500/50 rounded flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  SIMULATION MODE
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 uppercase tracking-widest">System Status</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-mono font-bold ${status === "connected" ? "text-green-400" : status === "error" ? "text-yellow-400" : "text-red-400"}`}
              >
                {status === "connected" ? "ONLINE" : status === "error" ? "OFFLINE (SIM)" : status.toUpperCase()}
              </span>
              {status === "connected" ? (
                <Wifi className="w-4 h-4 text-green-400 animate-pulse" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>
          <div className="h-10 w-[1px] bg-white/10 mx-2" />

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg border border-white/10 hover:bg-white/5 hover:border-neon-blue/50 transition-all group"
            title="Configure MQTT"
          >
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-neon-blue" />
          </button>

          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-500 uppercase">Server</div>
            <div className="text-sm font-mono text-neon-purple">HIVEMQ CLOUD</div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Temperature Card */}
        <TechCard title="Temperatura" subtitle="Sensor DHT11" accentColor="pink" className="col-span-1">
          <div className="flex flex-col items-center">
            <div className="absolute top-4 right-4">
              <Thermometer className="w-5 h-5 text-neon-pink opacity-50" />
            </div>
            <CircularGauge value={data.temperature} max={40} unit="°C" color="#f956c3" label="TEMP" />
            <div className="w-full mt-4 grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
              <div className="bg-white/5 p-2 rounded border border-white/5 text-center">MIN: 18°C</div>
              <div className="bg-white/5 p-2 rounded border border-white/5 text-center">MAX: 40°C</div>
            </div>
          </div>
        </TechCard>

        {/* Humidity Card */}
        <TechCard title="Humedad" subtitle="Sensor DHT11" accentColor="blue" className="col-span-1">
          <div className="flex flex-col items-center">
            <div className="absolute top-4 right-4">
              <Droplets className="w-5 h-5 text-neon-blue opacity-50" />
            </div>
            <CircularGauge value={data.humidity} max={100} unit="%" color="#00f3ff" label="HUM" />
            <div className="w-full mt-4 grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
              <div className="bg-white/5 p-2 rounded border border-white/5 text-center">OPTIMO: 45%</div>
              <div className="bg-white/5 p-2 rounded border border-white/5 text-center">CRITICO: 80%</div>
            </div>
          </div>
        </TechCard>

        {/* Gas Sensor Chart */}
        <TechCard
          title="Calidad de Aire"
          subtitle="Sensor MQ-135"
          accentColor="purple"
          className="col-span-1 md:col-span-2"
        >
          <div className="flex justify-between items-end mb-4">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-neon-purple" />
              <span className="text-3xl font-mono font-bold text-white text-glow-purple">{data.gas.toFixed(0)}</span>
              <span className="text-xs text-slate-400 mb-1">PPM</span>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">
                NORMAL
              </span>
            </div>
          </div>
          <div className="bg-black/20 rounded-lg p-2 border border-white/5">
            <TrendChart data={data.gasHistory} color="#bc13fe" unit="PPM" />
          </div>
        </TechCard>

        {/* Distance Sensor Chart */}
        <TechCard
          title="Proximidad"
          subtitle="Sensor Ultrasonico - HC-SR04"
          accentColor="blue"
          className="col-span-1 md:col-span-2"
        >
          <div className="flex justify-between items-end mb-4">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-neon-blue" />
              <span className="text-3xl font-mono font-bold text-white text-glow-blue">{data.distance.toFixed(1)}</span>
              <span className="text-xs text-slate-400 mb-1">CM</span>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
                ACTIVE
              </span>
            </div>
          </div>
          <div className="bg-black/20 rounded-lg p-2 border border-white/5">
            <TrendChart data={data.distanceHistory} color="#00f3ff" unit="cm" />
          </div>
        </TechCard>

        {/* Command Panel */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <CommandPanel onSendCommand={handleSendCommand} isConnected={status === "connected"} />
        </div>

        {/* System Logs / Footer Panel */}
        <TechCard
          title="CONSOLA"
          subtitle="Registro de eventos en tiempo real"
          accentColor="blue"
          className="col-span-1 md:col-span-2 lg:col-span-4 h-40 overflow-hidden"
        >
          <div className="font-mono text-xs text-slate-400 space-y-1 h-full overflow-y-auto custom-scrollbar">
            {isSimulated && (
              <div className="flex gap-4 border-b border-white/5 pb-1 text-yellow-400">
                <span className="text-yellow-500">[WARN]</span>
                <span className="text-slate-500">{currentTime}</span>
                <span>Error de conexión. Ejecutando en modo simulación. Verifique las credenciales.</span>
              </div>
            )}
            <div className="flex gap-4 border-b border-white/5 pb-1">
              <span className="text-neon-blue">[SYSTEM]</span>
              <span className="text-slate-500">{currentTime}</span>
              <span>El panel de control se ha inicializado correctamente.</span>
            </div>
            <div className="flex gap-4 border-b border-white/5 pb-1">
              <span className="text-neon-purple">[MQTT]</span>
              <span className="text-slate-500">{currentTime}</span>
              <span>Conexión establecida con el broker.</span>
            </div>
            <div className="flex gap-4 border-b border-white/5 pb-1">
              <span className="text-neon-pink">[SENSOR]</span>
              <span className="text-slate-500">{currentTime}</span>
              <span>Flujo de datos activo para 4 canales.</span>
            </div>
            {data.temperature > 30 && (
              <div className="flex gap-4 border-b border-white/5 pb-1 text-red-400">
                <span className="text-red-500">[WARN]</span>
                <span className="text-slate-500">{currentTime}</span>
                <span>High temperature detected: {data.temperature}°C</span>
              </div>
            )}
          </div>
        </TechCard>
      </div>
    </main>
  )
}
