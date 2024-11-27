const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json())

app.post('/register', (req, res) => {
    const datosUsuario = req.body;
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
        const isAvailable = users.some((user) => user.username === datosUsuario.username);

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

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});