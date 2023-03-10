import { DataTypes } from 'sequelize'
import db from '../config/db.js'
import bcrypt from 'bcrypt'

const User = db.define('users', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    linkedin: DataTypes.STRING,
    instagram: DataTypes.STRING,
    facebook: DataTypes.STRING,
    email: DataTypes.STRING,
    profession: DataTypes.STRING,
    profile: DataTypes.STRING,
    photo: DataTypes.STRING,
    url: DataTypes.STRING,
    company: DataTypes.STRING,
    about: DataTypes.TEXT,
    behance: DataTypes.STRING,
    twitter: DataTypes.STRING,
    youtube: DataTypes.STRING,
    web: DataTypes.STRING,
    zoom: DataTypes.STRING,
    tiktok: DataTypes.STRING,
    twich: DataTypes.STRING,
    github: DataTypes.STRING,
    discord: DataTypes.STRING,
},{
    hooks:{
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password, salt)
        }
    }
})

User.prototype.decodePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

export default User