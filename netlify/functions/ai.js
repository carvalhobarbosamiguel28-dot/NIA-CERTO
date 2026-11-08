// netlify/functions/ai.js
const { GoogleGenAI } = require("@google/genai");

exports.handler = async function(event, context) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Chave da API não configurada no Netlify." }),
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    let promptUser = "Resuma as principais notícias de Inteligência Artificial de hoje focando em ChatGPT e Claude.";
    if (event.body) {
      try {
        const data = JSON.parse(event.body);
        if (data.prompt) promptUser = data.prompt;
      } catch (e) {
        // Usa o prompt padrão se o body falhar
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: promptUser,
    });

    // Pega o texto da resposta garantindo que nunca vá vazio
    const textResult = response.text || 
                       response.candidates?.[0]?.content?.parts?.[0]?.text || 
                       "Nenhuma resposta gerada pela IA.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: textResult }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
