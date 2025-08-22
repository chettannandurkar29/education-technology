import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// ------------------ CONFIGURATION ------------------
const API_KEY = "AIzaSyATyqoNXa1DCgqQgkKN5Atu8-m4SBwNJKM"; // <-- PASTE YOUR KEY HERE

const SYSTEM_INSTRUCTION = "You are StudyBot, a helpful AI assistant specializing in Math, Science, English, and Computer Science. Provide clear, accurate, and well-explained answers. Format your answers for readability, using lists, bold text, and newlines where appropriate.";

// ------------------ DOM ELEMENTS ------------------
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatMessages = document.getElementById("chat-messages");

// ------------------ AI INITIALIZATION ------------------
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
});

const chat = model.startChat({
  history: [],
  generationConfig: { maxOutputTokens: 1000 },
});

// ------------------ EVENT LISTENERS ------------------
chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userProblem = userInput.value.trim();
    if (!userProblem) return;

    addMessage(userProblem, "user");
    userInput.value = "";

    const loadingIndicator = addMessage("Thinking", "bot", true);
    
    try {
        const result = await chat.sendMessage(userProblem);
        const response = result.response;
        const text = response.text();

        loadingIndicator.remove();
        addMessage(text, "bot");
    } catch (error) {
        loadingIndicator.remove();
        addMessage("Sorry, something went wrong. Please try again.", "bot");
        console.error("AI Error:", error);
    }
});

// ------------------ HELPER FUNCTIONS ------------------
function addMessage(text, sender, isLoading = false) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", `${sender}-message`);
    if (isLoading) {
        messageElement.classList.add("loading");
    }

    const p = document.createElement("p");
    p.innerText = text;
    messageElement.appendChild(p);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageElement;
}