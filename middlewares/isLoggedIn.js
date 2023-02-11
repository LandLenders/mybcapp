import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const isLoggedIn = async (req, res, next) => {
    const {_sessionToken} = req.body

    try {
        const decodedToken = jwt.verify(_sessionToken, '7nzAcZNnlQh0tqyzNERkkeN7HKpZo2wU')
        console.log(decodedToken.id)
        const user = await User.findOne({where: {id: decodedToken.id}})
        req.user = user
        res.json({statusCode: '200', ...user})
    }catch(e){
        res.json({statusCode: '401', msg: 'Forbidden'})
        console.log(e)
    }
}

export default isLoggedIn