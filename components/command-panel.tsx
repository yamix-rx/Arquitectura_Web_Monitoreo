"use client"

import type React from "react"

import { useState } from "react"
import { TechCard } from "./tech-card"
import { Send, Terminal } from "lucide-react"

interface CommandPanelProps {
  onSendCommand: (command: string) => boolean
  isConnected: boolean
}

export function CommandPanel({ onSendCommand, isConnected }: CommandPanelProps) {
  const [command, setCommand] = useState("")
  const [commandHistory, setCommandHistory] = useState<Array<{ cmd: string; time: string; status: string }>>([])

  const handleSend = () => {
    if (!command.trim()) return

    const success = onSendCommand(command.trim())
    const now = new Date().toLocaleTimeString()

    setCommandHistory((prev) => [
      {
        cmd: command.trim(),
        time: now,
        status: success ? "SENT" : "FAILED",
      },
      ...prev.slice(0, 4), // Keep last 5 commands
    ])

    if (success) {
      setCommand("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <TechCard title="Panel de Control" subtitle="comandos/control - Send to Arduino" accentColor="pink" className="">
      <div className="space-y-4">
        {/* Command Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Terminal className="w-4 h-4 text-neon-pink/50" />
            </div>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isConnected ? "Escribe tu comando aquí..." : "Conecta primero al broker MQTT"}
              disabled={!isConnected}
              className="w-full bg-black/40 border border-neon-pink/30 rounded-lg px-10 py-3 text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink/50 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!isConnected || !command.trim()}
            className="px-6 py-3 bg-neon-pink/20 border border-neon-pink/50 rounded-lg hover:bg-neon-pink/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 group"
          >
            <Send className="w-4 h-4 text-neon-pink group-hover:translate-x-0.5 transition-transform" />
            <span className="text-neon-pink font-bold uppercase text-sm">Enviar</span>
          </button>
        </div>

        {/* Command History */}
        {commandHistory.length > 0 && (
          <div className="bg-black/20 rounded-lg p-3 border border-white/5">
            <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Historial de Comandos</div>
            <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
              {commandHistory.map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-xs font-mono border-b border-white/5 pb-1">
                  <span className="text-slate-500">{item.time}</span>
                  <span
                    className={`px-2 py-0.5 rounded ${item.status === "SENT" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}
                  >
                    {item.status}
                  </span>
                  <span className="text-white flex-1 truncate">{item.cmd}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="flex items-start gap-2 text-xs text-slate-500 bg-white/5 p-3 rounded-lg border border-white/5">
          <div className="text-neon-pink mt-0.5">ⓘ</div>
          <div>
            <span className="font-semibold text-slate-400">Tópico:</span> comandos/control
            <br />
            Los comandos se envían a tu aplicación de Visual para ser transmitidos por puerto serial al Arduino.
          </div>
        </div>
      </div>
    </TechCard>
  )
}
