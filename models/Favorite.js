import { DataTypes} from 'sequelize'
import db from '../config/db.js'

const Favorite = db.define('favorites', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    contactId: DataTypes.STRING
})

export default Favorite