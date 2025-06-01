# Frontend: KisanSaathi PWA

This is the frontend for KisanSaathi, a React Progressive Web App (PWA) that provides a lightweight interface for farmers to interact with the AI assistant.

## Setup Instructions
1. Navigate to the folder:
   ```bash
   cd Frontend-kisan-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Access the PWA at `http://localhost:5173`.

## Features
- Chat interface for AI assistant queries.  
- Multilingual prompts using ElevenLabs TTS.  
- Offline support via PWA.

## Tech Stack
- React, Tailwind CSS  
- Vite (build tool)  
- ElevenLabs TTS (via API)