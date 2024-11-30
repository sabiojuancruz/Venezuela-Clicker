let datos = [];

async function obtenerDatos() {
    try {
        const response = await fetch('http://localhost:3000/enviar-datos');
        const data = await response.json();
        datos = data
        console.log('Datos dentro de obtenerDatos:', datos);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

window.onload = async () => {
    await obtenerDatos(); 
    console.log('Datos fuera de window.onload:', datos); 
};

document.getElementById('save').addEventListener('click', () => {
    fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.ok) {
            alert('Guardado con éxito');
        } else {
            alert(`Error`);
        }
    })
})

document.getElementById('coin').addEventListener('click', () => {
    datos.datosJuego.coins += 1;
    console.log(datos)
});