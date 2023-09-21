const {Telegraf} = require('telegraf')
const Question = require('./../../mongo/Schema')
const mongoDb = require('./../../mongo/mongo')
const {sendQuestion} = require('./../../utils/utils')
const {Estif} = require('./../menu/estif')
const {User} = require('./../menu/user')

const bot = new Telegraf("6379778395:AAG6aEGdbnvOMwmxRSWXkM_L-maefn8nZxg")

const estif = new Estif(bot)
const user = new User(bot)

exports.startUI = async (ctx) => {
    const {first_name, username, id} = ctx.from 
    
    const userCheck = await Question.findOne({telegramId: id})
    if(userCheck && userCheck.telegramId == process.env.ESTIF_ID){
        estif.startMenu()
        return
    }
    else if(userCheck){
        console.log("user found");
        user.startMenu(ctx.from.id)
        return
    } else {
        user.startMenu(ctx.from.id)
    }
    console.log(id);

    await Question.create({
            telegramId: id, 
            userData: {
                telegramName: first_name,
                username
            }
        })
        .then((data) => {
            console.log("Database recorded");
        })
        .catch(err => {
            console.log(err);
            ctx.reply(err.message)
        })
    }

exports.getQuestionsOption = (ctx) => {
    bot.telegram.deleteMessage(ctx.chat.id, ctx.update.callback_query.message.message_id)

    bot.telegram.sendMessage(ctx.from.id, "Choose Message Types", {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "New Messages",
                        callback_data: "getNewMessages"
                    },
                    {
                        text: "By Username",
                        callback_data: "getQuestionsByUsername"
                    }
                ]
            ]
        }
    })
}



exports.getNewMessages = async (ctx) => {
    bot.telegram.deleteMessage(ctx.chat.id, ctx.update.callback_query.message.message_id)
    

    let quizs = []

    await mongoDb.getQuestions({isSeen: false})
        .then( data => {
            if(data.status && data.result.length == 0){
                console.log("HERE");
                return quizs = []
            } else if(data.status){
                return quizs = data.result.questions
            }
        })
        .catch((err) => {
            console.log(err);
        })


        console.log(quizs)
    let filteredQuestions = []

    quizs.forEach(el => {
        filteredQuestions[i].username = 
    })

    quizs.forEach(question => {
        setInterval(() => {
            bot.telegram.sendMessage(ctx.chat.id, 
                sendQuestion(
                    question.userData.username, 
                    question.isUrgent, 
                    question.question.questionTitle, 
                    question.question.questionText, 
                    question.question.date), {
                        parse_mode: "HTMl",
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: "Accept",
                                        callback_data: "hello"
                                    },
                                    {
                                        text: "Discard",
                                        callback_data: "hello"
                                    }
                                ]
                            ]
                        }
                    })
        }, 2000)
    });
}