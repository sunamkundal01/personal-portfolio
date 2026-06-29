# SUNAM.AI | AI/ML Engineering Portfolio

A high-performance, immersive portfolio showcasing edge-AI and full-stack engineering work, built with **React 18**, **TypeScript**, **Three.js**, and **Tailwind CSS**.

## 🚀 Key Highlights

- **🛰️ Edge AI Focus**: On-device LLM deployment, quantization, Dynamic LoRA, and MoLE on embedded silicon (SiMa.ai MLSoC).
- **🔐 Security-Grade Projects**: Iris biometric template protection (ResNet18 + Fuzzy Vault + Paillier HE) and hardened payment flows.
- **🌐 3D Interactive Visuals**: Custom Three.js wireframe sphere with mouse-tracking and shader modulation.
- **🤖 AI Chatbot**: "Hedgy" assistant powered by the Gemini API, grounded on Sunam's background.
- **✨ Neural Network Easter Egg**: Interactive hidden simulation (toggle with `Ctrl + Shift + N`).

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Core** | React 18, Vite, TypeScript |
| **3D & Animation** | Three.js, Framer Motion |
| **Styling** | Tailwind CSS, Lucide Icons |
| **Data Viz** | Recharts |
| **AI** | Gemini API (chatbot) |
| **Deployment** | Vercel (Speed Insights + Analytics) |

## 📦 Featured Projects

### 1. Iris Biometric Template Security System
3-layer pipeline (ResNet18 + Fuzzy Vault + Paillier Homomorphic Encryption).
- **Impact**: 95.8% GAR @ 1% FAR on CASIA-Iris-Thousand; 100-bit cryptographic security; ISO/IEC 24745 compliant.
- **Tech**: PyTorch, OpenCV, Fuzzy Vault, Paillier HE.

### 2. Rent a Ride — Full-Stack Car Rental Marketplace
3-role (User/Admin/Vendor) MERN platform.
- **Impact**: 40+ RBAC-secured REST endpoints; Razorpay HMAC-SHA256 verification with idempotency guards.
- **Tech**: React, Node.js, Express, MongoDB, Razorpay, JWT.

### 3. CampusSphere — AI-Powered Academic Platform
Real-time collaboration and RAG-based note analysis.
- **Impact**: 100+ registered users; Gemini LLM + Convex vector search for semantic PDF retrieval.
- **Tech**: React.js, Convex, Firebase Auth, Gemini API.

## ⚙️ Installation & Development

1. **Install**
   ```bash
   npm install
   ```

2. **Run Development**
   ```bash
   npm run dev
   ```

3. **Build**
   ```bash
   npm run build
   ```

### Chatbot (Hedgy)

The chatbot calls a **serverless proxy** (`api/chat.ts`) so the Gemini key never reaches
the browser. Set `GEMINI_API_KEY` (no `VITE_` prefix) in your Vercel project's environment
variables. To test the bot locally, run `vercel dev` — plain `npm run dev` serves the site
but not the `/api` function.

### Resume

Place your resume PDF at `public/SUNAM_KUNDAL_RESUME.pdf` for the "Download CV" buttons.

## 📄 License
MIT © 2026 Sunam Kundal.
