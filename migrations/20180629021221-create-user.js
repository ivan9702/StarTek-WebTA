'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('User', {
      UserId: {
        allowNull: false,
        autoIncrement: true,
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
          model: 'Privilege',
          key: 'PrivilegeId'
        },
        type: Sequelize.INTEGER,
      },
      DepartmentId: {
        references: {
          model: 'Department',
          key: 'DepartmentId'
        },
        type: Sequelize.INTEGER,
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('User');
  }
};
