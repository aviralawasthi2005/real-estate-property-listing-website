import { GoogleGenerativeAI } from '@google/generative-ai';
import { errorHandler } from '../utils/error.js';

export const askChatbot = async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return next(errorHandler(400, 'Message is required'));
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a helpful and polite real estate assistant for our platform called Real Estate.
Keep your answers brief, professional, and directly related to real estate, properties, buying, selling, or our platform. 
If someone asks about the price, let them know browsing is completely free!
The user's message is: "${message}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text });
  } catch (error) {
    console.error('Chatbot error:', error);
    next(error);
  }
};
