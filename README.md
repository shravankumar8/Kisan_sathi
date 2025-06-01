# KisanSaathi: AI-Powered Farming Assistant

KisanSaathi is an AI-driven voice and chat assistant built to empower Indian farmers with personalized, multilingual farming advice. Deployed as a React PWA, WhatsApp chatbot (Twilio), and phone IVR (Google STT/ElevenLabs TTS), it delivers insights on crops, pests, weather, and markets. Powered by Lyzr.ai with RAG for semantic responses, KisanSaathi supports Hindi, Marathi, Tamil, Telugu, and more, ensuring accessibility in low-bandwidth rural areas.

## Project Structure
- **Backend**: Node.js/Express server handling API requests, Twilio webhooks, and AI integrations.  
- **Frontend-kisan-app**: React PWA for web-based interaction with the assistant.

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/kisan-saathi.git
   cd kisan-saathi
   ```
2. **Backend Setup**:
   - Navigate to the Backend folder:
     ```bash
     cd Backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Copy `.env.example` to `.env` and fill in your credentials:
     ```bash
     cp .env.example .env
     ```
   - Start the server:
     ```bash
     npm start
     ```
3. **Frontend Setup**:
   - Navigate to the Frontend-kisan-app folder:
     ```bash
     cd Frontend-kisan-app
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Copy `.env.example` to `.env` and fill in your credentials:
     ```bash
     cp .env.example .env
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```
4. Access the app:
   - Backend API: `http://localhost:3000`
   - Frontend PWA: `http://localhost:5173` (default Vite port)

## Key Features
- Personalized recommendations based on location, soil, and season.  
- Multilingual support for inclusive communication.  
- Offline-friendly via lightweight PWA and WhatsApp/IVR.  

## Tech Stack
- **Frontend**: React, Tailwind CSS  
- **Backend**: Node.js, Express, MongoDB Atlas  
- **AI**: Lyzr.ai (RAG), ElevenLabs TTS, OpenAI/Gemini  
- **Communication**: Twilio (WhatsApp/IVR), Google STT/TTS  

## Built for AI for India Hackathon, June 01, 2025
Contributions welcome! 🌾# Kisan_sathi
# Kisan_sathi
# Kisan_sathi
