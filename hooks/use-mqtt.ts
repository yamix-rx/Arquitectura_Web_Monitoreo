"use client"

import { useState, useEffect, useRef } from "react"
import mqtt from "mqtt"

export interface SensorData {
  temperature: number
  humidity: number
  gas: number
  distance: number
  timestamp: string
}

export interface ChartData {
  value: number
  timestamp: string
}

export function useMQTT() {
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected" | "error">("disconnected")
  const [isSimulated, setIsSimulated] = useState(false)
  const [connectionTrigger, setConnectionTrigger] = useState(0)
  const [data, setData] = useState<SensorData>({
    temperature: 0,
    humidity: 0,
    gas: 0,
    distance: 0,
    timestamp: new Date().toLocaleTimeString(),
  })

  // History for charts
  const [gasHistory, setGasHistory] = useState<ChartData[]>([])
  const [distanceHistory, setDistanceHistory] = useState<ChartData[]>([])

  // Refs to keep track of simulation interval
  const simulationInterval = useRef<NodeJS.Timeout | null>(null)
  const clientRef = useRef<mqtt.MqttClient | null>(null)

  const saveCredentials = (username: string, pass: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mqtt_username", username)
      localStorage.setItem("mqtt_password", pass)
      setConnectionTrigger((prev) => prev + 1) // Trigger useEffect
    }
  }

  const updateData = (topic: string, value: number) => {
    const now = new Date().toLocaleTimeString()

    setData((prev) => {
      const newData = { ...prev, timestamp: now }
      if (topic === "sensores/temperatura" || topic === "temp") newData.temperature = value
      if (topic === "sensores/humedad" || topic === "hum") newData.humidity = value
      if (topic === "sensores/gas" || topic === "gas") newData.gas = value
      if (topic === "sensores/distancia" || topic === "dist") newData.distance = value
      return newData
    })

    if (topic === "sensores/gas" || topic === "gas") {
      setGasHistory((prev) => {
        const newHistory = [...prev, { value, timestamp: now }]
        return newHistory.slice(-20)
      })
    }
    if (topic === "sensores/distancia" || topic === "dist") {
      setDistanceHistory((prev) => {
        const newHistory = [...prev, { value, timestamp: now }]
        return newHistory.slice(-20)
      })
    }
  }

  const startSimulation = () => {
    if (simulationInterval.current) return
    console.log("Starting simulation mode...")
    setIsSimulated(true)
    if (clientRef.current) {
      clientRef.current.end()
      clientRef.current = null
    }

    simulationInterval.current = setInterval(() => {
      updateData("sensores/temperatura", 20 + Math.random() * 10)
      updateData("sensores/humedad", 40 + Math.random() * 20)
      updateData("sensores/gas", 100 + Math.random() * 50)
      updateData("sensores/distancia", 10 + Math.random() * 90)
    }, 2000)
  }

  const publishMessage = (topic: string, message: string) => {
    if (clientRef.current && status === "connected") {
      clientRef.current.publish(topic, message)
      console.log(`[v0] Published to ${topic}: ${message}`)
      return true
    } else {
      console.warn("[v0] Cannot publish: Not connected to MQTT broker")
      return false
    }
  }

  useEffect(() => {
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current)
      simulationInterval.current = null
    }

    if (clientRef.current) {
      clientRef.current.end()
      clientRef.current = null
    }

    setStatus("connecting")

    const envUser = process.env.NEXT_PUBLIC_MQTT_USERNAME
    const envPass = process.env.NEXT_PUBLIC_MQTT_PASSWORD

    let username = envUser
    let password = envPass

    if (typeof window !== "undefined") {
      const localUser = localStorage.getItem("mqtt_username")
      const localPass = localStorage.getItem("mqtt_password")
      if (localUser && localPass) {
        username = localUser
        password = localPass
      }
    }

    if (!username || !password || username === "your-username") {
      console.warn("MQTT Credentials missing. Starting in simulation mode.")
      setStatus("error")
      startSimulation()
      return
    }

    const options = {
      username: username,
      password: password,
      clientId: `mqtt_dashboard_${Math.random().toString(16).slice(3)}`,
      protocol: "wss" as const,
      connectTimeout: 5000,
      reconnectPeriod: 0,
    }

    let client: mqtt.MqttClient | null = null

    try {
      client = mqtt.connect("wss://e070d27a53b94cd1904393af07d6fa5d.s1.eu.hivemq.cloud:8884/mqtt", options)
      clientRef.current = client

      client.on("connect", () => {
        console.log("Connected to HiveMQ")
        setStatus("connected")
        setIsSimulated(false)
        if (client) {
          client.subscribe(["sensores/temperatura", "sensores/humedad", "sensores/gas", "sensores/distancia"])
        }
      })

      client.on("message", (topic, message) => {
        const value = Number.parseFloat(message.toString())
        updateData(topic, value)
      })

      client.on("error", (err) => {
        if (err.message.includes("Not authorized") || err.message.includes("Connection refused")) {
          console.warn("MQTT Auth Failed: Switching to simulation mode. Please check your credentials.")
        } else {
          console.error("MQTT Error:", err)
        }
        setStatus("error")
        startSimulation()
      })

      client.on("close", () => {
        if (status === "connected") {
          setStatus("disconnected")
        }
      })
    } catch (error) {
      console.error("Failed to create MQTT client:", error)
      setStatus("error")
      startSimulation()
    }

    return () => {
      if (client) client.end()
      if (simulationInterval.current) clearInterval(simulationInterval.current)
    }
  }, [connectionTrigger])

  return {
    status,
    isSimulated,
    saveCredentials,
    publishMessage, // Export publish function
    data: {
      ...data,
      gasHistory,
      distanceHistory,
    },
  }
}
