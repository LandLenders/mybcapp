import jwt from 'jsonwebtoken'

const createToken = id => jwt.sign({id}, '7nzAcZNnlQh0tqyzNERkkeN7HKpZo2wU', {expiresIn: '30d'})
const KeyGen = () => {
    return Math.random().toString(32).substring(2)
}

const authToken = () => {
    return Math.floor(1000 + Math.random() * 9000);
}

export {
    createToken,
    KeyGen,
    authToken
}