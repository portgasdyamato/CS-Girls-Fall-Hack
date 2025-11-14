import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import chatRouter from "./routes/chat";
import { generateAIResponse } from "./services/aiService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Gemini AI chat endpoint
  app.post("/api/chat/message", async (req, res) => {
    try {
      const { message, studyMode, language } = req.body;

      // Validate input
      if (!message || typeof message !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Message is required and must be a string',
        });
      }

      // Validate study mode
      const validStudyModes = ['active-learning', 'break-mode', 'focused', 'review'];
      const validatedStudyMode = validStudyModes.includes(studyMode) 
        ? studyMode 
        : 'active-learning';

      // Validate language
      const validLanguages = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'hi', 'ar'];
      const validatedLanguage = validLanguages.includes(language)
        ? language
        : 'en';

      // Generate AI response using Gemini
      const aiResponse = await generateAIResponse(
        message,
        validatedStudyMode,
        validatedLanguage
      );

      res.json({
        success: true,
        response: aiResponse,
        timestamp: new Date().toISOString(),
        studyMode: validatedStudyMode,
        language: validatedLanguage,
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate response. Please try again.',
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      gemini: !!process.env.GEMINI_API_KEY,
    });
  });

  // mount API routers under /api
  app.use("/api", chatRouter);

  // other routes can be mounted here, for example:
  // app.use("/api/sessions", sessionsRouter);
  // use `storage` for CRUD as needed

  const httpServer = createServer(app);
  return httpServer;
}