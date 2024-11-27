const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

document.getElementById('submit').addEventListener('click', () => {
    if (!usernameInput || !passwordInput) {
        console.error('Los campos no existen en el DOM');
        return;
    }

    const datos = {
        username: usernameInput.value.trim(),
        password: passwordInput.value.trim(),
    };

    if (!datos.username || !datos.password) {
        alert('Por favor, completa todos los campos');
        return;
    }

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.ok) {
                alert('Usuario registrado con éxito');
            } else {
                alert(`Error: ${data.mensaje}`);
            }
        })
        .catch((error) => {
            console.error('Error en la solicitud:', error.message);
            alert(`Hubo un problema: ${error.message}`);
        });    
});
