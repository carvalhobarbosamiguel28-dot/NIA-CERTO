// netlify/functions/ai.js
const { GoogleGenAI } = require("@google/genai");

exports.handler = async function(event, context) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
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
        // Ignora erro de parse se o body vier vazio ou mal formatado
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: promptUser,
    });

    // Pega o texto da resposta de forma ultra segura para o SDK novo
    let textResult = "";
    if (typeof response.text === 'string') {
      textResult = response.text;
    } else if (response.candidates && response.candidates[0]?.content?.parts[0]?.text) {
      textResult = response.candidates[0].content.parts[0].text;
    } else {
      textResult = JSON.stringify(response); // Para debug caso venha em formato diferente
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: textResult }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
