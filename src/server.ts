import dotenv from "dotenv";
import http from "http";
import app from "./app";
// import wsServer from './services/webSocketService';
import connectDB from "./config/db";

dotenv.config();

// Подключение к базе данных
connectDB();

// Запуск сервера
const server = http.createServer(app);

// Настройка WebSocket
server.on("upgrade", (request, socket, head) => {
  // wsServer.handleUpgrade(request, socket, head, (ws) => {
  //   wsServer.emit('connection', ws, request);
  // });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
