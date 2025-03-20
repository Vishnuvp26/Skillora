import morgan from "morgan";
import winston from "winston";
import "winston-daily-rotate-file";

const transport = new (winston.transports as any).DailyRotateFile({
    filename: "logs/%DATE%-requests.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
});

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [transport],
});

// Morgan
const morganMiddleware = morgan("combined", {
    stream: {
        write: (message: string) => logger.info(message.trim()),
    },
});

export { morganMiddleware, logger };