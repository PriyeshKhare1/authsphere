// import dotenv from "dotenv";

// // Load environment variables FIRST before any other imports
// dotenv.config();

// import http from "http";
// import connectDB from "./src/config/db.js";
// import app from "./src/app.js";
// import { initSocket } from "./src/utils/socket.js";

// connectDB();

// const PORT = process.env.PORT || 5000;
// const server = http.createServer(app);

// initSocket(server);

// server.listen(PORT, () => console.log(`Backend running on port ${PORT} ✅`));


import dotenv from "dotenv";
dotenv.config();

import http from "http";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import { initSocket } from "./src/utils/socket.js";

connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () =>
  console.log(`Backend running on port ${PORT} ✅`)
);
