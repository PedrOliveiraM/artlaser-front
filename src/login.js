
document
  .getElementById('loginForm')
  .addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      // Requisição para login
      const response = await fetch('https://back-artlaser-c5e8836155b5.herokuapp.com/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        const token = result.token; // Armazena o token

        // Redireciona para painel.html com o token na URL
        window.location.href = `painel.html?token=${encodeURIComponent(token)}`;
      } else {
        alert(result.message || 'Login failed'); // Exibe mensagem de erro
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  });
