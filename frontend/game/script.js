//variables html
const loading_screen = document.getElementById('loading-screen');
const coin_count = document.getElementById('bolivares_count');
const building_container = document.getElementById('building-container')
const cps_count = document.getElementById('cps_count')

//variables funcionalidad
let datos = [];

//funciones html
function cargarEdificios(datos) {
    building_container.innerHTML = "";
    let edificios = datos.datosJuego.edificios

    for (edificio in edificios) {
        let edificio_data = edificios[edificio];

        const div = document.createElement('div');
        div.textContent = edificio;

        const price = document.createElement('p');
        price.textContent = `Precio: ${edificio_data.precio}`;

        const cantidad = document.createElement('p')
        cantidad.textContent = `Cantidad: ${edificio_data.cantidad}`

        div.appendChild(price);
        div.appendChild(cantidad);
        div.addEventListener('click', () => comprarEdificio(edificio_data))
        
        div.classList.add('building')
        building_container.appendChild(div)
    }
}

function cargarDatosJugador(datos) {
    coin_count.textContent = datos.datosJuego.coins
    cps_count.textContent = datos.datosJuego.cps
}

//funcionalidad del juego 
async function obtenerDatos() {
    try {
        const response = await fetch('http://localhost:3000/enviar-datos');
        const data = await response.json();
        datos = data
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

function save() {
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
}

function click() {
    datos.datosJuego.coins += 1;
    coin_count.textContent = datos.datosJuego.coins
}

function comprarEdificio(edificio) {
    if (datos.datosJuego.coins >= edificio.precio) {
        datos.datosJuego.coins -= edificio.precio
        edificio.cantidad += 1
        datos.datosJuego.cps += edificio.produccion

        cargarDatosJugador(datos)
        cargarEdificios(datos)
    }
}

//al cargar la pagina
window.onload = async () => {
    await obtenerDatos(); 
    console.log(datos)

    cargarEdificios(datos)
    cargarDatosJugador(datos)
    loading_screen.style.display = 'none'
};

document.getElementById('save').addEventListener('click', save)

//bloque principal
document.getElementById('coin').addEventListener('click', click);