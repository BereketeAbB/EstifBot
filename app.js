const express = require('express')
const axios = require('axios')
const path = require('path')

const bot = require('./bot/bot')
const mongoDb = require('./mongo/mongo')

const userRouter = require('./routes/user')

const app = express()

app.use(express.json())
app.use(express.static('public'))

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'public'))

app.use('/', userRouter)


bot.launch()
app.listen(3000, () => {
    console.log("listening 3000");
})














// app.get('/reqPage', (req, res) => {
//     res.status(200).render('question')
// })

// app.post("/appointment", (req, res) => {
//     console.log(req.body);
//     res.status(200).json({
//         status: true
//     })
// })

// app.get('/question/:userId', (req, res) => {
//     console.log(req.params);
//     res.render('question', {telegramId: req.params.userId})
// })