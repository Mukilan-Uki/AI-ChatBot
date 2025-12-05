        // ========================
        // AI KNOWLEDGE BASE
        // ========================
        const aiKnowledge = {
            // Greeting responses
            greetings: [
                "Hello! I'm your AI assistant. How can I help you today?",
                "Hi there! I'm here to assist you with anything you need.",
                "Greetings! I'm ready to help. What can I do for you?",
                "Hey! Nice to meet you. How can I assist you today?",
                "Welcome! I'm your AI helper. What brings you here?"
            ],
            
            // Farewell responses
            farewells: [
                "Goodbye! Have a great day!",
                "See you later! Feel free to return anytime.",
                "Farewell! It was nice chatting with you.",
                "Take care! Don't hesitate to ask if you need more help.",
                "Bye! Remember, I'm always here to help."
            ],
            
            // Portfolio related queries
            portfolio: {
                about: "I'm an AI assistant created to help visitors interact with this portfolio website. I can tell you about the portfolio owner's skills, projects, and experience.",
                skills: "The portfolio owner has expertise in: Frontend Development (HTML, CSS, JavaScript, React), Backend Development (Node.js, Express), UI/UX Design, and various development tools.",
                projects: "Some notable projects include: To-Do List Website, Ghost Animation Platform, Hello There Landing Page, and Ukis Dreamspace Portfolio.",
                experience: "With over 500 hours of working experience and a strong problem-solving ability, the portfolio owner is ready to tackle challenging projects.",
                contact: "You can contact the portfolio owner through the contact form on the website or via email. Would you like me to direct you to the contact section?"
            },
            
            // Technical knowledge
            tech: {
                javascript: "JavaScript is a versatile programming language used for both frontend and backend development. It's the language that powers interactive websites.",
                react: "React is a popular JavaScript library for building user interfaces, particularly single-page applications.",
                nodejs: "Node.js allows JavaScript to run on the server side, enabling full-stack JavaScript development.",
                html: "HTML is the standard markup language for creating web pages and web applications.",
                css: "CSS is used for styling HTML elements and creating visually appealing web pages.",
                bootstrap: "Bootstrap is a CSS framework that helps in creating responsive and mobile-first websites quickly."
            },
            
            // General conversation
            general: {
                how_are_you: "I'm functioning perfectly! Thanks for asking. How can I assist you today?",
                who_are_you: "I'm an AI chatbot designed to assist visitors on this portfolio website. I can answer questions about the portfolio, technology, and help you navigate the site.",
                what_can_you_do: "I can: 1) Answer questions about the portfolio 2) Explain technical concepts 3) Help navigate the website 4) Provide information about projects 5) Assist with general queries",
                thank_you: "You're welcome! I'm glad I could help. Is there anything else you'd like to know?",
                help: "I can help you with: Portfolio information, Technical explanations, Project details, Website navigation, Answering general questions. Just ask me anything!"
            },
            
            // Default responses for unknown queries
            default: [
                "That's an interesting question. Could you rephrase it or ask something else?",
                "I'm not sure I understand. Could you clarify your question?",
                "I'm still learning about that topic. Maybe ask me about the portfolio or web development?",
                "Let me think about that... Actually, why don't you ask me about the portfolio projects instead?",
                "I don't have enough information about that yet. Try asking me about web development or the portfolio!"
            ]
        };
        
        // ========================
        // CONVERSATION HISTORY
        // ========================
        let conversationHistory = [];
        
        // ========================
        // DOM ELEMENTS
        // ========================
        const chatMessages = document.getElementById('chatMessages');
        const userInput = document.getElementById('userInput');
        const sendBtn = document.getElementById('sendBtn');
        const clearBtn = document.getElementById('clearBtn');
        const suggestionsDiv = document.getElementById('suggestions');
        
        // ========================
        // INITIALIZE CHAT
        // ========================
        function initializeChat() {
            // Load conversation history from localStorage
            const savedHistory = localStorage.getItem('aiChatHistory');
            if (savedHistory) {
                conversationHistory = JSON.parse(savedHistory);
                renderHistory();
            } else {
                // Initial bot greeting
                setTimeout(() => {
                    const greeting = getRandomResponse(aiKnowledge.greetings);
                    addBotMessage(greeting, true);
                }, 1000);
            }
            
            // Initialize quick suggestions
            initializeSuggestions();
            
            // Set up event listeners
            sendBtn.addEventListener('click', sendMessage);
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
            
            clearBtn.addEventListener('click', clearChat);
        }
        
        // ========================
        // QUICK SUGGESTIONS
        // ========================
        function initializeSuggestions() {
            const quickQuestions = [
                "Tell me about the portfolio",
                "What skills do you have?",
                "Show me the projects",
                "How can I contact you?",
                "What is React?",
                "Who created you?"
            ];
            
            suggestionsDiv.innerHTML = '';
            quickQuestions.forEach(question => {
                const btn = document.createElement('button');
                btn.textContent = question;
                btn.className = 'suggestion-btn';
                btn.onclick = () => {
                    userInput.value = question;
                    sendMessage();
                };
                suggestionsDiv.appendChild(btn);
            });
        }
        
        // ========================
        // MESSAGE HANDLING
        // ========================
        function sendMessage() {
            const message = userInput.value.trim();
            if (!message) return;
            
            // Add user message to chat
            addUserMessage(message);
            
            // Clear input
            userInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Process message after delay (simulating thinking)
            setTimeout(() => {
                removeTypingIndicator();
                const response = generateAIResponse(message);
                addBotMessage(response, true);
            }, getRandomDelay(800, 2000));
        }
        
        // ========================
        // AI RESPONSE GENERATION
        // ========================
        function generateAIResponse(userMessage) {
            const message = userMessage.toLowerCase();
            
            // Add to conversation history
            conversationHistory.push({
                type: 'user',
                content: userMessage,
                timestamp: new Date().toISOString()
            });
            
            // Check for greetings
            if (message.match(/\b(hi|hello|hey|greetings|good morning|good afternoon)\b/)) {
                return getRandomResponse(aiKnowledge.greetings);
            }
            
            // Check for farewells
            if (message.match(/\b(bye|goodbye|see you|farewell|exit|quit)\b/)) {
                return getRandomResponse(aiKnowledge.farewells);
            }
            
            // Check for thank you
            if (message.match(/\b(thanks|thank you|appreciate)\b/)) {
                return aiKnowledge.general.thank_you;
            }
            
            // Check for "how are you"
            if (message.match(/\b(how are you|how do you do|how's it going)\b/)) {
                return aiKnowledge.general.how_are_you;
            }
            
            // Check for "who are you"
            if (message.match(/\b(who are you|what are you|your name)\b/)) {
                return aiKnowledge.general.who_are_you;
            }
            
            // Check for "what can you do"
            if (message.match(/\b(what can you do|your capabilities|help me)\b/)) {
                return aiKnowledge.general.what_can_you_do;
            }
            
            // Portfolio queries
            if (message.match(/\b(portfolio|about portfolio|show portfolio)\b/)) {
                return aiKnowledge.portfolio.about;
            }
            
            if (message.match(/\b(skills|technologies|what do you know)\b/)) {
                return aiKnowledge.portfolio.skills;
            }
            
            if (message.match(/\b(projects|show projects|your work)\b/)) {
                return aiKnowledge.portfolio.projects;
            }
            
            if (message.match(/\b(experience|background|history)\b/)) {
                return aiKnowledge.portfolio.experience;
            }
            
            if (message.match(/\b(contact|email|phone|reach you)\b/)) {
                return aiKnowledge.portfolio.contact;
            }
            
            // Technical queries
            const techTerms = Object.keys(aiKnowledge.tech);
            for (const term of techTerms) {
                if (message.includes(term)) {
                    return aiKnowledge.tech[term];
                }
            }
            
            // Default response
            return getRandomResponse(aiKnowledge.default);
        }
        
        // ========================
        // MESSAGE DISPLAY FUNCTIONS
        // ========================
        function addUserMessage(message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message user-message';
            
            const contentDiv = document.createElement('div');
            contentDiv.textContent = message;
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'timestamp user-timestamp';
            timeDiv.textContent = getCurrentTime();
            
            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(timeDiv);
            chatMessages.appendChild(messageDiv);
            
            // Save to history
            conversationHistory.push({
                type: 'user',
                content: message,
                timestamp: new Date().toISOString()
            });
            
            // Scroll to bottom
            scrollToBottom();
            saveHistory();
        }
        
        function addBotMessage(message, withTypingEffect = false) {
            if (withTypingEffect) {
                typeMessage(message);
            } else {
                displayBotMessage(message);
            }
            
            // Save to history
            conversationHistory.push({
                type: 'bot',
                content: message,
                timestamp: new Date().toISOString()
            });
            
            saveHistory();
        }
        
        function displayBotMessage(message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot-message';
            
            const avatarSpan = document.createElement('span');
            avatarSpan.className = 'bot-avatar';
            avatarSpan.textContent = 'AI';
            
            const contentDiv = document.createElement('div');
            contentDiv.textContent = message;
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'timestamp bot-timestamp';
            timeDiv.textContent = getCurrentTime();
            
            messageDiv.appendChild(avatarSpan);
            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(timeDiv);
            chatMessages.appendChild(messageDiv);
            
            scrollToBottom();
        }
        
        // ========================
        // TYPING EFFECT
        // ========================
        function typeMessage(message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot-message';
            
            const avatarSpan = document.createElement('span');
            avatarSpan.className = 'bot-avatar';
            avatarSpan.textContent = 'AI';
            
            const contentDiv = document.createElement('div');
            contentDiv.id = 'typingContent';
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'timestamp bot-timestamp';
            timeDiv.textContent = getCurrentTime();
            
            messageDiv.appendChild(avatarSpan);
            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(timeDiv);
            chatMessages.appendChild(messageDiv);
            
            let i = 0;
            const speed = 30; // typing speed in milliseconds
            
            function typeWriter() {
                if (i < message.length) {
                    contentDiv.textContent += message.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                    scrollToBottom();
                }
            }
            
            typeWriter();
        }
        
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'typing-indicator';
            typingDiv.id = 'typingIndicator';
            
            for (let i = 0; i < 3; i++) {
                const dot = document.createElement('div');
                dot.className = 'typing-dot';
                typingDiv.appendChild(dot);
            }
            
            chatMessages.appendChild(typingDiv);
            scrollToBottom();
        }
        
        function removeTypingIndicator() {
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }
        
        // ========================
        // UTILITY FUNCTIONS
        // ========================
        function getRandomResponse(responses) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        function getRandomDelay(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        function getCurrentTime() {
            const now = new Date();
            return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        function scrollToBottom() {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        function saveHistory() {
            // Keep only last 50 messages to prevent localStorage overflow
            if (conversationHistory.length > 50) {
                conversationHistory = conversationHistory.slice(-50);
            }
            localStorage.setItem('aiChatHistory', JSON.stringify(conversationHistory));
        }
        
        function renderHistory() {
            chatMessages.innerHTML = '';
            conversationHistory.forEach(msg => {
                if (msg.type === 'user') {
                    addUserMessage(msg.content);
                } else {
                    displayBotMessage(msg.content);
                }
            });
            scrollToBottom();
        }
        
        function clearChat() {
            if (confirm('Are you sure you want to clear the chat history?')) {
                conversationHistory = [];
                chatMessages.innerHTML = '';
                localStorage.removeItem('aiChatHistory');
                
                // Send new greeting
                setTimeout(() => {
                    const greeting = getRandomResponse(aiKnowledge.greetings);
                    addBotMessage(greeting, true);
                }, 1000);
            }
        }
        
        // ========================
        // ADDITIONAL AI FEATURES
        // ========================
        // Context awareness
        function getContext() {
            if (conversationHistory.length < 2) return null;
            
            const lastTwo = conversationHistory.slice(-2);
            return {
                lastUserMessage: lastTwo.find(msg => msg.type === 'user')?.content || '',
                lastBotMessage: lastTwo.find(msg => msg.type === 'bot')?.content || ''
            };
        }
        
        // Learning from conversation (basic)
        function learnFromConversation(userMessage, botResponse) {
            // Simple learning - could be extended with more sophisticated logic
            console.log('Learning from conversation:', { userMessage, botResponse });
        }
        
        // ========================
        // ADVANCED RESPONSE PATTERNS
        // ========================
        const responsePatterns = [
            {
                pattern: /\b(how to|tutorial|guide|learn)\b.*\b(react|javascript|node|html|css)\b/i,
                response: "I'd be happy to help you learn about that! There are many great resources available online. Would you like me to recommend some?"
            },
            {
                pattern: /\b(problem|error|issue|not working|help me fix)\b/i,
                response: "I can try to help you troubleshoot. Can you describe the problem in more detail?"
            },
            {
                pattern: /\b(weather|time|date|news)\b/i,
                response: "I'm focused on portfolio and technical questions right now. You might want to check other sources for that information."
            },
            {
                pattern: /\b(joke|funny|entertain me)\b/i,
                response: "Why don't programmers like nature? It has too many bugs! 😄 What else can I help you with?"
            }
        ];
        
        // ========================
        // INITIALIZE ON LOAD
        // ========================
        document.addEventListener('DOMContentLoaded', initializeChat);
        
        // ========================
        // KEYBOARD SHORTCUTS
        // ========================
        document.addEventListener('keydown', (e) => {
            // Ctrl + Enter to send
            if (e.ctrlKey && e.key === 'Enter') {
                sendMessage();
            }
            
            // Escape to clear input
            if (e.key === 'Escape') {
                userInput.value = '';
                userInput.focus();
            }
            
            // Up arrow for history (basic implementation)
            if (e.key === 'ArrowUp' && userInput.value === '') {
                const lastUserMessage = conversationHistory
                    .filter(msg => msg.type === 'user')
                    .pop();
                if (lastUserMessage) {
                    userInput.value = lastUserMessage.content;
                }
            }
        });
        
        // ========================
        // ERROR HANDLING
        // ========================
        window.addEventListener('error', (e) => {
            console.error('Chatbot error:', e.error);
            addBotMessage("I encountered an error. Please try again or refresh the page.", false);
        });
        
        // ========================
        // ENHANCED AI FEATURES
        // ========================
        // Sentiment analysis (basic)
        function analyzeSentiment(text) {
            const positiveWords = ['good', 'great', 'awesome', 'excellent', 'happy', 'thanks', 'thank'];
            const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'angry', 'sad', 'disappointed'];
            
            const words = text.toLowerCase().split(' ');
            let score = 0;
            
            words.forEach(word => {
                if (positiveWords.includes(word)) score += 1;
                if (negativeWords.includes(word)) score -= 1;
            });
            
            if (score > 0) return 'positive';
            if (score < 0) return 'negative';
            return 'neutral';
        }
        
        // Response enhancement based on sentiment
        function enhanceResponseBasedOnSentiment(response, sentiment) {
            if (sentiment === 'positive') {
                return response + " 😊 I'm glad you're finding this helpful!";
            } else if (sentiment === 'negative') {
                return response + " 🙁 I'm sorry if this isn't what you were looking for. Can I help with something else?";
            }
            return response;
        }