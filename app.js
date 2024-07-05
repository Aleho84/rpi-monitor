import ping from 'ping';
import axios from 'axios';

const endpoints = {
    redLed: 'https://aleho.sytes.net:5000/api/gpioSetRed',
    greenLed: 'https://aleho.sytes.net:5000/api/gpioSetGreen',
    buzzerOn: 'https://aleho.sytes.net:5000/api/buzzerOn',
    buzzerOff: 'https://aleho.sytes.net:5000/api/buzzerOff'
};

const server = 'aleho.sytes.net';
const intervalTime = 10 * 60 * 1000; // 10 minutos en milisegundos

console.log('Monitoreo iniciado');

const verificarPing = async (ipAddress) => {
    try {
        const res = await ping.promise.probe(ipAddress);
        return res.alive; // Retorna directamente el resultado
    } catch (err) {
        console.error(`Error al hacer ping a ${ipAddress}: ${err}`);
        return false;
    }
};

const rpiControl = async (endpoint) => {
    try {
        const response = await axios.get(endpoint);
        return response.status === 200; // Retorna si la petición fue exitosa
    } catch (error) {
        console.error(`Error al controlar ${endpoint}:`, error.message);
        return false; // Si hay un error, asumimos que el control falló
    }
};

const verificarEstado = async () => { // No necesita el argumento ipAddress
    const isOnline = await verificarPing(server);
    const timestamp = new Date().toLocaleString()

    if (isOnline) {
        await Promise.all([
            rpiControl(endpoints.greenLed),
            rpiControl(endpoints.buzzerOff)
        ]);
        console.log(`[${timestamp}] Server Status: OK.`);
    } else {
        await Promise.all([
            rpiControl(endpoints.redLed),
            rpiControl(endpoints.buzzerOn)
        ]);
        console.error(`[${timestamp}] Server Status: FAIL.`);
    }
};

setInterval(verificarEstado, intervalTime); 