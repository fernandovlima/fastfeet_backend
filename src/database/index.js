import Sequelize from 'sequelize';

// models
import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import File from '../app/models/File';
import Deliveryman from '../app/models/Deliveryman';
import RecipientSignature from '../app/models/RecipientSignature';

import databaseConfig from '../config/database';

const models = [User, Recipient, File, Deliveryman, RecipientSignature];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
