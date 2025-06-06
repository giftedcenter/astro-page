const fetch = require("node-fetch");

const OUI_API_KEY = process.env.OUI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

exports.handler = async function (event) {
  try {
    const { messages } = JSON.parse(event.body);

    const userInput = messages[messages.length - 1]?.content ?? "";
    const systemPrompt = {
  role: "system",
  content: "You are an intelligent, concise, and helpful assistant for GiftedCenter.org, a modern tutoring and enrichment platform operated by Ashiful Institute. You provide visitors with clear, friendly, and accurate information about all available services. These include: 1) personalized tutoring in Math, Science, English, and Computer Science for Grades 1–12 and early university; 2) enrichment programs such as the Summer Training Camp (Python, web dev, data science), the Olympiad Math Camp, the AI Literacy Course (non-coding), and the University Prep & Career Guidance Program. You can answer questions about session formats, eligibility, pricing, trial options, and registration. When appropriate, encourage users to explore pages, sign up for programs, or contact Gifted Center for personalized recommendations. Always remain supportive, informative, and aligned with the values of educational empowerment and student growth."
};

const fullMessages = [systemPrompt, ...messages];

    // === 1. Try OpenUI with 5s timeout ===
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 5 seconds
    
      const ouiRes = await fetch("https://oui.gpu.garden/api/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OUI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
        model: "gemma3:1b-it-fp16",
        messages: fullMessages
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      const contentType = ouiRes.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await ouiRes.text();
        throw new Error(`OpenUI returned non-JSON: ${errorText}`);
      }

      const ouiData = await ouiRes.json();
      const output = ouiData?.choices?.[0]?.message?.content;

      if (output && output.trim()) {
        return {
          statusCode: 200,
          body: JSON.stringify({ text: output, model: "openui-gemma3" })
        };
      }

      throw new Error("OpenUI returned no usable output.");
    } catch (ouiErr) {
      console.warn("[OpenUI fallback triggered]:", ouiErr.name === "AbortError" ? "Timeout after 5s" : ouiErr.message);
    }

    // === 2. Gemini Fallback (REST) ===
    try {
      // Convert messages into a single prompt string (Linux-style log)
      console.log("Model used:", "openui-gemma3");
      const prompt = messages.map(m =>
        m.role === "user"
          ? ` ${m.content}`
          : ` ${m.content}`
      ).join("\n");

      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are helpful assistant. \n\n${prompt}`
                }
              ]
            }
          ]
        })
      });

      const geminiData = await geminiRes.json();
      const geminiOutput =
        geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "[Gemini returned no usable output]";

      return {
        statusCode: 200,
        body: JSON.stringify({ text: geminiOutput, model: "gemini" })
      };
    } catch (geminiErr) {
      console.error("[Gemini Fallback Error]:", geminiErr.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ text: "All systems failed. Try again later." })
      };
    }

  } catch (fatalErr) {
    console.error("[Fatal LLM Router Error]:", fatalErr.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ text: "Fatal error: " + fatalErr.message })
    };
    
  }
}
