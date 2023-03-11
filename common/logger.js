const pino = require('pino');

const logger = pino({
   transport: {
       target: 'pino-pretty',
       options: {
           colorize: true
       }
   },
    formatters: {
        level: (label) => {
            return {
                level: label
            }
        }
    },
    timestamp: pino.stdTimeFunctions.isoTime
})

module.exports = logger;