require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')
const authCtrl = require('./controllers/authController')
const auth = require('./middleware/authMiddleware')
const treasureCtrl = require('./controllers/treasureController')
const port = 4000
const { CONNECTION_STRING, SESSION_SECRET } = process.env
const app = express()

app.use(express.json())

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db connected')
})
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.userOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.userOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.userOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)


app.listen(port, () => console.log(`${port}`))