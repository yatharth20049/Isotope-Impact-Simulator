const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

exports.chatBot = async (req, res) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({
      status: 'error',
      message: 'User input is required'
    });
  }

  try {
    const isotopeAdvisorPrompt = `
  Professional Context:
  - You are an expert in applied nuclear science, with in-depth knowledge of radioisotopes used in medicine, industry, agriculture, and space.
  - Your role is to provide accurate, insightful, and practical information about specific isotopes, their properties, applications, production methods, and safety considerations.

  User Intent:
  - Help the user understand specific isotopes like Iodine-123, Cobalt-60, Technetium-99m, etc.
  - Explain isotope usage in real-world applications such as cancer treatment, food irradiation, spacecraft power systems, and soil studies.
  - Clarify how isotopes are produced (e.g., via nuclear reactors or cyclotrons) and their decay mechanisms.
  - Guide users on safety protocols, byproducts, and cross-domain use of isotopes.

  Response Guidelines:
  - Begin with a short summary of the user's query.
  - Provide a clear, factual, and structured explanation using domain-specific terminology where appropriate.
  - Include production methods, number of protons/neutrons, decay path, and emitted radiation type if relevant.
  - Highlight multi-domain usage (e.g., Cobalt-60 used in medicine, industry, and agriculture).
  - Suggest additional resources or next steps for deeper learning or implementation.

  User Query: ${userInput}
`;


    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


    const result = await model.generateContent(isotopeAdvisorPrompt);
    const aiResponse = result.response.text();
    const formattedResponse = formatResponse(aiResponse);

    res.json({
      status: 'success',
      input: userInput,
      response: formattedResponse,
      confidence: 'high',
      sourceFramework: 'Coal Carbon Management Expertise'
    });
  } catch (error) {
    console.error('Error generating professional insights:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Professional insight generation failed',
      errorDetails: error.message.includes('model') ? 'The specified model is not available. Please check the Gemini API documentation for supported models.' : error.message
    });
  }
};

function formatResponse(aiResponse) {
  aiResponse = aiResponse.replace(/\\n/g, '').trim();
  const sections = aiResponse.split('\n\n');
  let formattedResponse = '';

  sections.forEach(section => {
    if (section.startsWith('**') || section.match(/^[A-Za-z\s]+:/)) {
      formattedResponse += `<h3>${section.replace(/\*\*/g, '').trim()}</h3>`;
    } else if (section.trim().startsWith('-') || section.trim().startsWith('*')) {
      const bulletPoints = section.split('\n').map(point => point.replace(/^-|\*/g, '').trim());
      formattedResponse += '<ul>';
      bulletPoints.forEach(point => {
        if (point) formattedResponse += `<li>${point}</li>`;
      });
      formattedResponse += '</ul>';
    } else {
      formattedResponse += `<p>${section.trim()}</p>`;
    }
  });

  return formattedResponse;
}