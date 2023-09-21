const express = require('express')
const axios = require('axios')
require('dotenv').config()

const mongoDb = require('./../mongo/mongo')
const expressText = require("./../utils/sendFromExpress")

const router = express.Router()

router.get('/question/:userId', (req, res) => {
    console.log(req.params);
    res.render('question', {telegramId: req.params.userId})
})

router.post('/question', async (req, res) => {
    
    const {name, telegramId, phoneNumber} = req.body
    const {questionTitle, question, date} = req.body
    const questionText = question
    let username

    const userData = {name, telegramId, phoneNumber}
    const questionObj = {questionTitle, questionText, date}
        

        try {
            await mongoDb.addQuestion(telegramId, userData, questionObj)
                .then((data) =>  {
                    username = data.result.username
                    
                    res.status(200).json({
                        status: true,
                        result: {
                            msg: "Question Added to DB" // "Question Added, Msg sent to Estif and the user, Welcome message sent to the user"
                        }
                    })
                })
                .catch((err) => {
                    res.status(200).json({
                        status: false,
                        result: {
                            msg: "Question not Added to DB", // "Question Added, Msg sent to Estif and the user, Welcome message sent to the user"
                            error: err.result.err
                        }
                    })
                    throw new Error (err.result.msg)
                })
                
            await expressText.sendEstifMessagePro(`@${username} has sent you a question titled ' ${questionTitle} '`)
                .catch( err => {
                    throw new Error( err.result.msg)
                })

            await expressText.sendUserMessagePro(telegramId, "ጥያቄዎችዎን ተቀብያለሁ! መልሱን ይጠብቁኝ")
                .catch( err => {
                    throw new Error(err.result.msg)
                })

            await expressText.sendWelcomePro(telegramId)
                .catch((err) => {
                    throw new Error(err.result.msg)
                })


        } catch (error) {
            console.log(error.message);
            await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
                chat_id: telegramId, 
                text: error.message,
            })
            // return res.status(400).json({
            //     status: false,
            //     result: {
            //         msg: error.message
            //     }
            // })
        }
    })


module.exports = router;