import axios from 'axios';

export const getBotReply = async (userMessage) => {
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const headers = {
      "Content-Type": "application/json",
    };

    const data = {
      contents: [
        {
          parts: [
            {
              text: userMessage,
            },
          ],
        },
      ],
    };

    const response = await axios.post(endpoint, data, { headers });

    const botReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return botReply || "Sorry, I couldn't understand that.";
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    return "Sorry, I'm currently unable to respond. Please try again later.";
  }
};