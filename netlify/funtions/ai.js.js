// netlify/functions/ai.js
const { GoogleGenAI } = require("@google/genai");

exports.handler = async function(event, context) {
  // Pega a chave secreta que vamos salvar no painel do Netlify
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Chave da API não configurada no Netlify." }),
    };
  }

  try {
    // Inicializa o SDK oficial do Google Gen AI
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // Pega o prompt enviado pelo seu site (se houver)
    let promptUser = "Resuma as principais notícias de Inteligência Artificial de hoje focando em ChatGPT e Claude.";
    if (event.body) {
      const data = JSON.parse(event.body);
      if (data.prompt) promptUser = data.prompt;
    }

    // Chama o modelo Gemini Flash (rápido e gratuito)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptUser,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: response.text }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};