const API_URL = 'http://localhost:8000/api/v1';

class ChatWidget {
    constructor() {
        this.messageHistory = [];
        this.template = `
            <div id="chat-widget" class="chat-widget">
                <button id="chat-button" class="chat-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>

                <div id="chat-container" class="chat-container">
                    <div class="chat-header">
                        <h3>Ina - Assistente Virtual</h3>
                        <button id="close-chat" class="close-chat">×</button>
                    </div>
                    <div id="chat-messages" class="chat-messages">
                        <div class="message bot-message">
                            Olá! Eu sou a Ina, como posso ajudar?
                        </div>
                        <div class="typing-indicator" id="typing-indicator">
                            Digitando...
                        </div>
                    </div>
                    <div class="chat-input">
                        <input type="text" id="user-input" placeholder="Digite sua mensagem...">
                        <button id="send-message">Enviar</button>
                    </div>
                </div>
            </div>
        `;

        this.styles = `
            .chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                font-family: Arial, sans-serif;
            }

            .chat-button {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: #0073aa;
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
            }

            .chat-button:hover {
                background-color: #005c8a;
            }

            .chat-container {
                position: fixed;
                bottom: 100px;
                right: 20px;
                width: 350px;
                height: 500px;
                border-radius: 15px;
                box-shadow: 0 5px 25px rgba(0,0,0,0.15);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }

            .chat-header {
                padding: 16px 20px;  
                background: linear-gradient(to right, #222627, #343839);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chat-header h3 {
                margin: 0;
                font-size: 15px;   
                font-weight: 500;  
            }

            .close-chat {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 4px;
                line-height: 1;    
                opacity: 0.8;      
                transition: opacity 0.2s; 
            }

            .close-chat:hover {
                opacity: 1;
                color:rgb(245, 43, 43);
            }

            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 24px;
                background: #222627;
            }

            .message {
                margin-bottom: 20px;
                max-width: 85%;
                padding: 14px 18px;
                border-radius: 16px;
                font-size: 14px;
                line-height: 1.5;
                box-shadow: 0 2px 8px rgba(0,0,0, 0.08);
            }

            .user-message {
                background:rgba(52, 56, 57, 0.6);
                color: white;
                margin-left: auto;
                border-bottom-right-radius: 0px;
            }

            .bot-message {
                background: #343839;
                color: white;
                margin-right: auto;
                border-bottom-left-radius: 0px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }

            .chat-input {
                padding: 16px;
                display: flex;
                gap: 12px;
                align-items: center;
                background: #252a2b;
            }

            .chat-input input {
                flex: 1;
                padding: 12px 16px;
                border: none;
                background: #343839;
                color: white;
                border-radius: 24px;
                font-size: 14px;
                outline: none;
            }

            .chat-input input::placeholder {
                border-color: rgba(255, 255, 255, 0.5);
            }

            #send-message {
                background: #83F4FC;
                color: #252a2b;
                border: none;
                border-radius: 24px;
                padding: 12px 24px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s ease;
            }

            #send-message:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(131, 244, 252, 0.2);
            }

           .typing-indicator {
                padding: 8px 12px;
                color: rgba(255, 255, 255, 0.7);  /* Texto semi-transparente */
                font-size: 13px;
                margin-bottom: 8px;
                display: none;
                font-style: italic;  /* Opcional, para diferenciar das mensagens */
            }
        `;
    }

    init() {
        // Adiciona estilos
        const styleSheet = document.createElement("style");
        styleSheet.textContent = this.styles;
        document.head.appendChild(styleSheet);

        // Adiciona HTML
        const chatRoot = document.getElementById('chat-root');
        if (chatRoot) {
            chatRoot.innerHTML = this.template;
        } else {
            const div = document.createElement('div');
            div.innerHTML = this.template;
            document.body.appendChild(div.firstChild);
        }

        // Elementos do DOM
        this.chatButton = document.getElementById('chat-button');
        this.chatContainer = document.getElementById('chat-container');
        this.closeChat = document.getElementById('close-chat');
        this.messagesContainer = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-message');
        this.typingIndicator = document.getElementById('typing-indicator');

        // Event listeners
        this.chatButton.addEventListener('click', () => this.toggleChat());
        this.closeChat.addEventListener('click', () => this.closeWindow());
        this.sendButton.addEventListener('click', () => this.handleSend());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSend();
        });
    }

    toggleChat() {
        const isHidden = this.chatContainer.style.display === 'none' || !this.chatContainer.style.display;
        this.chatContainer.style.display = isHidden ? 'flex' : 'none';
        if (isHidden) {
            this.userInput.focus();
        }
    }

    closeWindow() {
        this.chatContainer.style.display = 'none';
    }

    addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        if (isUser) {
            messageDiv.textContent = text;
        } else {
            messageDiv.innerHTML = text.replace(/\n/g, '<br>');
        }
        
        this.messagesContainer.appendChild(messageDiv);
        
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    toggleTyping(show) {
        
        const existingIndicator = document.getElementById('typing-indicator');
        if(existingIndicator) {
            existingIndicator.remove();
        }

        if (show) {
            const indicator = document.createElement('div');
            indicator.id = 'typing-indicator';
            indicator.className = 'typing-indicator';
            indicator.textContent = 'Digitando...';
            indicator.style.display = 'block';

            this.messagesContainer.appendChild(indicator);
        }

        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

    }

    async sendToAPI(message) {
        try {
            this.messageHistory.push({
                role: 'user',
                content: message
            });
    
            this.toggleTyping(true);
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: this.messageHistory
                }),
            });
            const data = await response.json();
    
            this.messageHistory.push({
                role: 'assistant',
                content: data.response
            });
    
            this.toggleTyping(false);
            return data.response;
        } catch (error) {
            console.error('Erro ao chamar API:', error);
            this.toggleTyping(false);
            return 'Desculpe, ocorreu um erro ao processar sua mensagem.';
        }
    }

    async handleSend() {
        const message = this.userInput.value.trim();
        if (!message) return;

        this.userInput.value = '';
        this.addMessage(message, true);

        const response = await this.sendToAPI(message);
        this.addMessage(response);
    }
}

export default ChatWidget;

