// backend/controllers/groqController.js
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.generateMessage = async (req, res) => {
  const { prompt } = req.body;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    res.json(chatCompletion.choices[0]?.message?.content || "No response");
  } catch (error) {
    console.error("Error generating message:", error);
    res.status(500).json({ error: "Error generating message" });
  }
};