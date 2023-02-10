import express from 'express'
const app = express()
const PORT = process.env.PORT || 5500
import db from './config/db.js'
import Router from './routes/api.js'

//Database conection
db.authenticate()
    .then(() => console.log('DB connected successfully'))
    .catch(() => console.log('Failed to connect to DB', error))
db.sync({alter: true})

//Middlewares
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/app/api', Router)

app.listen(PORT, () => {
    console.log('Backend server started on PORT ' + PORT)
})