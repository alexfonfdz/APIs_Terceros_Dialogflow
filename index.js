const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('El servidor está funcionando - Equipo 1');
});


// Ruta para manejar solicitudes POST del webhook de Dialogflow
app.post('/webhook', (req, res) => {
    // Verificar que la estructura de la solicitud es la esperada
    if (!req.body || !req.body.queryResult) {
        return res.status(400).json({
            fulfillmentText: "Lo siento, no se recibió la solicitud correctamente."
        });
    }

    const parameters = req.body.queryResult.parameters;

    // Verificar que el parámetro "producto" existe
    if (!parameters || !parameters.producto || parameters.producto.length === 0) {
        return res.json({
            fulfillmentText: "Lo siento, no se recibió el producto."
        });
    }

    // Extraer el parámetro "producto" enviado desde Dialogflow
    const producto = parameters.producto[0]; // Asegúrate de que sea un arreglo y toma el primer elemento

    // Simulación de respuestas de precio
    const precios = {
        'iphone': 999,
        'televisor': 499,
    };

    const precioProducto = precios[producto.toLowerCase()];

    if (precioProducto) {
        // Enviar la respuesta a Dialogflow
        res.json({
            fulfillmentText: `El precio de ${producto} es ${precioProducto} USD.`
        });
    } else {
        res.json({
            fulfillmentText: `Lo siento, no tengo información para el producto ${producto}.`
        });
    }
});

// Iniciar el servidor en el puerto 3000
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
