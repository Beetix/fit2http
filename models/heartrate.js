'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class heartrate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  heartrate.init({
    time: DataTypes.DATE,
    heartrate: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'heartrate',
  });
  return heartrate;
};