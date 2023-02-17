import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const isLoggedIn = async (req, res, next) => {
    const _sessionToken = req.headers.authorization

    try {
        const decodedToken = jwt.verify(_sessionToken, '7nzAcZNnlQh0tqyzNERkkeN7HKpZo2wU')
        if (!decodedToken){
            return res.json({statusCode: '401', msg: 'Token de sessión Inválido'})
        }
        console.log(decodedToken.id)
        const user = await User.findOne({where: {id: decodedToken.id}})
        req.user = user
        next()
    }catch(e){
        res.json({statusCode: '401', msg: 'Forbidden'})
        console.log(e)
    }
}

export default isLoggedIn