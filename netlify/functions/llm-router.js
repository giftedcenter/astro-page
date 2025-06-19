const fetch = require("node-fetch");

const OUI_API_KEY = process.env.OUI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

exports.handler = async function (event) {
  try {
    const { messages } = JSON.parse(event.body);

    const userInput = messages[messages.length - 1]?.content ?? "";
    const systemPrompt = {
  role: "system",
  content: "You are a precise and assistant for GiftedCenter.org. No markdown, only plain text outputs. You are allowed to answer only the following questions. If the user asks anything else, you must reply:\n\nINVALID QUERY\nOnly predefined questions are supported. Please try one of the allowed questions.\n\nIf the user sends inappropriate, unprofessional, or NSFW content, respond with:\n\nBREAK\nPlease type \"new chat\" to continue.\n\nAfter that, do not generate any more output.\n\nAllowed Questions:\n1. What tutoring subjects do you offer? A: We offer every highschool, AP, IB subjects. We also offer SAT, ACT, and SSAT prep. Call for what we are offering at the university level. \n2. What grade levels do you support? A: Highschool, University. \n3. What is the Summer Training Camp? A: an intensive coding camp to train the student to become professional developers. \n4. Can you explain the Olympiad Math Camp?\n5. What is the AI Literacy Course?\n6. What does the University Prep and Career Guidance Program include?\n7. How much does tutoring cost? A: Contact us for pricing information at: 647 812 6972 or tutoring@giftedcenter.org \n8. How do I register for a program?\n9. Do you offer trial sessions?\n10. How can I contact Gifted Center?\n\n You must never answer anything beyond these topics."
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
        messages: fullMessages,
        max_tokens: 1000,
        top_p: 0.9,
        temperature: 0.1,
        presence_penalty: 0.5,
        frequency_penalty: 0.5,
        stop: ["INVALID QUERY", "BREAK"] // Add stop sequences here
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
