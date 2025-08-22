// This import is how we get the Google AI SDK into our browser code
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// ------------------ CONFIGURATION ------------------
// 🚨 IMPORTANT: Follow the instructions to get your own API key
const API_KEY = "AIzaSyATyqoNXa1DCgqQgkKN5Atu8-m4SBwNJKM"; // <-- PASTE YOUR KEY HERE

// This is the "system instruction" that trains the bot
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

// The `startChat` method lets us have a continuous conversation
const chat = model.startChat({
  history: [],
  generationConfig: {
    maxOutputTokens: 1000,
  },
});


// ------------------ EVENT LISTENERS ------------------
chatForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    
    const userProblem = userInput.value.trim();
    if (!userProblem) return; // Don't send empty messages

    // 1. Add user's message to the chat
    addMessage(userProblem, "user");

    // 2. Clear the input field
    userInput.value = "";

    // 3. Show a loading indicator for the bot's response
    const loadingIndicator = addMessage("Thinking", "bot", true);
    
    try {
        // 4. Send the user's message to the AI and get the response
        const result = await chat.sendMessage(userProblem);
        const response = result.response;
        const text = response.text();

        // 5. Remove the loading indicator
        loadingIndicator.remove();
        
        // 6. Add the bot's actual response to the chat
        addMessage(text, "bot");

    } catch (error) {
        // 7. Handle errors
        loadingIndicator.remove();
        addMessage("Sorry, something went wrong. Please try again.", "bot");
        console.error("AI Error:", error);
    }
});


// ------------------ HELPER FUNCTIONS ------------------

/**
 * Adds a message to the chat interface.
 * @param {string} text - The message content.
 * @param {string} sender - 'user' or 'bot'.
 * @param {boolean} [isLoading=false] - If true, adds a loading class.
 * @returns {HTMLElement} The created message element.
 */
function addMessage(text, sender, isLoading = false) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", `${sender}-message`);

    if (isLoading) {
        messageElement.classList.add("loading");
    }

    const p = document.createElement("p");
    // Using innerText is safer than innerHTML to prevent XSS attacks
    p.innerText = text;
    messageElement.appendChild(p);

    chatMessages.appendChild(messageElement);

    // Scroll to the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageElement;
}
