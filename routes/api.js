import express from 'express'
import { flowHome, singup, login } from '../controllers/apiController.js'
import isLoggedIn from '../middlewares/isLoggedIn.js'
const Router = express.Router()

//MAIN
Router.route('/')
    .get(flowHome.profileGet)
Router.route('/favorites')
    .get(flowHome.favoritesGet)
Router.route('/favorites')
    .put(flowHome.contactPut)


//AUTH
Router.route('/auth/signup')
    .post(singup.post)
Router.route('/auth/login')
    .post(login.post)
Router.route('auth/checkSession')
    .post(isLoggedIn)


export default Router;