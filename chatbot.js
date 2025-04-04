document.addEventListener('DOMContentLoaded', function () {
    const chatbot = {
        init() {
            this.toggle = document.getElementById('chatbot-toggle');
            this.popup = document.getElementById('chatbot-popup');
            this.messages = document.getElementById('chatbot-messages');
            this.input = document.getElementById('chatbot-input');
            this.sendBtn = document.getElementById('send-message');
            this.setupEvents();
        },

        setupEvents() {
            this.toggle.addEventListener('click', () => this.toggleChat());
            document.querySelector('.close-chatbot').addEventListener('click', () => this.closeChat());
            this.sendBtn.addEventListener('click', (e) => this.sendMessage(e));
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage(e);
            });
        },

        async sendMessage(e) {
            e.preventDefault();
            const message = this.input.value.trim();
            if (!message) return;

            this.addMessage(message, 'user');
            this.input.value = '';
            const typing = this.showTyping();

            try {
                const response = await fetch('http://localhost:3000/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message })
                });

                if (!response.ok) throw new Error(`API Error: ${response.status}`);

                const data = await response.json();
                this.addMessage(data.reply, 'bot');
            } catch (error) {
                console.error('Chatbot error:', error);
                this.addMessage("I'm having trouble connecting. Please try again later.", 'bot');
            } finally {
                typing.remove();
            }
        },

        addMessage(text, sender) {
            const div = document.createElement('div');
            div.className = `${sender}-message`;
            div.innerHTML = `<p>${text}</p>`;
            this.messages.appendChild(div);
            this.messages.scrollTop = this.messages.scrollHeight;
        },

        showTyping() {
            const div = document.createElement('div');
            div.className = 'bot-message typing';
            div.innerHTML = `
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            this.messages.appendChild(div);
            this.messages.scrollTop = this.messages.scrollHeight;
            return div;
        },

        toggleChat() {
            this.popup.classList.toggle('active');
            this.input.focus();
        },

        closeChat() {
            this.popup.classList.remove('active');
        }
    };

    chatbot.init();
});
