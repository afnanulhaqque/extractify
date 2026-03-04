/**
 * Premium Chat Modal Logic
 * Handles interactive features for the global chat component
 */

class ChatModal {
    constructor() {
        this.modal = document.getElementById('chatModal');
        this.fab = document.getElementById('fabBtn');
        this.closeBtn = document.getElementById('closeChatBtn');
        this.form = document.getElementById('chatForm');
        this.input = document.getElementById('chatInput');
        this.messagesContainer = document.getElementById('chatMessages');
        
        this.isBotTyping = false;
        this.autoReplies = [
            "I'd love to help you with that! Are you looking for specific data extraction features?",
            "Extractify can handle everything from simple lists to complex dynamic websites. What's your project about?",
            "Our team usually responds within minutes. In the meantime, have you checked our Lead Generation solutions?",
            "That sounds interesting! We offer custom scraper building for enterprises. Would you like to know more?"
        ];
        
        this.init();
    }

    init() {
        if (!this.modal || !this.fab) return;

        // Toggle Modal
        this.fab.addEventListener('click', () => this.toggleModal());
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Close on overlay click
        const overlay = this.modal.querySelector('.demo-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeModal());
        }

        // Handle Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Form Submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Pulse FAB after a delay
        setTimeout(() => {
            this.fab.classList.add('pulse');
        }, 3000);
        
        console.log('Chat Modal logic initialized');
    }

    toggleModal() {
        const isActive = this.modal.classList.contains('active');
        if (isActive) {
            this.closeModal();
        } else {
            this.openModal();
        }
    }

    openModal() {
        this.modal.classList.add('active');
        this.fab.classList.remove('pulse');
        document.body.classList.add('chat-open'); // Allow for page-wide styling if needed
        
        // Focus input after animation
        setTimeout(() => {
            if (this.input) this.input.focus();
        }, 400);

        // Add welcome message if empty
        if (this.messagesContainer && this.messagesContainer.children.length === 0) {
            this.addMessage("Hello! 👋 How can we help you today?", 'bot');
        }
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.classList.remove('chat-open');
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.input || this.isBotTyping) return;

        const text = this.input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        this.input.value = '';
        
        // Simulate bot response
        this.simulateBotResponse();
    }

    addMessage(text, sender) {
        if (!this.messagesContainer) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `message message-${sender}`;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;
        
        const time = document.createElement('span');
        time.className = 'message-time';
        const now = new Date();
        time.textContent = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        msgDiv.appendChild(content);
        msgDiv.appendChild(time);
        
        this.messagesContainer.appendChild(msgDiv);
        
        // Scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    simulateBotResponse() {
        this.isBotTyping = true;
        
        // Show typing indicator (simplified for now)
        setTimeout(() => {
            const reply = this.autoReplies[Math.floor(Math.random() * this.autoReplies.length)];
            this.addMessage(reply, 'bot');
            this.isBotTyping = false;
        }, 1500);
    }
}

// Global initialization
window.initChatModal = () => {
    window.extractifyChat = new ChatModal();
};
