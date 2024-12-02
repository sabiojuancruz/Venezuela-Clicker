//variables html
const loading_screen = document.getElementById('loading-screen');
const coin_count = document.getElementById('bolivares_count');
const building_container = document.getElementById('building-container')
const cps_count = document.getElementById('cps_count')
const mejoras_container = document.getElementById('mejoras_container')

//variables funcionalidad
let datos = [];

//funciones html
function cargarEdificios(datos) {
    building_container.innerHTML = "<h2>Edificios</h2>";
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

function cargarMejoras(datos) {
    mejoras_container.innerHTML = "<h2>Mejoras</h2>";
    let mejoras = datos.datosJuego.mejoras

    for (mejora in mejoras) {
        let mejora_data = mejoras[mejora]

        if (!mejora_data.unlocked) {
            const div = document.createElement('div');
            div.textContent = mejora;
    
            const price = document.createElement('p');
            price.textContent = `Precio: ${mejora_data.precio}`;

            div.classList.add('mejora')
            div.appendChild(price);
            div.addEventListener('click', () => comprarMejora(mejora_data))

            mejoras_container.appendChild(div)
        }
    }
}

function cargarDatosJugador(datos) {
    coin_count.textContent = Math.floor(datos.datosJuego.coins)
    cps_count.textContent = Math.round(datos.datosJuego.cps * 10) / 10
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
    datos.datosJuego.coins += datos.datosJuego.cpc;
    cargarDatosJugador(datos)
}

function calcularCPS() {
    let edificios = Object.values(datos.datosJuego.edificios)
    datos.datosJuego.cps = edificios.reduce((total, edificio) => total + edificio.cantidad * edificio.produccion, 0);
}

function comprarEdificio(edificio) {
    if (datos.datosJuego.coins >= edificio.precio) {
        datos.datosJuego.coins -= edificio.precio
        edificio.cantidad += 1
        edificio.precio = Math.ceil(edificio.precio_inicial * 1.15 ** edificio.cantidad)
        
        calcularCPS();
        cargarDatosJugador(datos)
        cargarEdificios(datos)
    }
}

function comprarMejora(mejora) {
    if (datos.datosJuego.coins >= mejora.precio) {
        datos.datosJuego.coins -= mejora.precio
        mejora.unlocked = true
        switch (mejora.consecuencia.efecto) {
            case "multiplicarEdificio":
                datos.datosJuego.edificios[mejora.consecuencia.objetivo].produccion *= mejora.consecuencia.cantidad
                break;
            
            case "multiplicarCPC":
                datos.datosJuego.cpc *= mejora.consecuencia.cantidad
        }

        calcularCPS();
        cargarDatosJugador(datos)
        cargarMejoras(datos)
    }
}

function sumar_cps() {
    datos.datosJuego.coins += datos.datosJuego.cps / 100
    cargarDatosJugador(datos)
}

//al cargar la pagina
window.onload = async () => {
    await obtenerDatos(); 
    console.log(datos)

    cargarEdificios(datos)
    cargarMejoras(datos)
    cargarDatosJugador(datos)
    loading_screen.style.display = 'none'
};

//bloque principal
document.getElementById('save').addEventListener('click', save) //guardado manual
setInterval(save, 60000) //guardado automatico

document.getElementById('coin').addEventListener('click', click);
setInterval(sumar_cps, 10)