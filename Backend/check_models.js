import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function checkAvailableModels() {
    console.log("🔍 Asking Google for available models...");
    
    // We fetch the list of ALL models available to your key
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            console.error("❌ Google Error:", data.error.message);
            return;
        }

        if (!data.models) {
            console.error("❌ No models found. Your API Key might be invalid or project is empty.");
            return;
        }

        console.log("\n✅ SUCCESS! Google says you can use these models:");
        console.log("------------------------------------------------");
        data.models.forEach(m => {
            // We only care about models that support 'generateContent'
            if (m.supportedGenerationMethods.includes("generateContent")) {
                console.log(`Model Name: ${m.name.replace('models/', '')}`);
            }
        });
        console.log("------------------------------------------------");
        console.log("Use one of the names above in your geminiAI.js file.");

    } catch (error) {
        console.error("Network Error:", error.message);
    }
}

checkAvailableModels();