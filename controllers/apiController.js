import { User, Favorite } from '../models/relations.js'
import { createToken } from '../helpers/global.js'
import upload from '../middlewares/multer.js'
import cloudinary from '../helpers/cloudinary.js'
import path from 'path'


const singup = {
    post: async (req, res) => {
        const { email, name, password } = req.body

        try {
            const user = await User.findOne({ where: { email } })
            if (user) {
                return res.json({ "msg": "Este usuario ya está registrado", "statusCode": "404" })
            }
            await User.create({
                email,
                name,
                password
            })
            res.json({ "msg": "Usuario creado correctamente", "statusCode": "200" })

        } catch (error) {
            res.json({ "statusCode": "404", "msg": error.message })
        }
    }
}

const login = {
    post: async (req, res) => {
        const { email, password } = req.body
        try {
            const user = await User.findOne({ where: { email } })

            if (!user) {
                res.json({ statusCode: 404, msg: 'No pudimos encontrar este usuario en la base de datos' })
                return console.log('No such user')
            }
            if (!user.decodePassword(password)) {
                res.json({ statusCode: 401, msg: 'La contraseña es incorrecta' })
                return console.log('Wrong Password')
            }

            if (!user.confirmed) {
                return res.json({ statusCode: 401, msg: 'No has confirmado tu cuenta. Enviamos un correo a ' + user.email + ' con las indicaciones para confirmar tu cuenta.' })
            }
            const token = createToken(user.id)

            res.json({ token: token, msg: 'Has iniciado sesión correctamente', statusCode: '200', user: user["_previousDataValues"] })

        } catch (e) {
            console.log(e)
            res.json({ 'Error ': e.message })
        }
    }
}



const flowHome = {
    profileGet: async (req, res) => {
        //TODO => add validation for user

        try {
            const user = await User.findOne({ where: { email: 'davidecf@outlook.fr' } })
            const { name, profession, email, phone, linkedin, instagram } = user
            console.log(user)
            res.send({ name, profession, email, phone, linkedin, instagram })

        } catch (error) {
            res.send(error)
        }
    },
    favoritesGet: async (req, res) => {
        //:TODO => add validation or middleware for user

        try {
            const user = await User.findOne({ where: { email: 'davidecf@outlook.fr' } })
            const favorites = await Favorite.findAll({ where: { userId: user.id } })
            const contactIDs = favorites.map(id => id.contactId)
            const contacts = await User.findAll({ where: { id: contactIDs } })
            res.json(contacts)
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    },
    contactGet: async (req, res) => {

    },
    contactPut: async (req, res) => {
        //Adds a contact to the fav list

        try {
            const user = await User.findOne({ where: { email: 'davidecf@outlook.fr' } })
            const userId = user.id
            const { contactId } = req.body
            await Favorite.create({
                userId, contactId
            })
            res.json(userId)
        } catch (error) {
            res.json(error)
        }
    },
    uploadProfilePicture: async (req, res) => {
        const user = req.user
        console.log(req.body)
        const storage = upload.single('image')
        storage(req, res, () => {
            if (!req.file){
                return res.json({statusCode: '404', msg: 'A file must be provided'})
            }
            if (user.photo === '' || user.photo === null) {
                cloudinary.uploader.upload(
                    path.resolve('public/uploads/' + req.file.filename),
                    { resource_type: 'image' })
                    .then(async result => {
                        user.photo = result.url
                        await user.save()
                        console.log(result)
                        console.log(result.url)
                        res.json({statusCode: '200', msg: 'Imagen cargada correctamente', asset: result.secure_url})
                    }).catch(err => {
                        console.log(err)
                        res.json({msg: err})
                    })
                }
        })
    }
}

export {
    flowHome,
    singup,
    login
}