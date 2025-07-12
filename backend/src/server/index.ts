// Server configuration and startup
import app from "../app";

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("💀 HTTP server closed");
  });
});

process.on("SIGINT", () => {
  console.log("👋 SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("💀 HTTP server closed");
  });
});

export default server;
