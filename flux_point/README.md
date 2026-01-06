# FluxPoint: Sentient Precision Architecture

## 1. Project Overview
**FluxPoint** is a futuristic visualization dashboard designed to demonstrate "Next-generation trajectory reconstruction using LSTM neural architecture." It simulates a high-fidelity operating system interface ("FluxPoint OS v2.1 RC") that visualizes robotic fleet data.

The core value proposition visualized is the ability to take noisy, erratic sensor data and reconstruct clean, precise trajectories in real-time.

### Key Features
- **Cinematic Boot Sequence**: Immersive "OS boot" animation.
- **3D Visualization Engine**: Real-time rendering of drone agents, ground truth paths, and noisy sensor clouds using `react-three-fiber`.
- **Holographic HUD**: Glassmorphism-based UI overlay showing real-time drift metrics, event logs, and system status.
- **Interactive Simulation**: Ability to "Initiate" and "Abort" trajectory replays with live data streaming.

---

## 2. Technical Stack
- **Framework**: React 19
- **3D Engine**: Three.js / @react-three/fiber / @react-three/drei
- **Post-Processing**: @react-three/postprocessing (Bloom effects)
- **Icons**: Lucide React
- **Styling**: Pure CSS (Variables, Glassmorphism, Animations)

---

## 3. Architecture & Components

### View Controller (`App.js`)
The main entry point manages the application state machine, transitioning between three distinct views:
1.  **Boot**: (`BootSequence.jsx`) A CLI-style loading screen with progress bars and initialization logs.
2.  **Landing**: (`LandingPage.jsx`) A polished marketing hero section with a floating mascot and "Initialize" functionality.
3.  **Dashboard**: The core application view containing the 3D scene and HUD.

**State Management:**
- `currentView`: Controls the macro-flow (boot -> landing -> dashboard).
- `isLive`: Boolean flag for simulation status.
- `displayedData`: Array of points currently rendered in the 3D scene.
- `logs`: Rolling log of system events ("Uplink Established", "Drift Correction").

### The 3D Engine (`flux.3d.jsx`)
A specialized Three.js renderer optimized for visualizing trajectory data.

- **Drone Agent**: A smoothed, floating entity that interpolates between data points to create a "gliding" effect, simulating high-frequency control updates.
- **PrecisionPath**: Renders the "AI Reconstruction" path (Cyan) and "Ground Truth" path (Yellow) using `CatmullRomCurve3` for organic, smooth lines.
- **NoiseCloud**: Renders raw sensor readings (Red) as a scattered point cloud to visually demonstrate the difficulty of the reconstruction task.
- **Environment**: A dark grid world with atmosphere fog, stars, and bloom effects to create a deep, cybernetic aesthetic.

### Data Model (`fluxpoint_data.json`)
The system functionality is driven by a static dataset representing a fleet of robots.
**Structure:**
```json
"fleet": [
  {
    "id": "figure8",
    "name": "FLX-01 (Patrol Unit)",
    "data": [
      {
        "time": 0,
        "truth_x": 0.0,       // Actual Physical location (Yellow)
        "noisy_x": -3.1,      // Raw Sensor Reading (Red / Hidden)
        "pred_x": 0.17        // AI Corrected Location (Cyan / Drone)
      },
      ...
    ]
  }
]
```

---

## 4. Visual Language
The project employs a distinct "Cyber-Industrial" aesthetic:
- **Palette**: Cyan (#22d3ee) for AI/Safe, Red (#ef4444) for Noise/Error, Yellow (#facc15) for Truth.
- **Typography**: Monospace fonts for data (Source Code Pro style), Sans-serif for headers.
- **Effects**:
    - **Bloom**: Glowing lines and trails to signify energy.
    - **Drift**: Micro-animations on UI elements to make them feel "alive."
    - **Glass**: Translucent backgrounds with blurs to separate UI from the 3D world.

---

## 5. Setup & Usage

### Installation
```bash
npm install
```

### Development
Runs the app in development mode on [http://localhost:3000](http://localhost:3000).
```bash
npm start
```

### Build
Builds the app for production to the `build` folder.
```bash
npm run build
```
