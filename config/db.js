import { Sequelize } from "sequelize";

const CONFIG = {
    db_host: process.env.HOST || 'localhost' ,
    db_user: process.env.USER || 'root',
    db_password: process.env.PASS || 'Juliana2ochoa',
    db_name: process.env.NAME || 'mybc',
    db_port: process.env.dbPORT || 3306
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