import express from 'express'
import { flowHome, singup, login } from '../controllers/apiController.js'
import isLoggedIn from '../middlewares/isLoggedIn.js'
import { logginMiddleware } from '../middlewares/logginMiddelware.js'
const Router = express.Router()

//MAIN
Router.route('/')
    .get(isLoggedIn, flowHome.profileGet)
Router.route('/favorites')
    .get(flowHome.favoritesGet)
Router.route('/favorites')
    .put(flowHome.contactPut)
Router.route('/upload-picture')
    .post(isLoggedIn, flowHome.uploadProfilePicture)
Router.route('/get-contact/:id')
    .get(isLoggedIn, flowHome.contactGet)
Router.route('/get-all-contacts')
    .get(isLoggedIn, flowHome.getAllContacts)
Router.route('/find-by-url/:url')
    .get(isLoggedIn, flowHome.findContactByUrl)
Router.route('/add-remove-contact')
    .post(isLoggedIn, flowHome.addRemoveContact)
Router.route('/create-network')
    .post(isLoggedIn, flowHome.createNetwork)
Router.route('/upate-profile')
    .put(isLoggedIn, flowHome.updateProfile)

//AUTH
Router.route('/auth/signup')
    .post(singup.post)
Router.route('/auth/login')
    .post(login.post)
Router.route('/auth/checkSession')
    .post(logginMiddleware)

export default Router;