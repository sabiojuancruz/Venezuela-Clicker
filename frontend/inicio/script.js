const usernameInputR = document.getElementById('username-registro');
const passwordInputR = document.getElementById('password-registro');
const usernameInputL = document.getElementById('username-login');
const passwordInputL = document.getElementById('password-login');

document.getElementById('submit-registro').addEventListener('click', () => {
    if (!usernameInputR || !passwordInputR) {
        console.error('Los campos no existen en el DOM');
        return;
    }

    const datos = {
        username: usernameInputR.value.trim(),
        password: passwordInputR.value.trim(),
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
