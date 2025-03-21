const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/register', (req, res) => {
    const datosRegistro = req.body;
    const gamedata = {
        "level": 0,
        "total_clicks": 0,
        "coins": 0,
        "total_coins": 0,
        "cpc": 1,
        "cps": 0,
        "mejoras": {
          "mejoraCPC1": {
              "precio": 100,
              "unlocked": false,
              "consecuencia": {
                "efecto": "multiplicarCPC",
                "cantidad": 2
              }
            },
          "mejoraAreperas1": {
            "precio": 100,
            "unlocked": false,
            "consecuencia": {
              "efecto": "multiplicarEdificio",
              "objetivo": "areperas",
              "cantidad": 2
            }
           },
           "mejoraAreperas2": {
            "precio": 500,
            "unlocked": false,
            "consecuencia": {
              "efecto": "multiplicarEdificio",
              "objetivo": "areperas",
              "cantidad": 2
            }
           },
           "mejoraAreperas3": {
            "precio": 10000,
            "unlocked": false,
            "consecuencia": {
              "efecto": "multiplicarEdificio",
              "objetivo": "areperas",
              "cantidad": 2
            }
           },
           "mejoraAreperas4": {
            "precio": 100000,
            "unlocked": false,
            "consecuencia": {
              "efecto": "sumarPorCantidadDeEdificiosNoAreperas",
              "objetivo": "areperas",
              "cantidad": 2
            }
           },
           "mejoraAreperas5": {
            "precio": 10000000,
            "unlocked": false,
            "consecuencia": {
              "efecto": "multiplicarEdificio",
              "objetivo": "areperas",
              "cantidad": 2
            }
           },
          "mejoraEmpanaderas1": {
            "precio": 1000,
            "unlocked": false,
            "consecuencia": {
              "efecto": "multiplicarEdificio",
              "objetivo": "empanaderas",
              "cantidad": 2
            }
          },
          "mejoraParrilla": {
            "precio": 2000,
            "unlocked": false,
            "consecuencia": {
              "efecto": "multiplicarEdificio",
              "objetivo": "parrilla",
              "cantidad": 2
          }
        },
      },
        "edificios": {
          "areperas": {
            "nombre": "Areperas",
            "descripcion": "Pequeños locales que producen arepas.",
            "cantidad": 0,
            "produccion": 0.1,
            "precio": 15,
            "precio_inicial": 15
          },
          "empanaderas": {
            "nombre": "Puesto de empanadas",
            "descripcion": "Ventas callejeras de empanadas.",
            "cantidad": 0,
            "produccion": 1,
            "precio": 100,
            "precio_inicial": 100
          },
          "parrilla": {
            "nombre": "Parrilla",
            "descripcion": "Puestos que venden carne asada.",
            "cantidad": 0,
            "produccion": 8,
            "precio": 1100,
            "precio_inicial": 1100
          },
          "cacao": {
            "nombre": "Fabrica de cacao",
            "descripcion": "Fabrica cacao.",
            "cantidad": 0,
            "produccion": 47,
            "precio": 12000,
            "precio_inicial": 12000
          },
          "helado": {
            "nombre": "Helados Tio Rico",
            "descripcion": "Heladeria Tio Rico.",
            "cantidad": 0,
            "produccion": 260,
            "precio": 130000,
            "precio_inicial": 130000
          },
          "ron": {
            "nombre": "Fabrica de Ron",
            "descripcion": "Fabrica ron.",
            "cantidad": 0,
            "produccion": 47,
            "precio": 12000,
            "precio_inicial": 12000
          },
          "hato": {
            "nombre": "Hato Llanero",
            "descripcion": "Cria ganado y produce cultivos.",
            "cantidad": 0,
            "produccion": 1400,
            "precio": 1400000,
            "precio_inicial": 1400000
          },
          "mineria": {
            "nombre": "Campamento Minero",
            "descripcion": "Extrae minerales.",
            "cantidad": 0,
            "produccion": 7800,
            "precio": 20000000,
            "precio_inicial": 20000000
          },
          "petrolera": {
            "nombre": "PetroRefineria",
            "descripcion": "Extrae y vende petroleo.",
            "cantidad": 0,
            "produccion": 44000,
            "precio": 330000000,
            "precio_inicial": 330000000
          },
          "moneda": {
            "nombre": "Fabrica de Papel Moneda",
            "descripcion": "Fabrica bolivares.",
            "cantidad": 0,
            "produccion": 260000,
            "precio": 5100000000,
            "precio_inicial": 5100000000
          }
        }
      }

    const datosUsuario = {datosCuenta: datosRegistro, datosJuego: gamedata}
    console.log(`Datos recibidos: ${JSON.stringify(datosUsuario)}`);

    const filePath = path.join(__dirname, 'data/users.json');


    try {
        // Verifica si el archivo existe
        let users = [];
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            users = JSON.parse(fileContent || '[]'); // Asegúrate de manejar archivos vacíos
        }

        // Verificar si el usuario ya existe
        const isAvailable = users.some((user) => user.datosCuenta.username === datosRegistro.username);

        if (isAvailable) {
            console.log('Nombre de usuario no disponible');
            return res.status(400).send({ ok: false, mensaje: 'Usuario ya existe' });
        }

        // Agregar nuevo usuario
        users.push(datosUsuario);

        // Guardar en el archivo
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
        fs.writeFileSync('data/gamedata.json', JSON.stringify(datosUsuario, null, 2));
        console.log('Usuario creado correctamente');
        res.send({ ok: true, mensaje: 'Usuario registrado' });
    } catch (err) {
        console.error(`Ocurrió un error en el servidor: ${err.message}`);
        res.status(500).send({ ok: false, mensaje: 'Error interno del servidor' });
    }
});

app.post('/login', (req, res) => {
    const datosLogin = req.body;
    const users = JSON.parse(fs.readFileSync('data/users.json'))
    const isOk = users.some((user) => user.datosCuenta.username === datosLogin.username && user.datosCuenta.password === datosLogin.password)

    try {
        if (isOk) {
            const user = users.find((user) => user.datosCuenta.username === datosLogin.username)
            fs.writeFileSync('data/gamedata.json', JSON.stringify(user, null, 2))
    
            res.send({ok: true, mensaje: 'Usuario logeado'})
        }
        else {
            res.send({ok: false, mensaje: 'Usuario y/o contraseña incorrectos'})
        }
    } catch (err) {
        console.error(`Ocurrió un error en el servidor: ${err.message}`);
        res.status(500).send({ ok: false, mensaje: 'Error interno del servidor' });
    }
});

app.get('/enviar-datos', (req, res) => {
    const datos = JSON.parse(fs.readFileSync('data/gamedata.json'))
    res.send(datos)
});

app.post('/save', (req, res) => {
    try {
        const datosNuevos = req.body;
        const users = JSON.parse(fs.readFileSync('data/users.json'))
        const userIndex = users.findIndex(user => user.datosCuenta.username === datosNuevos.datosCuenta.username)
        users[userIndex] = datosNuevos
        fs.writeFileSync('data/gamedata.json', JSON.stringify(datosNuevos, null, 2))
        fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2))
        res.send({ok: true, hola: userIndex})
    } catch (err) {
        res.send({ok: false})
    }

})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});