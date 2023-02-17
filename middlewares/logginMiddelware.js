import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const logginMiddleware = async (req, res, next) => {
    const {_sessionToken} = req.body

    try {
        const decodedToken = jwt.verify(_sessionToken, '7nzAcZNnlQh0tqyzNERkkeN7HKpZo2wU')
        if (!decodedToken){
            return res.json({statusCode: '401', msg: 'La sessión ha expirado'})
        }
        console.log(decodedToken.id)
        const user = await User.findOne({where: {id: decodedToken.id}})
        req.user = user
        res.json({statusCode: '200', ...user['_previousDataValues']})
        next()
    }catch(e){
        res.json({statusCode: '401', msg: 'Forbidden'})
        console.log(e)
    }
}

export{logginMiddleware}