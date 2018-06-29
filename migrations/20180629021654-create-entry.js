'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Entries', {
      EntryId: {
        allowNull: false,
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
          model: 'Users',
          key: 'UserId'
        },
        type: Sequelize.INTEGER,
      },
      EventId: {
        allowNull: false,
        references: {
          model: 'Events',
          key: 'EventId'
        },
        type: Sequelize.INTEGER,
      },
      LocationId: {
        allowNull: false,
        references: {
          model: 'Locations',
          key: 'LocationId'
        },
        type: Sequelize.INTEGER,
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Entries');
  }
};
