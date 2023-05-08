const winston = require("winston");

require("dotenv").config();

const logger = winston.createLogger({
  format: winston.format.combine(
    // Add timestamp to log messages
    winston.format.timestamp(),
    // Pretty print JSON objects
    winston.format.printf(({ timestamp, message, action }) => {
      return `Date: \n${timestamp} \n\nAction: \n${action} \n\nMessage: \n${JSON.stringify(
        message,
        null,
        2
      )}\n\n ----------------------------------------------`;
    })
  ),
});

//Add logging to console
logger.add(new winston.transports.Console());

//Add logging to file
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV == "production") {
  logger.add(new winston.transports.File({ filename: "log.log" }));
}

module.exports = { logger };
