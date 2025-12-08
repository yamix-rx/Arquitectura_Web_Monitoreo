"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Save, Lock, User } from "lucide-react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (user: string, pass: string) => void
}

export function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (isOpen) {
      const localUser = localStorage.getItem("mqtt_username") || ""
      const localPass = localStorage.getItem("mqtt_password") || ""
      setUsername(localUser)
      setPassword(localPass)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(username, password)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-neon-blue/50 rounded-lg shadow-[0_0_50px_rgba(0,243,255,0.2)] relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-blue"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-blue"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-blue"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-blue"></div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
              <span className="text-neon-blue">SYSTEM</span> CONFIG
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-neon-blue uppercase tracking-widest font-bold">MQTT Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded p-2 pl-10 text-white focus:border-neon-blue focus:outline-none font-mono"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-neon-blue uppercase tracking-widest font-bold">MQTT Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded p-2 pl-10 text-white focus:border-neon-blue focus:outline-none font-mono"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-white/10 rounded text-slate-300 hover:bg-white/5 transition-colors font-mono text-sm"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-neon-blue/20 border border-neon-blue text-neon-blue rounded hover:bg-neon-blue/30 transition-colors font-mono text-sm font-bold flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                SAVE & CONNECT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
