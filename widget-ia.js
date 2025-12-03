// widget-ia.js - Widget flutuante de IA (versão balão)

class AssistantWidget {
    constructor() {
        this.isOpen = false;
        this.chatHistory = [];
        this.initializeWidget();
    }

    initializeWidget() {
        // Verificar se o widget já existe
        if (document.getElementById('ai-assistant-widget')) {
            return;
        }
        
        // Criar elementos do widget
        this.createWidgetHTML();
        this.setupEventListeners();
        this.addWelcomeMessage();
    }

    createWidgetHTML() {
        // Criar container principal
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'ai-assistant-widget';
        widgetContainer.innerHTML = `
            <!-- Balão flutuante -->
            <div id="ai-assistant-bubble" class="ai-assistant-bubble">
                <div class="ai-bubble-content">
                    <span class="ai-bubble-text">Precisa de ajuda?</span>
                    <div class="ai-bubble-icon">?</div>
                </div>
                <div class="ai-bubble-tail"></div>
            </div>

            <!-- Interface do chat -->
            <div id="ai-assistant-chat" class="ai-assistant-chat hidden">
                <!-- Cabeçalho -->
                <div class="ai-chat-header">
                    <div class="ai-chat-title">
                        <i class="fas fa-robot"></i>
                        <h3>Assistente de Rotina</h3>
                    </div>
                    <button class="ai-close-btn" id="ai-close-chat">×</button>
                </div>

                <!-- Área de mensagens -->
                <div class="ai-chat-messages" id="ai-chat-messages">
                    <!-- Mensagens serão inseridas aqui -->
                </div>

                <!-- Input e botões -->
                <div class="ai-chat-input-area">
                    <div class="ai-quick-actions">
                        <button class="ai-quick-btn" data-action="rotina-matinal">
                            <i class="fas fa-sun"></i> Rotina
                        </button>
                        <button class="ai-quick-btn" data-action="gestao-tempo">
                            <i class="fas fa-clock"></i> Tempo
                        </button>
                        <button class="ai-quick-btn" data-action="organizar-tarefas">
                            <i class="fas fa-tasks"></i> Tarefas
                        </button>
                    </div>
                    
                    <div class="ai-input-container">
                        <input type="text" 
                               id="ai-user-input" 
                               placeholder="Pergunte sobre rotinas..."
                               autocomplete="off">
                        <button id="ai-send-btn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Adicionar ao body
        document.body.appendChild(widgetContainer);
        
        // Adicionar estilos
        this.addStyles();
    }

    addStyles() {
        const styleId = 'ai-assistant-styles';
        if (document.getElementById(styleId)) return;
        
        const styles = `
            /* Widget de Assistente IA - Versão Balão */
            #ai-assistant-widget {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            /* Balão flutuante */
            .ai-assistant-bubble {
                position: relative;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px 20px 20px 4px;
                padding: 16px 20px;
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                max-width: 180px;
                animation: bubbleFloat 3s ease-in-out infinite;
                transform-origin: bottom right;
            }

            @keyframes bubbleFloat {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(-5px) scale(1.02); }
            }

            .ai-assistant-bubble:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 10px 25px rgba(102, 126, 234, 0.5);
                animation-play-state: paused;
            }

            .ai-assistant-bubble:active {
                transform: translateY(0) scale(0.98);
            }

            /* Conteúdo do balão */
            .ai-bubble-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .ai-bubble-text {
                color: white;
                font-size: 15px;
                font-weight: 600;
                letter-spacing: -0.2px;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                white-space: nowrap;
            }

            .ai-bubble-icon {
                width: 24px;
                height: 24px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #667eea;
                font-size: 16px;
                font-weight: 700;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                flex-shrink: 0;
            }

            /* Cauda do balão (triângulo) */
            .ai-bubble-tail {
                position: absolute;
                bottom: -8px;
                right: 15px;
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-top: 10px solid #764ba2;
                filter: drop-shadow(0 3px 2px rgba(0, 0, 0, 0.1));
            }

            /* Interface do chat */
            .ai-assistant-chat {
                position: absolute;
                bottom: 100px;
                right: 0;
                width: 350px;
                max-height: 500px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transform: translateY(20px) scale(0.95);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid #e0e0e0;
            }

            .ai-assistant-chat.visible {
                transform: translateY(0) scale(1);
                opacity: 1;
            }

            .ai-assistant-chat.hidden {
                display: none;
            }

            /* Cabeçalho do chat */
            .ai-chat-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 18px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-shrink: 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .ai-chat-title {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .ai-chat-title i {
                font-size: 18px;
                background: rgba(255, 255, 255, 0.2);
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .ai-chat-title h3 {
                margin: 0;
                font-size: 17px;
                font-weight: 600;
            }

            .ai-close-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }

            .ai-close-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }

            /* Área de mensagens */
            .ai-chat-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #f8f9fa;
                display: flex;
                flex-direction: column;
                gap: 12px;
                min-height: 200px;
            }

            /* Mensagens */
            .ai-message {
                display: flex;
                gap: 10px;
                max-width: 85%;
                animation: aiFadeIn 0.3s ease;
            }

            @keyframes aiFadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .ai-message.user {
                align-self: flex-end;
                flex-direction: row-reverse;
            }

            .ai-message.assistant {
                align-self: flex-start;
            }

            .ai-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                flex-shrink: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                box-shadow: 0 2px 5px rgba(102, 126, 234, 0.3);
            }

            .ai-message.user .ai-avatar {
                background: #6c757d;
                box-shadow: 0 2px 5px rgba(108, 117, 125, 0.3);
            }

            .ai-message-content {
                padding: 12px 16px;
                border-radius: 18px;
                font-size: 14px;
                line-height: 1.5;
                word-wrap: break-word;
                max-width: 100%;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            }

            .ai-message.user .ai-message-content {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-bottom-right-radius: 5px;
            }

            .ai-message.assistant .ai-message-content {
                background: white;
                border: 1px solid #e0e0e0;
                color: #333;
                border-bottom-left-radius: 5px;
            }

            /* Indicador de digitação */
            .ai-typing {
                display: inline-flex;
                gap: 5px;
                align-items: center;
                padding: 5px 0;
            }

            .ai-typing span {
                width: 7px;
                height: 7px;
                background: #667eea;
                border-radius: 50%;
                animation: aiTyping 1.4s infinite ease-in-out;
            }

            .ai-typing span:nth-child(1) { animation-delay: -0.32s; }
            .ai-typing span:nth-child(2) { animation-delay: -0.16s; }

            @keyframes aiTyping {
                0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; }
                40% { transform: scale(1); opacity: 1; }
            }

            /* Ações rápidas */
            .ai-quick-actions {
                padding: 15px;
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                background: #f8f9fa;
                border-top: 1px solid #e0e0e0;
                border-bottom: 1px solid #e0e0e0;
                flex-shrink: 0;
            }

            .ai-quick-btn {
                background: white;
                border: 1px solid #667eea;
                color: #667eea;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 13px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.3s;
                flex: 1;
                min-width: 90px;
                justify-content: center;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }

            .ai-quick-btn:hover {
                background: #667eea;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
            }

            /* Área de input */
            .ai-input-container {
                padding: 18px;
                display: flex;
                gap: 12px;
                background: white;
                flex-shrink: 0;
                border-top: 1px solid #f0f0f0;
            }

            #ai-user-input {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid #e0e0e0;
                border-radius: 25px;
                font-size: 14px;
                outline: none;
                transition: all 0.3s;
                background: #f8f9fa;
            }

            #ai-user-input:focus {
                border-color: #667eea;
                background: white;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }

            #ai-send-btn {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
                flex-shrink: 0;
                box-shadow: 0 3px 8px rgba(102, 126, 234, 0.3);
            }

            #ai-send-btn:hover {
                transform: scale(1.05) rotate(5deg);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
            }

            /* Scrollbar personalizada */
            .ai-chat-messages::-webkit-scrollbar {
                width: 8px;
            }

            .ai-chat-messages::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
            }

            .ai-chat-messages::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 4px;
            }

            .ai-chat-messages::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }

            /* Responsivo */
            @media (max-width: 480px) {
                #ai-assistant-widget {
                    bottom: 20px;
                    right: 20px;
                }

                .ai-assistant-bubble {
                    padding: 14px 18px;
                    max-width: 160px;
                }

                .ai-bubble-text {
                    font-size: 14px;
                }

                .ai-bubble-icon {
                    width: 22px;
                    height: 22px;
                    font-size: 14px;
                }

                .ai-assistant-chat {
                    width: calc(100vw - 40px);
                    right: 0;
                    bottom: 80px;
                    max-height: 400px;
                }

                .ai-quick-btn {
                    padding: 7px 10px;
                    font-size: 12px;
                    min-width: 80px;
                }
            }

            /* Dark mode opcional */
            @media (prefers-color-scheme: dark) {
                .ai-assistant-chat {
                    background: #1a1a1a;
                    border-color: #333;
                }

                .ai-chat-messages {
                    background: #1a1a1a;
                }

                .ai-message.assistant .ai-message-content {
                    background: #2d2d2d;
                    border-color: #444;
                    color: #e0e0e0;
                }

                #ai-user-input {
                    background: #2d2d2d;
                    border-color: #444;
                    color: #e0e0e0;
                }

                #ai-user-input:focus {
                    background: #333;
                }

                .ai-quick-btn {
                    background: #2d2d2d;
                    border-color: #667eea;
                    color: #667eea;
                }

                .ai-quick-btn:hover {
                    background: #667eea;
                    color: white;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = styleId;
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupEventListeners() {
        // Toggle do chat pelo balão
        document.getElementById('ai-assistant-bubble').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleChat();
        });

        // Fechar chat
        document.getElementById('ai-close-chat').addEventListener('click', () => {
            this.closeChat();
        });

        // Enviar mensagem
        document.getElementById('ai-send-btn').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enviar com Enter
        document.getElementById('ai-user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Ações rápidas
        document.querySelectorAll('.ai-quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (this.isOpen) {
                const chat = document.getElementById('ai-assistant-chat');
                const bubble = document.getElementById('ai-assistant-bubble');
                
                if (!chat.contains(e.target) && !bubble.contains(e.target)) {
                    this.closeChat();
                }
            }
        });

        // Fechar com Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        const chat = document.getElementById('ai-assistant-chat');
        const bubble = document.getElementById('ai-assistant-bubble');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chat.classList.remove('hidden');
            setTimeout(() => chat.classList.add('visible'), 10);
            document.getElementById('ai-user-input').focus();
            
            // Esconder balão quando chat aberto
            bubble.style.opacity = '0.5';
            bubble.style.transform = 'scale(0.9)';
        } else {
            chat.classList.remove('visible');
            setTimeout(() => chat.classList.add('hidden'), 300);
            
            // Mostrar balão novamente
            bubble.style.opacity = '1';
            bubble.style.transform = 'scale(1)';
        }
    }

    closeChat() {
        const chat = document.getElementById('ai-assistant-chat');
        const bubble = document.getElementById('ai-assistant-bubble');
        
        this.isOpen = false;
        chat.classList.remove('visible');
        setTimeout(() => chat.classList.add('hidden'), 300);
        
        // Restaurar balão
        bubble.style.opacity = '1';
        bubble.style.transform = 'scale(1)';
    }

    addWelcomeMessage() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        
        // Adicionar mensagem de boas-vindas apenas se estiver vazio
        if (messagesContainer.children.length === 0) {
            const welcomeMessage = `Olá! Sou sua assistente de rotina. Posso ajudar com:
• Criação de rotinas
• Organização de agenda
• Dicas de produtividade
• Hábitos saudáveis

Como posso ajudar sua rotina hoje?`;
            
            this.addMessage(welcomeMessage, false);
        }
    }

async sendMessage() {
    const input = document.getElementById('ai-user-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Adicionar mensagem do usuário
    this.addMessage(message, true);
    input.value = '';
    
    // Mostrar indicador de digitação
    this.showTypingIndicator();
    
    try {
        // Obter resposta (usará API ou versão simulada)
        const response = await this.getResponse(message);
        
        // Remover indicador de digitação
        this.removeTypingIndicator();
        
        // Adicionar resposta
        this.addMessage(response, false);
        
    } catch (error) {
        this.removeTypingIndicator();
        console.error('Erro:', error);
        this.addMessage('Desculpe, tive um problema ao processar sua pergunta. Tente novamente!', false);
    }
}

getResponse(message) {

    const GEMINI_API_KEY = 'AIzaSyB1K3sm07EKGAcfuZTJ8_X7Z2oFDDv4yiI'; 

    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'SUA_CHAVE_API_AQUI') {
        // Se não tiver chave, usar versão simulada (como está atualmente)
        return this.getSimulatedResponse(message);
    }
    
    // Se tiver chave, usar API real
    return this.callGeminiAPI(message, GEMINI_API_KEY);
}


async callGeminiAPI(message, apiKey) {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Você é um assistente de produtividade especializado em rotinas e organização. 
                            Contexto: O usuário está em uma página de agenda/calendário.
                            Usuário: ${message}
                            
                            Responda em português brasileiro de forma amigável e prática. 
                            Ofereça dicas acionáveis e específicas sobre rotinas, produtividade e organização.`
                        }]
                    }]
                })
            }
        );
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0]) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return this.getSimulatedResponse(message); // Fallback se a API falhar
        }
        
    } catch (error) {
        console.error('Erro na API Gemini:', error);
        return this.getSimulatedResponse(message); // Fallback se houver erro
    }
}

// Mantenha a função getSimulatedResponse como está (é o seu código atual)
getSimulatedResponse(message) {
    const lowerMessage = message.toLowerCase();
        
        // Contexto da página atual
        const isAgendaPage = window.location.pathname.includes('agenda') || 
                            document.getElementById('task-input');
        const isCalendarPage = window.location.pathname.includes('calendario') || 
                              document.getElementById('calendar');
        
        if (lowerMessage.includes('rotina') || lowerMessage.includes('matinal')) {
            return `Para uma rotina matinal produtiva:
1. Acorde no mesmo horário todos os dias
2. Beba água ao acordar
3. 5 minutos de meditação
4. Alongamentos por 5 minutos
5. Planeje 3 prioridades do dia
6. Café da manhã nutritivo

Dica: Comece com 1-2 hábitos e aumente gradualmente.`;
                
        } else if (lowerMessage.includes('tempo') || lowerMessage.includes('produtiv')) {
            return `Dicas para gestão do tempo:
• Use a técnica Pomodoro (25min trabalho / 5min pausa)
• Priorize com a Matriz de Eisenhower
• Elimine distrações digitais
• Agende blocos de tempo para tarefas importantes
• Revise seu dia antes de dormir

Sugestão: Planeje a semana no domingo à noite.`;
                
        } else if (lowerMessage.includes('organizar') || lowerMessage.includes('tarefa')) {
            let context = '';
            if (isAgendaPage) {
                const taskList = document.getElementById('task-list');
                if (taskList) {
                    const taskCount = taskList.querySelectorAll('li').length;
                    context = `Vejo que você tem ${taskCount} tarefas na agenda. `;
                }
            }
            
            return `${context}Para organizar tarefas:
1. Liste todas as tarefas pendentes
2. Categorize por prioridade
3. Estime tempo para cada uma
4. Agende no horário de maior energia
5. Comece pelas mais importantes

Dica: Divida grandes tarefas em partes menores de 15-30 minutos.`;
                
        } else if (lowerMessage.includes('agenda')) {
            if (isAgendaPage) {
                return `Você está na página de agenda. Para gerenciar suas tarefas:
• Adicione novas tarefas no campo acima
• Clique no ✓ para marcar como concluída
• Clique no 🗑 para remover tarefas
• Use Enter para adicionar rapidamente

Dica: Revise suas tarefas todas as manhãs e noites.`;
            } else {
                return `Para acessar a agenda, clique no botão "Voltar para Agenda" no topo desta página.`;
            }
                
        } else if (lowerMessage.includes('calendário') || lowerMessage.includes('calendario')) {
            if (isCalendarPage) {
                return `Você está na página de calendário. Aqui você pode:
• Ver todos os dias do mês
• Adicionar eventos em dias específicos (clique em um dia)
• Ver contagem de eventos por dia
• Navegar entre meses usando as setas

Dica: Use o calendário para planejamento de longo prazo.`;
            } else {
                return `Para acessar o calendário, clique no botão "Ver Calendário" na página da agenda.`;
            }
                
        } else if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('ola')) {
            return `Olá! 😊 Sou sua assistente de rotina. Posso ajudar com:
• Planejamento de rotinas
• Dicas de organização
• Sugestões de produtividade
• Criação de hábitos saudáveis

Em que posso ajudar sua rotina hoje?`;
                
        } else if (lowerMessage.includes('ajuda') || lowerMessage.includes('precisa')) {
            return `Claro! Posso ajudar você a:
1. Criar uma rotina matinal produtiva
2. Organizar suas tarefas diárias
3. Gerenciar melhor seu tempo
4. Planejar eventos no calendário
5. Desenvolver hábitos saudáveis

Me conte: qual dessas áreas você gostaria de melhorar?`;
                
        } else {
            return `Entendi sua pergunta sobre "${message}". Como assistente de rotina, posso ajudar com:
• Criação de rotinas personalizadas
• Gestão do tempo e produtividade
• Organização de tarefas e agenda
• Desenvolvimento de hábitos saudáveis

Que tal me fazer uma pergunta mais específica?`;
        }
    }

    handleQuickAction(action) {
        const actions = {
            'rotina-matinal': 'Como criar uma rotina matinal?',
            'gestao-tempo': 'Dicas para gerenciar meu tempo',
            'organizar-tarefas': 'Como organizar minhas tarefas?'
        };
        
        if (actions[action]) {
            document.getElementById('ai-user-input').value = actions[action];
            this.sendMessage();
        }
    }

    addMessage(content, isUser) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const messageDiv = document.createElement('div');
        
        messageDiv.className = `ai-message ${isUser ? 'user' : 'assistant'}`;
        messageDiv.innerHTML = `
            <div class="ai-avatar">
                <i class="fas fa-${isUser ? 'user' : 'robot'}"></i>
            </div>
            <div class="ai-message-content">${content.replace(/\n/g, '<br>')}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const typingDiv = document.createElement('div');
        
        typingDiv.className = 'ai-message assistant';
        typingDiv.id = 'ai-typing-indicator';
        typingDiv.innerHTML = `
            <div class="ai-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="ai-message-content">
                <div class="ai-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('ai-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

// Inicializar widget quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que tudo está carregado
    setTimeout(() => {
        // Verificar se já temos o Font Awesome
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const faLink = document.createElement('link');
            faLink.rel = 'stylesheet';
            faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
            document.head.appendChild(faLink);
        }
        
        // Inicializar o widget
        window.AIAssistant = new AssistantWidget();
        
        console.log('Assistente IA Widget (balão) carregado com sucesso!');
    }, 1000);
});