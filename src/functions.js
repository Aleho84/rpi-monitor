
import ping from 'ping';
import axios from 'axios';

let retry = 0;

export const endpoints = {
    redLed: 'https://aleho.sytes.net:5000/api/gpioSetRed',
    greenLed: 'https://aleho.sytes.net:5000/api/gpioSetGreen',
    yellowLed: 'https://aleho.sytes.net:5000/api/gpioSetYellow',
    buzzerOn: 'https://aleho.sytes.net:5000/api/buzzerOn',
    buzzerOff: 'https://aleho.sytes.net:5000/api/buzzerOff'
};

export const verificarPing = async (ipAddress) => {
    try {
        const res = await ping.promise.probe(ipAddress);
        res.alive ? retry = 0 : retry += 1;        
        return { alive: res.alive, retry }
    } catch (err) {
        console.error(`Error al hacer ping a ${ipAddress}: ${err}`);
        retry += 1;
        return { alive: false, retry };
    }
};

export const rpiControl = async (endpoint) => {
    try {
        const response = await axios.get(endpoint);
        return response.status === 200; // Retorna si la petición fue exitosa
    } catch (error) {
        console.error(`Error al controlar ${endpoint}:`, error.message);
        return false; // Si hay un error, asumimos que el control falló
    }
};
