import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getBotReply = async (userMessage) => {
  console.log("chatbot controller: ", userMessage)
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or gpt-4
      messages: [{ role: "user", content: userMessage }],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Bot reply error:", error.message);
    return "Sorry, I'm having trouble responding right now.";
  }
};
