document.addEventListener('DOMContentLoaded', () => {

    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');


    function createTaskItem(taskText) {

        const li = document.createElement('li');
        li.innerHTML = `
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="complete-btn"><i class="fas fa-check"></i></button>
                <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;

        // Adiciona evento para marcar como completa
        li.querySelector('.complete-btn').addEventListener('click', () => {
            li.classList.toggle('completed');
        });

        // Adiciona evento para deletar a tarefa
        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
        });

        return li;
    }

    // Evento para adicionar uma nova tarefa
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim(); // Pega o texto e remove espaços em branco

        if (taskText !== '') { // não está vazio
            const newTask = createTaskItem(taskText);
            taskList.appendChild(newTask);
            taskInput.value = ''; 
        } else {
            alert('Por favor, digite uma tarefa.');
        }
    });

 
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click(); 
        }
    });


    class AssistantWidget {
        constructor() {
            this.isOpen = false;
            this.chatHistory = [];
            this.initializeWidget();
        }

        initializeWidget() {
           
            if (document.getElementById('ai-assistant-widget')) {
                return;
            }
            
            
            this.createWidgetHTML();
            this.setupEventListeners();
            this.addWelcomeMessage();
        }

        createWidgetHTML() {

            const widgetContainer = document.createElement('div');
            widgetContainer.id = 'ai-assistant-widget';
            widgetContainer.innerHTML = `
                <!-- Botão flutuante -->
                <button id="ai-assistant-toggle" class="ai-assistant-toggle">
                    <i class="fas fa-robot"></i>
                </button>

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

 
            document.body.appendChild(widgetContainer);
 
            this.addStyles();
        }

        addStyles() {
            const styleId = 'ai-assistant-styles';
            if (document.getElementById(styleId)) return;
            
            const styles = `
                /* Widget de Assistente IA */
                #ai-assistant-widget {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                /* Botão flutuante */
                .ai-assistant-toggle {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    position: relative;
                    z-index: 10001;
                }

                .ai-assistant-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
                }

                .ai-assistant-toggle:active {
                    transform: scale(0.95);
                }

                /* Interface do chat */
                .ai-assistant-chat {
                    position: absolute;
                    bottom: 70px;
                    right: 0;
                    width: 350px;
                    max-height: 500px;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    transform: translateY(20px);
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .ai-assistant-chat.visible {
                    transform: translateY(0);
                    opacity: 1;
                }

                .ai-assistant-chat.hidden {
                    display: none;
                }

                /* Cabeçalho do chat */
                .ai-chat-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-shrink: 0;
                }

                .ai-chat-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .ai-chat-title i {
                    font-size: 18px;
                }

                .ai-chat-title h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .ai-close-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s;
                }

                .ai-close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
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
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    flex-shrink: 0;
                }

                .ai-message.user .ai-avatar {
                    background: #6c757d;
                    color: white;
                }

                .ai-message.assistant .ai-avatar {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .ai-message-content {
                    padding: 10px 14px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.4;
                    word-wrap: break-word;
                    max-width: 100%;
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
                    gap: 4px;
                    align-items: center;
                }

                .ai-typing span {
                    width: 6px;
                    height: 6px;
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
                    padding: 12px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    background: #f8f9fa;
                    border-top: 1px solid #e0e0e0;
                    border-bottom: 1px solid #e0e0e0;
                    flex-shrink: 0;
                }

                .ai-quick-btn {
                    background: white;
                    border: 1px solid #667eea;
                    color: #667eea;
                    padding: 6px 10px;
                    border-radius: 15px;
                    font-size: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    transition: all 0.3s;
                    flex: 1;
                    min-width: 80px;
                    justify-content: center;
                }

                .ai-quick-btn:hover {
                    background: #667eea;
                    color: white;
                }

                /* Área de input */
                .ai-input-container {
                    padding: 15px;
                    display: flex;
                    gap: 10px;
                    background: white;
                    flex-shrink: 0;
                }

                #ai-user-input {
                    flex: 1;
                    padding: 10px 14px;
                    border: 1px solid #e0e0e0;
                    border-radius: 25px;
                    font-size: 14px;
                    outline: none;
                    transition: border 0.3s;
                }

                #ai-user-input:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
                }

                #ai-send-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.3s;
                    flex-shrink: 0;
                }

                #ai-send-btn:hover {
                    transform: scale(1.05);
                }

                /* Scrollbar personalizada */
                .ai-chat-messages::-webkit-scrollbar {
                    width: 6px;
                }

                .ai-chat-messages::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }

                .ai-chat-messages::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 3px;
                }

                .ai-chat-messages::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }

                /* Responsivo */
                @media (max-width: 480px) {
                    #ai-assistant-widget {
                        bottom: 10px;
                        right: 10px;
                    }

                    .ai-assistant-chat {
                        width: calc(100vw - 40px);
                        right: 0;
                        bottom: 60px;
                        max-height: 400px;
                    }

                    .ai-assistant-toggle {
                        width: 50px;
                        height: 50px;
                        font-size: 20px;
                    }
                    
                    .ai-quick-btn {
                        padding: 5px 8px;
                        font-size: 11px;
                    }
                }
            `;

            const styleSheet = document.createElement('style');
            styleSheet.id = styleId;
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        setupEventListeners() {
            // Toggle do chat
            document.getElementById('ai-assistant-toggle').addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleChat();
            });


            document.getElementById('ai-close-chat').addEventListener('click', () => {
                this.closeChat();
            });

    
            document.getElementById('ai-send-btn').addEventListener('click', () => {
                this.sendMessage();
            });

            // Enviar com Enter
            document.getElementById('ai-user-input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });

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
                    const toggle = document.getElementById('ai-assistant-toggle');
                    
                    if (!chat.contains(e.target) && !toggle.contains(e.target)) {
                        this.closeChat();
                    }
                }
            });
        }

        toggleChat() {
            const chat = document.getElementById('ai-assistant-chat');
            this.isOpen = !this.isOpen;
            
            if (this.isOpen) {
                chat.classList.remove('hidden');
                setTimeout(() => chat.classList.add('visible'), 10);
                document.getElementById('ai-user-input').focus();
            } else {
                chat.classList.remove('visible');
                setTimeout(() => chat.classList.add('hidden'), 300);
            }
        }

        closeChat() {
            const chat = document.getElementById('ai-assistant-chat');
            this.isOpen = false;
            chat.classList.remove('visible');
            setTimeout(() => chat.classList.add('hidden'), 300);
        }

        addWelcomeMessage() {
            const messagesContainer = document.getElementById('ai-chat-messages');
            
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

// Substitua a função sendMessage atual por esta versão:
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
        // Obter resposta da API
        const response = await this.getGeminiResponse(message);
        
        // Remover indicador de digitação e adicionar resposta
        this.removeTypingIndicator();
        this.addMessage(response, false);
        
    } catch (error) {
        this.removeTypingIndicator();
        console.error('Erro:', error);
        this.addMessage('Desculpe, estou com problemas técnicos. Tente novamente em instantes.', false);
    }
}

// Adicione esta nova função para chamar a API do Gemini:
async getGeminiResponse(message) {
    // SUA CHAVE DA API GEMINI - substitua pela sua chave real
    const GEMINI_API_KEY = 'AIzaSyB1K3sm07EKGAcfuZTJ8_X7Z2oFDDv4yiI'; // ← COLE SUA CHAVE AQUI
    

    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('xxxx')) {
        return this.getSimulatedResponse(message);
    }
    
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Você é um assistente especializado em rotinas, produtividade e organização pessoal.
                            Seu nome é "Assistente de Rotina".
                            
                            Contexto da conversa: ${this.getConversationContext()}
                            
                            Pergunta do usuário: ${message}
                            
                            Responda em português brasileiro de forma amigável, prática e concisa.
                            Ofereça dicas acionáveis e específicas para ajudar o usuário.`
                        }]
                    }]
                })
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return this.getSimulatedResponse(message);
        }
        
    } catch (error) {
        console.error('Erro na API Gemini:', error);
        return this.getSimulatedResponse(message);
    }
}

// Adicione esta função para obter contexto da conversa:
getConversationContext() {
    const isAgendaPage = window.location.pathname.includes('agenda') || 
                         document.getElementById('task-input');
    const isCalendarPage = window.location.pathname.includes('calendario') || 
                          document.getElementById('calendar');
    
    let context = "O usuário está usando um aplicativo de produtividade. ";
    
    if (isAgendaPage) {
        const taskCount = document.querySelectorAll('#task-list li').length;
        context += `Está na página de agenda e tem ${taskCount} tarefas. `;
    } else if (isCalendarPage) {
        context += "Está na página de calendário. ";
    }
    
    return context;
}

// Mantenha a função getSimulatedResponse como está (é seu fallback):
getSimulatedResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Contexto da página atual
    const isAgendaPage = window.location.pathname.includes('agenda');
    const taskCount = document.querySelectorAll('#task-list li').length;
    
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
        if (isAgendaPage && taskCount > 0) {
            context = `Vejo que você tem ${taskCount} tarefas na agenda. `;
        }
        
        return `${context}Para organizar tarefas:
1. Liste todas as tarefas pendentes
2. Categorize por prioridade
3. Estime tempo para cada uma
4. Agende no horário de maior energia
5. Comece pelas mais importantes

Dica: Divida grandes tarefas em partes menores de 15-30 minutos.`;
            
    } else if (lowerMessage.includes('agenda') || lowerMessage.includes('calendário')) {
        if (isAgendaPage) {
            return `Você está na página de agenda. Para gerenciar suas tarefas:
• Adicione novas tarefas no campo acima
• Clique no ✓ para marcar como concluída
• Clique no 🗑 para remover tarefas
• Use Enter para adicionar rapidamente

Dica: Revise suas tarefas todas as manhãs e noites.`;
        } else {
            return `Parece que você está na página de calendário. Lá você pode:
• Ver todos os dias do mês
• Adicionar eventos em dias específicos
• Ver contagem de eventos por dia
• Navegar entre meses

Para voltar à agenda, use o botão "Voltar para Agenda".`;
        }
            
    } else if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('ola')) {
        return `Olá! 😊 Sou sua assistente de rotina. Posso ajudar com:
• Planejamento de rotinas
• Dicas de organização
• Sugestões de produtividade
• Criação de hábitos saudáveis

Em que posso ajudar sua rotina hoje?`;
            
    } else {
        return `Entendi sua pergunta sobre "${message}". Como assistente de rotina, posso ajudar com:
• Criação de rotinas personalizadas
• Gestão do tempo e produtividade
• Organização de tarefas e agenda
• Desenvolvimento de hábitos saudáveis

Que tal me fazer uma pergunta mais específica?`;
    }
}
        getResponse(message) {
            const lowerMessage = message.toLowerCase();
            

            const isAgendaPage = window.location.pathname.includes('agenda');
            const taskCount = document.querySelectorAll('#task-list li').length;
            
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
                if (isAgendaPage && taskCount > 0) {
                    context = `Vejo que você tem ${taskCount} tarefas na agenda. `;
                }
                
                return `${context}Para organizar tarefas:
1. Liste todas as tarefas pendentes
2. Categorize por prioridade
3. Estime tempo para cada uma
4. Agende no horário de maior energia
5. Comece pelas mais importantes

Dica: Divida grandes tarefas em partes menores de 15-30 minutos.`;
                
            } else if (lowerMessage.includes('agenda') || lowerMessage.includes('calendário')) {
                if (isAgendaPage) {
                    return `Você está na página de agenda. Para gerenciar suas tarefas:
• Adicione novas tarefas no campo acima
• Clique no ✓ para marcar como concluída
• Clique no 🗑 para remover tarefas
• Use Enter para adicionar rapidamente

Dica: Revise suas tarefas todas as manhãs e noites.`;
                } else {
                    return `Parece que você está na página de calendário. Lá você pode:
• Ver todos os dias do mês
• Adicionar eventos em dias específicos
• Ver contagem de eventos por dia
• Navegar entre meses

Para voltar à agenda, use o botão "Voltar para Agenda".`;
                }
                
            } else if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('ola')) {
                return `Olá! 😊 Sou sua assistente de rotina. Posso ajudar com:
• Planejamento de rotinas
• Dicas de organização
• Sugestões de produtividade
• Criação de hábitos saudáveis

Em que posso ajudar sua rotina hoje?`;
                
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


    setTimeout(() => {

        if (!document.querySelector('link[href*="font-awesome"]')) {
            const faLink = document.createElement('link');
            faLink.rel = 'stylesheet';
            faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
            document.head.appendChild(faLink);
        }

        window.AIAssistant = new AssistantWidget();
        

        console.log('Assistente IA Widget carregado com sucesso!');
    }, 500);
});