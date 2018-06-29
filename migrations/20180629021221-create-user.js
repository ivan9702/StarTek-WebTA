'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      UserId: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.INTEGER,
      },
      UserName: {
        allowNull: false,
        unique:true,
        type: Sequelize.STRING
      },
      NameString: {
        allowNull: false,
        type: Sequelize.STRING
      },
      PrivilegeId: {
        allowNull: false,
        references: {
          model: 'Privileges',
          key: 'PrivilegeId'
        },
        type: Sequelize.INTEGER,
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
