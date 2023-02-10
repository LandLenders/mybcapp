import { Sequelize } from "sequelize";

const CONFIG = {
    db_host: 'localhost',
    db_user: 'root',
    db_password: 'Juliana2ochoa',
    db_name: 'mybc',
    db_port: 3306
}

const db = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password , {
    host: CONFIG.db_host,
    port: CONFIG.db_port,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 10000
    }
})

export default db