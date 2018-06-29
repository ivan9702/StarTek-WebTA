'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Departments', {
      DepartmentId: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.INTEGER,
      },
      Name: {
        allowNull: false,
        unique:true,
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Departments');
  }
};
