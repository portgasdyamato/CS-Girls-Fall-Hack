---
description: >-
  Check out the rest of this README to discover more about the project, its
  features, and how to get started
metaLinks:
  alternates:
    - https://app.gitbook.com/s/2AwfWOGBWBxQmyvHedqW/
---

# README

## Study Buddy - AI-Powered Study Assistant

An intelligent study companion that helps students learn with AI-powered chat, document analysis, and personalized study modes.

### Features

* 🤖 **AI-Powered Chat**: Chat with an AI tutor that adapts to your learning style
* 📄 **Document Upload**: Upload PDF, DOCX, or TXT files for AI to analyze
* 📚 **Smart Study Modes**: Choose from Active Learning, Break Mode, Focused, or Review
* 🌍 **Multi-Language Support**: Available in 8 languages
* 💡 **Document Summarization**: Get AI-generated summaries of your study materials
* 🎯 **Context-Aware Answers**: AI uses your uploaded notes to provide relevant answers
* 😊 **Emotion Detection**: AI adapts its tone based on your emotional state

### Prerequisites

* **Python 3.8+** installed
* **Node.js 18+** installed
* **Google Gemini API Key** - Get one from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Quick Start

#### 1. Install Dependencies

**Backend (Python)**

```powershell
pip install -r requirements.txt
```

**Frontend (Node.js)**

```powershell
npm install
```

#### 2. Configure Environment

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Important:** Replace `your_actual_gemini_api_key_here` with your actual Google Gemini API key.

#### 3. Start the Application

**Option A: Run Both Services (Recommended)**

**Terminal 1 - Backend:**

```powershell
python study_buddy_backend.py
```

Backend runs on `http://localhost:8001`

**Terminal 2 - Frontend:**

```powershell
npm run dev:client
```

Frontend runs on `http://localhost:5173`

**Option B: Use PowerShell Scripts**

**Backend:**

```powershell
.\start-backend.ps1
```

**Frontend:**

```powershell
.\start-client.ps1
```

#### 4. Use the Application

1. Open your browser to `http://localhost:5173`
2. Upload study notes using the upload button (📤)
3. Ask questions about your notes or chat with the AI
4. The AI will automatically use your uploaded notes when answering

### How to Use

#### Uploading Documents

1. Click the upload button (📤) in the chat input area
2. Select a PDF, DOCX, DOC, or TXT file
3. Wait for the upload confirmation
4. Start asking questions about your documents!

#### Chatting with AI

* Type your question or message in the chat input
* The AI will respond using your uploaded notes (if available)
* Choose different study modes to change the AI's teaching style
* Select your preferred language for responses

#### Getting Document Summaries

After uploading notes, you can ask:

* "Can you summarize my notes?"
* "What are the key concepts in my documents?"
* "Give me a summary of the uploaded material"

### API Endpoints

* **POST** `/api/chat` - Send chat messages
* **POST** `/api/notes/upload` - Upload study notes
* **POST** `/api/notes/ask` - Ask questions about notes
* **POST** `/api/notes/summary` - Get document summary
* **GET** `/api/personality-modes` - Get AI personality modes
* **GET** `/health` - Health check

### Troubleshooting

See SETUP.md for detailed troubleshooting guide.

#### Common Issues

**Backend won't start:**

* Check that `.env` file exists with `GEMINI_API_KEY`
* Ensure Python dependencies are installed: `pip install -r requirements.txt`

**Frontend can't connect to backend:**

* Verify backend is running on port 8001
* Check browser console for errors
* Ensure CORS is enabled (already configured in backend)

**File upload fails:**

* Check file format (PDF, DOCX, DOC, TXT only)
* Ensure file is not corrupted
* Check backend logs for errors

### Project Structure

```
├── study_buddy_backend.py    # FastAPI backend server
├── client/                   # React frontend
│   └── src/
│       ├── components/      # React components
│       ├── lib/             # API client and utilities
│       └── contexts/         # React contexts
├── server/                   # Express server (optional)
├── requirements.txt          # Python dependencies
├── package.json              # Node.js dependencies
└── SETUP.md                  # Detailed setup guide
```

### Development

The backend auto-reloads when code changes. The frontend uses Vite's hot module replacement for instant updates.

### Notes

* Backend stores data in memory (not persisted)
* For production, use a database and vector store
* CORS is enabled for all origins in development

### License

MIT
