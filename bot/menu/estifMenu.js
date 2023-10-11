require('dotenv').config()

const { Question, User } = require('../../mongo/Schema')
const mongoDb = require('../../mongo/mongo')
const questionMaker = require('../../utils/questionMaker')
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
    
    getQuestionsOptionMenu = (ctx) => { // Quesiton Selection Options
        ctx.deleteMessage()
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
                            callback_data: "getListOfUsernames"
                        }
                    ]
                ]
            }
        })
    }

    getNewQuestionsMenu(ctx) {  // Get New Questions with answering options
        ctx.deleteMessage()
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

    async getQuestionsByUsername(ctx) { // Get Questions by username with answering options
        const username = ctx.match[1]
        ctx.deleteMessage()

        const questions = await Question.find({'user.username': username})

        if(!questions)
            return ctx.sendMessage("No message with this username", {
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
        
        questions.forEach(question => {
            ctx.sendMessage(`${question.isSeen? "<b>Seen</b>\n": "<b>Not Seen</b>\n"}${questionMaker.makeQuestion(question)}`, {
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
        })

        setTimeout(() => {
            ctx.sendMessage("Go Back", {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Questions Menu",
                                callback_data: "getQuestionsOption" 
                            }
                        ]
                    ]
                }
            })
        }, 8000)
    }

    async getListOfUsernames(ctx) { //Get List of usernames in inline keyboard
        ctx.deleteMessage()

        let usernameArr = []
        const quesitons = await User.find({username: {$ne: ""}}).select("+username +telegramId")

        try {
            quesitons.forEach(question => {
                if(question.telegramId != undefined && !usernameArr.includes(question.telegramId)){
                    usernameArr.push(question.username)
                }
            })
            if(usernameArr.length == 0)
                return ctx.reply(noNewMessage, {
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
                let usernameKB = []
                usernameArr.forEach(username => {
                    usernameKB.push([{
                        text: username,
                        callback_data: `USR_${username}`
                    }]) 
                })
                    ctx.sendMessage("List of Usernames", {
                        reply_markup: {
                            inline_keyboard: usernameKB
                        }
                })
        } catch (error) {
            ctx.reply(`Go back /home . ${error.message}`)
        }

    }

    async getPrivateReplyPrompt (ctx) { // Answer Questions privately
        ctx.deleteMessage()
        const questionId = ctx.match[1]

        const question = await Question.findById(questionId)

        ctx.reply(questionMaker.makeResponseConfirm(question, "private"), {
            parse_mode: "HTML"
        })

        let turn = "typeAnswer"

        this.bot.on('message', async (ctx) => {
            let response 
            if(turn == "typeAnswer"){
                response = ctx.message.text
                turn = "confirmAnswer"
                return ctx.reply(`Please Approve your answer by typing <b><u>yes</u></b>. \n\n${questionMaker.makeResponse(question, response)}`, {
                    parse_mode: "HTML"
                })
            }
            if(turn == "confirmAnswer"){
                let resp = ctx.message.text
                if(/^yes$/i.test(resp)){
                    this.bot.telegram.sendMessage(question.user.telegramId, questionMaker.makeResponse(question, response), {
                        parse_mode: "HTML"
                    })
                        .catch(err => ctx.reply(err.message))
        
                    ctx.reply("Your answer has been sent privately. If he has't stopped the bot, he will be receiving it. Go back /home")
        
                    await mongoDb.addAnswer(question._id, response)
                        .catch(err => {
                            ctx.reply("Error: your answer has not been updated to the database. Go back /home")
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
                } else {
                    ctx.reply("Please go /home and review other quesitons")
                }
            } 

        })
    }

    async getGroupReplyPrompt (ctx) {   // Answer Questions On Channel
        ctx.deleteMessage()
        const questionId = ctx.match[1]

       try {
        const question = await Question.findById(questionId)
             .catch(err => {
                 throw new Error(err.message)
             })
 
         ctx.reply(questionMaker.makeResponseConfirm(question, "private"), {
             parse_mode: "HTML"
         })
 
        let turn = "typeAnswer"

         this.bot.on('message', async (ctx) => {
            let response 
            if(turn == "typeAnswer"){
                response = ctx.message.text
                turn = "confirmAnswer"
                return ctx.reply(`Please Approve your answer by typing <b><u>yes</u></b>. \n\n${questionMaker.makeResponse(question, response)}`, {
                    parse_mode: "HTML"
                })
            }
            if(turn == "confirmAnswer"){
                let resp = ctx.message.text
                if(/^yes$/i.test(resp)){
                    const response = ctx.message.text
                    this.bot.telegram.sendMessage(process.env.CHANNEL_USERNAME, questionMaker.makeResponseGroup(question, response), {
                        parse_mode: "HTML"
                    })
        
                    await mongoDb.addAnswer(question._id, response)
                        .catch(err => {
                            ctx.reply("Error: your answer has not been updated to the database. Go back /home")
                        })

                    ctx.reply("Your answer has been sent on group. Go back /home")
        
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
                } else {
                    ctx.reply("Please go /home and review other quesitons")
                }
                }
            })
 
        } catch (error) {
            console.log(error);
       }
    }

    async getQuestionSeenOnly (ctx) {   // Make Questions Seen Only
        ctx.deleteMessage()
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

        } catch (error) {
            console.log(error);
       }
    }

    async discardQuestion(ctx) {    // Discard Questions
        ctx.deleteMessage()
        const questionId = ctx.match[1]

        const question = await Question.findById(questionId)


        ctx.reply(`Are you sure you want to remove: <b>type <u>Yes</u></b> to confirm deletion \n\n ${questionMaker.makeQuestion(question)}`, {
            parse_mode: "HTML"
        })

        this.bot.on('message', async (ctx) => {
            const resp = ctx.message.text

            if(/^yes$/i.test(resp))
                await Question.findByIdAndUpdate(question._id, {$set: {isDiscarded: true, isSeen: true}})
                    .then(data => {
                        ctx.reply("Question Discarded on the database") 
                    })
                    .catch( err => {
                        throw new Error(err.message)
                    })
            else ctx.reply("Question not discarded. Go back to Quesitons Menu", {
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
        })
    }
}

module.exports = EstifMenu