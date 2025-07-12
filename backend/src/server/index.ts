// Server configuration and startup
import app from "../app";
import logger from "../helpers/logger";

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("👋 SIGTERM signal received: closing HTTP server");
  server.close(() => {
    logger.info("💀 HTTP server closed");
  });
});

process.on("SIGINT", () => {
  logger.info("👋 SIGINT signal received: closing HTTP server");
  server.close(() => {
    logger.info("💀 HTTP server closed");
  });
});

export default server;
