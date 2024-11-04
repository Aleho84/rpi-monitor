import { endpoints, verificarPing, rpiControl} from './src/functions.js'; 
import dotenv from "dotenv";
dotenv.config();

const server = process.env.SERVER | '192.168.0.2';
const intervalTime = 1000 * 60 * process.env.INTERVAL | 1000 * 60 * 5;

console.log(`[${new Date().toLocaleString()}] Monitoreo iniciado`);
console.log(`[${new Date().toLocaleString()}] Servidor: ${server} - Intervalo: ${intervalTime / 1000} segundos`);
rpiControl(endpoints.yellowLed);


const verificarEstado = async () => { // No necesita el argumento ipAddress
    const { alive, retry } = await verificarPing(server);
    const timestamp = new Date().toLocaleString();

    if (alive) {
        await Promise.all([
            rpiControl(endpoints.greenLed),
            rpiControl(endpoints.buzzerOff)
        ]);
        console.log(`[${timestamp}] Server Status: OK.`);
    } else if (retry <= 3) {
        console.log(`[${timestamp}] Server Status: FAIL. retry ${retry}`);
    } else {
        await Promise.all([
            rpiControl(endpoints.redLed),
            rpiControl(endpoints.buzzerOn)
        ]);
        console.error(`[${timestamp}] Server Status: FAIL.`);
    }
};

setInterval(verificarEstado, intervalTime); 