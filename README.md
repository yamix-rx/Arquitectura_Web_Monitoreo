<div align="center">
  <img src="https://raw.githubusercontent.com/yamix-rx/yamix-rx/main/assets/proyecto-incubadora.svg" width="75%" alt="Monitoreo web de incubadora" />
  <h1>Monitoreo Web de Incubadora</h1>
  <p>Dashboard para visualizar indicadores de una incubadora con conectividad MQTT y modo de simulación.</p>
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Frontend-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MQTT-Telemetría-660066" alt="MQTT" />
</div>

## 📌 Descripción

Interfaz web para el **monitoreo de una incubadora**, desarrollada con **Next.js, React y TypeScript**. Su pantalla principal muestra indicadores, gráficos de tendencia, estado de conexión y controles relacionados con datos enviados mediante MQTT.

## ✨ Características implementadas en el código

- Dashboard con indicadores y visualización de datos.
- Panel de tendencias y componentes de medición.
- Estado de conexión MQTT.
- Modal de configuración para credenciales y conectividad.
- Envío de comandos a través de MQTT.
- Identificación visual del modo de simulación cuando corresponde.
- Interfaz adaptable y componentes reutilizables.

## 🛠️ Tecnologías principales

| Área | Tecnologías |
| :--- | :--- |
| Framework | Next.js 16, React 19 |
| Lenguaje | TypeScript |
| Comunicación | MQTT |
| UI | Tailwind CSS, Radix UI, Lucide |
| Datos visuales | Recharts |

## 📁 Estructura

```text
Arquitectura_Web_Monitoreo/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── hooks/
│   └── use-mqtt.ts
├── lib/
├── public/
├── styles/
└── package.json
```

## 🚀 Ejecución local

```bash
git clone https://github.com/yamix-rx/Arquitectura_Web_Monitoreo.git
cd Arquitectura_Web_Monitoreo
npm install
npm run dev
```

Abre **http://localhost:3000** para visualizar el dashboard. Para recibir datos reales, configura una conexión MQTT válida desde las opciones disponibles en la interfaz. La disponibilidad de datos depende del broker y del dispositivo o emisor conectado.

> Nunca publiques credenciales reales de un broker MQTT dentro del repositorio.

## 👨‍💻 Autor

**RX** · [GitHub](https://github.com/yamix-rx) · [Portafolio](https://yamix-rx-portafolio.vercel.app/)
