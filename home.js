document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do DOM
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Função para criar um item de tarefa
    function createTaskItem(taskText) {
        // Cria o elemento <li>
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

        if (taskText !== '') { // Verifica se o campo não está vazio
            const newTask = createTaskItem(taskText);
            taskList.appendChild(newTask);
            taskInput.value = ''; // Limpa o campo de input
        } else {
            alert('Por favor, digite uma tarefa.');
        }
    });

    // Evento para adicionar tarefa com a tecla Enter
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click(); // Simula um clique no botão
        }
    });
});