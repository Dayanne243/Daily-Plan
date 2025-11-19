document.addEventListener('DOMContentLoaded', () => {


    const loginForm = document.getElementById('login-page');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o envio padrão do formulário

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // Simulação validação de login
            if (email === 'teste@gmail.com' && password === '12345') {
                alert('Login bem-sucedido!');
                window.location.href = 'agenda.html';
            } else {
                alert('Email ou senha incorretos.\nPor favor, digite seus dados corretamente!');
            }
        });
    }


    const registerForm = document.getElementById('register-page');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            // Simulação de registro bem-sucedido
            console.log('Usuário registrado:', { username, email, password });
            alert('Registro bem-sucedido! Agora faça o login!.');

            window.location.href = 'index.html';
        });
    }

});
