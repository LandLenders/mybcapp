import { User, Favorite, Contact, Network } from '../models/relations.js'
import { createToken } from '../helpers/global.js'
import upload from '../middlewares/multer.js'
import cloudinary from '../helpers/cloudinary.js'
import path from 'path'
import fs from 'fs'
import slug from 'slug'


const singup = {
    post: async (req, res) => {
        const { email, name, password } = req.body

        try {
            const user = await User.findOne({ where: { email } })
            const users = await User.findAll()
            if (user) {
                return res.json({ "msg": "Este usuario ya está registrado", "statusCode": "404" })
            }
            await User.create({
                email,
                name,
                password,
                url: slug(`${name}${users.length}`)
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
        const { id } = req.params
        try {
            const contact = await User.findOne({ where: { id } })
            if (!contact) {
                return res.json({ statusCode: '401', msg: `No se encontró un contacto con el id ${id}` })
            }
            res.json({ contact, statusCode: '200' })
        } catch (error) {
            res.json({ statusCode: '404', msg: error.message })
            console.log(error)
        }
    },
    findContactByUrl: async (req, res) => {
        const {url} = req.params
        const {id} = req.user

        try {
            const user = await User.findOne({where: {url}})
            if (!user){
                console.log('No se encontró el usuario')
                return res.json({statusCode: 404, msg: 'Usuario no encontrado'})
            }
            const contact = await Contact.findOne({where:{
                userId: id,
                contactId: user.id
            }})
            if (contact){
                res.json({statusCode: '200', user, contact: true})
                console.log(contact)
            }else{
                res.json({statusCode: '200', user, contact: false})
            }
        } catch (error) {
            res.json({statusCode: '404', msg: error})
        }
    },
    getAllContacts: async (req, res) => {
        const user = req.user
        try {
            const contacts = await Contact.findAll({ where: { userId: user.id } })
            const contactIds = contacts.map(id => id.contactId)
            const allContacts = await User.findAll({where:{id: contactIds}})
            if (!contacts) {
                return res.json({ statusCode: '400', msg: 'Este usuario no tiene contactos' })
            }
            res.json(allContacts)
        } catch (error) {
            res.json({ statusCode: '404', msg: error })
        }

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
        console.log(req.headers)
        const storage = upload.single('image')
        storage(req, res, () => {
            if (!req.file) {
                return res.json({ statusCode: '404', msg: 'A file must be provided' })
            }
            if (user.photo === '' || user.photo === null) {
                cloudinary.uploader.upload(
                    path.resolve('public/uploads/' + req.file.filename),
                    { resource_type: 'image' })
                    .then(async result => {
                        user.photo = result.url
                        await user.save()
                        fs.unlinkSync(path.resolve('public/uploads/' + req.file.filename))
                        res.json({ statusCode: '200', msg: 'Imagen cargada correctamente', asset: result.url })
                    }).catch(err => {
                        console.log(err)
                        res.json({ msg: err.message })
                    })
            } else {
                cloudinary.uploader.destroy(user.photo.split('/')[7].split('.')[0])
                    .then(async result => {
                        console.log(result)
                        user.photo = ''
                        await user.save()
                    })
                cloudinary.uploader.upload(
                    path.resolve('public/uploads/' + req.file.filename),
                    { resource_type: 'image' })
                    .then(async result => {
                        user.photo = result.url
                        await user.save()
                        fs.unlinkSync(path.resolve('public/uploads/' + req.file.filename))
                        res.json({ statusCode: '200', msg: 'Imagen cargada correctamente.', asset: result.url })
                    }).catch(err => {
                        console.log(err)
                        res.json({ msg: err.message })
                    })
            }
        })
    },
    addRemoveContact: async (req, res) => {
        const {id} = req.user
        const {contactID} = req.body

        try {
            const contact = await Contact.findOne({where:{userId: id, contactId: contactID}})
            if (!contact){
                await Contact.create({
                    userId: id,
                    contactId: contactID
                }).then(() => {
                    res.json({statusCode: '200', msg: 'Contacto Agregado '})
                }).catch(e => console.log(e))
            }else{
                await Contact.destroy({where: {userId: id, contactId: contactID}})
                    .then(() => {
                        res.json({statusCode: '200', msg: 'Contacto Eliminado' })
                    }).catch(e => console.log(e))
            }
        } catch (error) {
            res.json({statusCode: '404', msg: error})
        }
    },
    addRemoveContactFromNetwork: async (req, res) => {
    },
    createNetwork: async (req, res) => {
        const {name} = req.body
        const user = req.user
        console.log(name)
        try {
            const network = await Network.findOne({where:{userId: user.id, name}})
            if (network){
               return res.json({stausCode: '401', msg: 'No puedes crear 2 Networks con el mismo nombre, intenta un nombre diferente'})
            }
            await Network.create({
                name,
                userId: user.id
            })
            res.json({statusCode: '200', msg: 'Network creado correctamente'})

        } catch (error) {
            
        }
    },
    updateProfile: async (req, res) => {
        const user = req.user
        const data = req.body
        //update user data
        console.log(data)

        try {
            user.name = data.name
            user.profession = data.profession
            user.phone = data.phone
            user.about = data.about
            user.company = data.company
            user.url = data.url
            await user.save()
            res.json({statusCode: '200', msg: 'Perfil actualizado correctamente'})
        } catch (error) {
            
            res.json({statusCode: '404', msg: error.message})
        }

    }
    
}

export {
    flowHome,
    singup,
    login
}