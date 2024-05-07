import pino, { destination } from "pino";

const transport = pino.transport({
  targets: [
    {
      target:"pino-pretty",
      options: {
        destination: "./logs/ouput.log",
        mkdir: true,
        //colorize: false,
      }
    },
    {
      target:"pino-pretty",
      options: {
        destination: process.stdout.fd
      }
    }
  ]
});

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || "info",
  //formatters: lavel => {
  //  return {
  //    level: lavel.toUpperCase()
  //  }
  //}
}, transport);

export default logger;

