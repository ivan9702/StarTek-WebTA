module.exports = {
  development: {
    dialect: "sqlite",
    storage: "./webTA.sqlite"
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:"
  },
  production: {
    dialect: 'postgres',
    use_env_variable: 'DATABASE_URL'
  }
};
