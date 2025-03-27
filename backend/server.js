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
    const gamedata = JSON.parse(fs.readFileSync('data/startingdata.json'))
    console.log(gamedata)

    const datosUsuario = {datosCuenta: datosRegistro, datosJuego: gamedata}
    console.log(`Datos recibidos: ${datosUsuario}`);

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