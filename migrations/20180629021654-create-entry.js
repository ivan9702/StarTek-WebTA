'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Entry', {
      EntryId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique:true,
        type: Sequelize.INTEGER,
      },
      DateTime: {
        allowNull: false,
        type: Sequelize.DATE
      },
      UserId: {
        allowNull: false,
        references: {
          model: 'User',
          key: 'UserId'
        },
        type: Sequelize.INTEGER,
      },
      EventId: {
        allowNull: false,
        references: {
          model: 'Event',
          key: 'EventId'
        },
        type: Sequelize.INTEGER,
      },
      LocationId: {
        allowNull: false,
        references: {
          model: 'Location',
          key: 'LocationId'
        },
        type: Sequelize.INTEGER,
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Entry');
  }
};
