//variables html
const loading_screen = document.getElementById('loading-screen');
const coin_count = document.getElementById('bolivares_count');
const building_container = document.getElementById('building-container');
const cps_count = document.getElementById('cps_count');
const mejoras_container = document.getElementById('mejoras_container');
const save_button = document.getElementById('save');
const coin_button = document.getElementById('coin');

//variables funcionalidad
let datos = [];
let multiplicador = 1;

//funciones html
function cargarEdificios(datos) {
    building_container.innerHTML = "";
    let edificios = datos.datosJuego.edificios;

    for (edificio in edificios) {
        let edificio_data = edificios[edificio];

        const div = document.createElement('div');
        div.textContent = edificio_data.nombre;

        const price = document.createElement('p');
        price.textContent = `Precio: ${edificio_data.precio}`;

        const cantidad = document.createElement('p');
        cantidad.textContent = `Cantidad: ${edificio_data.cantidad}`;

        div.appendChild(price);
        div.appendChild(cantidad);
        div.addEventListener('click', () => comprarEdificio(edificio_data));
        
        div.classList.add('building');
        building_container.appendChild(div);
    }
}

function cargarMejoras(datos) {
    mejoras_container.innerHTML = "";
    let mejoras = datos.datosJuego.mejoras;

    for (mejora in mejoras) {
        let mejora_data = mejoras[mejora];

        if (!mejora_data.unlocked) {
            const div = document.createElement('div');
            div.textContent = mejora;
    
            const price = document.createElement('p');
            price.textContent = `Precio: ${mejora_data.precio}`;

            div.classList.add('mejora');
            div.appendChild(price);
            div.addEventListener('click', () => comprarMejora(mejora_data))

            mejoras_container.appendChild(div);
        }
    }
}

function cargarDatosJugador(datos) {
    coin_count.textContent = Math.floor(datos.datosJuego.coins)
    cps_count.textContent = Math.round(datos.datosJuego.cps * 100) / 100
}

function crearBotonAleatorio() {
    const boton = document.createElement('button');
    boton.textContent = 'dolar';
    boton.style.position = 'absolute';
    boton.style.zIndex = 1000;

    const posX = Math.random() * (window.innerWidth - 100); 
    const posY = Math.random() * (window.innerHeight - 50); 

    boton.style.left = `${posX}px`;
    boton.style.top = `${posY}px`;

    document.body.appendChild(boton);

    setTimeout(() => {
        boton.remove();
    }, 5000);

    boton.addEventListener('click', () => {
        dolarClick();
        boton.remove();
    });
}

//funcionalidad del juego 
async function obtenerDatos() {
    try {
        const response = await fetch('http://localhost:3000/enviar-datos');
        const data = await response.json();
        datos = data;
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
            console.log('Datos guardados correctamente');
        } else {
            alert(`Error`);
        }
    })
}

function verificarNivel() {
    let total_clicks = datos.datosJuego.total_clicks
    switch (total_clicks) {
        
        case 100:
            datos.datosJuego.level++;

            datos.datosJuego.cpc *= 1.1;

            multiplicador = 1.1;

            alert(`Subiste a nivel ${datos.datosJuego.level}`)
            break;

        case 1000:
            datos.datosJuego.level++;

            datos.datosJuego.cpc /= 1.1;
            datos.datosJuego.cpc *= 1.2;

            multiplicador = 1.2;

            alert(`Subiste a nivel ${datos.datosJuego.level}`)
            break;

        case 2000:
            datos.datosJuego.level++;

            datos.datosJuego.cpc /= 1.2;
            datos.datosJuego.cpc *= 1.3;

            multiplicador = 1.3;

            alert(`Subiste a nivel ${datos.datosJuego.level}`)
            break;

        case 5000:
            datos.datosJuego.level++;

            datos.datosJuego.cpc /= 1.3;
            datos.datosJuego.cpc *= 1.4;

            multiplicador = 1.4;

            alert(`Subiste a nivel ${datos.datosJuego.level}`)
            break;

        case 10000:
            datos.datosJuego.level++;

            datos.datosJuego.cpc /= 1.4;
            datos.datosJuego.cpc *= 1.5;

            multiplicador = 1.5;

            alert(`Subiste a nivel ${datos.datosJuego.level}`)
            break;

        case 20000:
            datos.datosJuego.level++;

            datos.datosJuego.cpc /= 1.5;
            datos.datosJuego.cpc *= 1.6;

            multiplicador = 1.6;

            alert(`Subiste a nivel ${datos.datosJuego.level}`)
            break;

        case 40000:
            datos.datosJuego.level++;

            datos.datosJuego.cpc /= 1.6;
            datos.datosJuego.cpc *= 1.7;

            multiplicador *= 1.7;

            alert(`Subiste a nivel ${datos.datosJuego.level}`)
            break;

        case 60000:
            datos.datosJuego.level++;

            datos.datosJuego.cpc /= 1.7;
            datos.datosJuego.cpc *= 1.8;

            multiplicador *= 1.8;

            alert(`Subiste a nivel ${datos.datosJuego.level}`)
            break;

        case 80000:
            datos.datosJuego.level++;

            datos.datosJuego.cpc /= 1.8;
            datos.datosJuego.cpc *= 1.9;

            multiplicador *= 1.9;

            alert(`Subiste a nivel ${datos.datosJuego.level}`)
            break;

        case 100000:
            datos.datosJuego.level++;

            datos.datosJuego.cpc /= 1.9;
            datos.datosJuego.cpc *= 2;

            multiplicador = 2;

            alert(`Subiste a nivel ${datos.datosJuego.level}`)
            break;
    }
}

function verificarLegacy() {
    
}

function click() {
    datos.datosJuego.coins += datos.datosJuego.cpc;
    datos.datosJuego.total_coins += datos.datosJuego.cpc;
    datos.datosJuego.total_clicks += 1;

    verificarNivel();
    calcularCPS();
    cargarDatosJugador(datos);
}

function calcularCPS() {
    let edificios = Object.values(datos.datosJuego.edificios);
    datos.datosJuego.cps = edificios.reduce((total, edificio) => total + edificio.cantidad * edificio.produccion, 0);
    datos.datosJuego.cps *= multiplicador;
}

function comprarEdificio(edificio) {
    if (datos.datosJuego.coins >= edificio.precio) {
        datos.datosJuego.coins -= edificio.precio;
        edificio.cantidad += 1;
        edificio.precio = Math.ceil(edificio.precio_inicial * 1.15 ** edificio.cantidad);
        
        calcularCPS();
        cargarDatosJugador(datos);
        cargarEdificios(datos);
    }
}

function comprarMejora(mejora) {
    if (datos.datosJuego.coins >= mejora.precio) {
        datos.datosJuego.coins -= mejora.precio;

        mejora.unlocked = true;
        let consecuencia = mejora.consecuencia;

        switch (consecuencia.efecto) {
            case "multiplicarDedos":
                datos.datosJuego.edificios[consecuencia.objetivo].produccion *= consecuencia.cantidad
                datos.datosJuego.edificios[consecuencia.objetivo].multiplicador_total *= consecuencia.cantidad
                datos.datosJuego.cpc *= consecuencia.cantidad;
                break;

            case "multiplicarEdificio":
                datos.datosJuego.edificios[consecuencia.objetivo].produccion *= consecuencia.cantidad;
                datos.datosJuego.edificios[consecuencia.objetivo].multiplicador_total *= consecuencia.cantidad
                break;
                
            case "sumarCantidadPorEdificio":
                datos.datosJuego.edificios[consecuencia.objetivo].produccion += 0.1 * datos.datosJuego.edificios_totales * multiplicador_total
        }

        calcularCPS();
        cargarDatosJugador(datos);
        cargarMejoras(datos);
    }
}

function sumar_cps() {
    datos.datosJuego.coins += datos.datosJuego.cps / 100;
    datos.datosJuego.total_coins += datos.datosJuego.cps / 100;
    cargarDatosJugador(datos);
}

function dolarClick() {
    let randInt = Math.round(Math.random() * 99)
    if (randInt >= 97) {
        datos.datosJuego.cpc *= 777;
        console.log('x777')

        setTimeout(() => {
            datos.datosJuego.cpc /= 777;
        }, 7000);
    }
    else if (randInt >= 47 && randInt <= 96)
    {
        console.log('x7')
        for (edificio in datos.datosJuego.edificios) {
            edificio = datos.datosJuego.edificios[edificio];
            edificio.produccion *= 7;
        }
        datos.datosJuego.cpc *= 7;

        calcularCPS();
        cargarDatosJugador(datos);

        setTimeout(() => {
            for (edificio in datos.datosJuego.edificios) {
                edificio = datos.datosJuego.edificios[edificio];
                edificio.produccion /= 7;
            }
            datos.datosJuego.cpc /= 7;
    
            calcularCPS();
            cargarDatosJugador(datos);
        }, 7000);
    }
    else 
    {
        datos.datosJuego.coins += datos.datosJuego.cps * 900 + 13
        console.log('suerte')
        cargarDatosJugador(datos);
    }
}

//al cargar la pagina
window.onload = async () => {
    await obtenerDatos(); 
    console.log(datos);

    cargarEdificios(datos);
    cargarMejoras(datos);
    cargarDatosJugador(datos);
    loading_screen.style.display = 'none';
};

//bloque principal
save_button.addEventListener('click', save); //guardado manual
//setInterval(save, 6000); //guardado automatico

coin_button.addEventListener('click', click);
setInterval(sumar_cps, 10);

setInterval(crearBotonAleatorio, 10000)

document.addEventListener('keydown', function(event) {
    if (event.key.toLowerCase() === 's')
    {
        save();
    }
})