import { DataTypes} from 'sequelize'
import db from '../config/db.js'

const Network = db.define('networks', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    body: {
        type: DataTypes.TEXT
    }
})

export default Network