import express from 'express'
import { flowHome, singup, login } from '../controllers/apiController.js'
import isLoggedIn from '../middlewares/isLoggedIn.js'
import {logginMiddleware} from '../middlewares/logginMiddelware.js'
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

//AUTH
Router.route('/auth/signup')
    .post(singup.post)
Router.route('/auth/login')
    .post(login.post)
Router.route('/auth/checkSession')
    .post(logginMiddleware)

export default Router;