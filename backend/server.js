const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json())

app.post('/register', (req, res) => {
    const datosRegistro = req.body;
    const gamedata = {
        "coins": 0,
            "cps": 1,
            "mejoras": {
                "mejora1": false,
                "mejora2": false,
                "mejora3": false,
                "mejora4": false
            },
            "edificios": {
                "areperas": {
                    "nombre": "Areperas",
                    "descripcion": "Pequeños locales que producen arepas.",
                    "cantidad": 0,
                    "produccion": 0.1,
                    "precio": 15
                },
                "empanaderas": {
                    "nombre": "Puesto de empanadas",
                    "descripcion": "Ventas callejeras de empanadas.",
                    "cantidad": 0,
                    "produccion": 1,
                    "precio": 100
                },
                "parrilla": {
                    "nombre": "Parrilla",
                    "descripcion": "Puestos que venden carne asada.",
                    "cantidad": 0,
                    "produccion": 8,
                    "precio": 1100
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
            const gamedata = user.datosJuego
            fs.writeFileSync('data/gamedata.json', JSON.stringify(gamedata, null, 2))
    
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

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});