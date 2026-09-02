import { Agent, run, setDefaultOpenAIClient, setOpenAIAPI, setTracingDisabled } from "@openai/agents";
import OpenAI from "openai";


const client = new OpenAI({ apiKey: '', baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/" });

setDefaultOpenAIClient(client);

// Gemini OpenAI-compatible endpoint Chat Completions support karta hai
setOpenAIAPI("chat_completions");

// Gemini key OpenAI tracing ke liye valid nahi hogi
setTracingDisabled(true);


const agent = new Agent({
    name: 'History Tutor',
    instructions: 'You provide assistance with historical queries. Explain important events and context clearly.',

});

async function main() {
    try {
        const result = await run(agent, "When did sharks first appear?");
        console.log(result.finalOutput);
    } catch (error) {
        console.error("Agent execution failed:", error);
        process.exitCode = 1;
    }
}

main();
