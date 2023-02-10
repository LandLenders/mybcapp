import jwt from 'jsonwebtoken'

const createToken = id => jwt.sign({id}, '7nzAcZNnlQh0tqyzNERkkeN7HKpZo2wU', {expiresIn: '30d'})

export {
    createToken
}