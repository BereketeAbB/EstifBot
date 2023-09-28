require('dotenv').config()

const { Question } = require('../../mongo/Schema')
const mongoDb = require('../../mongo/mongo')
const questionMaker = require('../../utils/utils')
const estifController = require('./../controller/estifController')

class EstifMenu {
    constructor(bot){
        this.bot = bot
        this.startUI = "Welcome Estif! \nHere you will get your questions"
        
    }
       

    startMenu = (ctx) => {
        const {first_name, username, id} = ctx.from 
    
        ctx.sendMessage(this.startUI, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Get Questions",
                            callback_data: "getQuestionsOption"
                        }
                    ]
                ]
            }
        })
        
    }
    
    getQuestionsOptionMenu = (ctx) => {
        //console.log(ctx.update.callback_query.message);
       // ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    
        ctx.sendMessage("Choose Message Types", {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "New Messages",
                            callback_data: "getNewQuestions"
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

    getNewQuestionsMenu(ctx) {
        //ctx.deleteMessage(ctx.update.callback_query.message.message_id)

        let questions = []
        let noNewMessage = `No New Messages`
        let cantGetNewMessages = `Can't get new Messages`
        
        estifController.getNewQuestions(ctx)
            .then((data) => {
                questions = data.result.questions || []

                //setTimeout
                questions.forEach(question => {
                    ctx.sendMessage(questionMaker.makeQuestion(question), {
                        parse_mode: "HTMl",
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: "Reply Privately",
                                        callback_data: `private_${question._id}`
                                    },
                                    {
                                        text: "Answer on Group",
                                        callback_data: `group_${question._id}`
                                    }
                                ],
                                [
                                    {
                                        text: "Seen Only",
                                        callback_data: `seen_${question._id}`
                                    },
                                    {
                                        text: "Discard",
                                        callback_data: `discard_${question._id}`
                                    }
                                ]
                            ]
                        }
                    }) 
                });
                ctx.sendMessage("Go back", {
                    parse_mode: "HTMl",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Get Questions",
                                    callback_data: "getQuestionsOption"
                                }
                            ]
                        ]
                    }
                }) 
            })
            .catch((err) => {
                if(err.status){
                    ctx.sendMessage(noNewMessage, {
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: "Go Back",
                                        callback_data: "getQuestionsOption" 
                                    }
                                ]
                            ]
                        }
                    })
                }
                else if(!err.status){
                    ctx.sendMessage(ctx.chat.id, cantGetNewMessages, {
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: "Go Back",
                                        callback_data: "getQuestionsOption" 
                                    }
                                ]
                            ]
                        }
                    })
                }
            })

    }

    async getPrivateReplyPrompt (ctx) {
        const questionId = ctx.match[1]

        const question = await Question.findById(questionId)

        ctx.reply(questionMaker.makeResponseConfirm(question, "private"), {
            parse_mode: "HTML"
        })

        this.bot.on('message', async (ctx) => {
            const response = ctx.message.text
            this.bot.telegram.sendMessage(question.user.telegramId, questionMaker.makeResponse(question, response), {
                parse_mode: "HTML"
            })

            ctx.reply("Your answer has been sent privately. If he has't stopped the bot, he will be receiving it.")

            await mongoDb.addAnswer(question._id, response)
                .catch(err => {
                    ctx.reply("Error: your answer has not been updated to the database.")
                })

            await mongoDb.makeSeen(question._id)
                .catch(err => {
                    ctx.reply("Error: Seen Status has not been updated.")
                })

            ctx.sendMessage("Choose Message Types", {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "New Messages",
                                callback_data: "getNewQuestions"
                            },
                            {
                                text: "By Username",
                                callback_data: "getQuestionsByUsername"
                            }
                        ]
                    ]
                }
            })
        })

    }

    async getGroupReplyPrompt (ctx) {
        const questionId = ctx.match[1]
        console.log(questionId);

       try {
        const question = await Question.findById(questionId)
             .catch(err => {
                 throw new Error(err.message)
             })
 
         ctx.reply(questionMaker.makeResponseConfirm(question, "private"), {
             parse_mode: "HTML"
         })
 
         this.bot.on('message', async (ctx) => {
             const response = ctx.message.text
             this.bot.telegram.sendMessage(process.env.CHANNEL_USERNAME, questionMaker.makeResponseGroup(question, response), {
                 parse_mode: "HTML"
             })
 
             await mongoDb.addAnswer(question._id, response)
                 .catch(err => {
                     ctx.reply("Error: your answer has not been updated to the database.")
                 })

            ctx.reply("Your answer has been sent privately. If he has't stopped the bot, he will be receiving it.")
 
             await mongoDb.makeSeen(question._id)
                 .catch(err => {
                     ctx.reply("Error: Seen Status has not been updated.")
                 })
 
             ctx.sendMessage("Choose Message Types", {
                 parse_mode: "HTML",
                 reply_markup: {
                     inline_keyboard: [
                         [
                             {
                                 text: "New Messages",
                                 callback_data: "getNewQuestions"
                             },
                             {
                                 text: "By Username",
                                 callback_data: "getQuestionsByUsername"
                             }
                         ]
                     ]
                 }
             })
         })
 
        } catch (error) {
            console.log(error);
       }
    }

    async getQuestionSeenOnly (ctx) {
        const questionId = ctx.match[1]

       try {
        const question = await Question.findById(questionId)
             .catch(err => {
                 throw new Error(err.message)

                })
                
            await mongoDb.makeSeen(question._id)
            .catch(err => {
                ctx.reply("Error: Seen Status has not been updated.")
            })
 
            ctx.deleteMessage(ctx.update.callback_query.message.message_id)

        } catch (error) {
            console.log(error);
       }
    }

    async discardQuestion(ctx) {
        const question = ctx.match[1]

        await Question.findByIdAndDelete(question._id)
            .then(data => {
                ctx.reply("Question Deleted from the database") 
            })
            .catch( err => {
                throw new Error(err.message)
            })

    }
}

module.exports = EstifMenu