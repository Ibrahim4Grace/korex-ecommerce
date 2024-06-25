const mongoose = require('mongoose');
const logger = require('../../logger/logger');
const config = require('../../configs/customEnvVariables');

async function connectAndStartServer(server) {
  try {
    await mongoose.connect(config.MongoDbURI);

    mongoose.connection.on('connected', () => {
      logger.info('Mongodb Atlas Database Connected...');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    const port = config.port;
    server.listen(port, () => {
      logger.info(`Server started on port ${port}`);
    });
  } catch (err) {
    logger.error('Unable to start the server:', err.message);
  }
}

module.exports = connectAndStartServer;
