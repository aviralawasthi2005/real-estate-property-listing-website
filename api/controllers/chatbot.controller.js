import { GoogleGenerativeAI } from '@google/generative-ai';
import { errorHandler } from '../utils/error.js';
import { config } from '../config/environment.js';

export const askChatbot = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return next(errorHandler(400, 'A valid message string is required.'));
    }

    if (message.length > 1000) {
      return next(errorHandler(400, 'Message exceeds the maximum limit of 1000 characters.'));
    }

    // Graceful fallback if Gemini API key is not configured
    if (!config.geminiApiKey) {
      return res.status(200).json({
        text: "I am your Real Estate AI Assistant. Our platform offers luxury, residential, and commercial properties for rent and sale. To unlock full real-time AI capabilities, please set GEMINI_API_KEY in the environment.",
        isFallback: true,
      });
    }

    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a helpful, knowledgeable, and polite real estate assistant for our platform called Real Estate.
Keep your answers brief (under 120 words), professional, and directly related to real estate, properties, buying, selling, or our platform.
Browsing and listing inquiries on our platform are completely free!
The user's message is: "${message.trim()}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      text,
      isFallback: false,
    });
  } catch (error) {
    console.error('[CHATBOT ERROR]', error.message);
    // Provide a graceful fallback on external API rate-limit or model error
    return res.status(200).json({
      text: "I'm currently receiving high traffic. Please feel free to browse our property catalog or contact property agents directly via chat!",
      isFallback: true,
    });
  }
};
