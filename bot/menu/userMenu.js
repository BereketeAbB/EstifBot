const path = require('path')
const { Question } = require('../../mongo/Schema')
require('dotenv').config()

class UserMenu {
    constructor (bot) {
        this.bot = bot
        this.UItitle = "ዓምደ እስጢፋኖስ"
        this.UIbody = "ይህ የዓምደ እስጢፋኖስ ጥያቄ መቀበያ ነው"
    }

    
    startMenu(ctx){
        ctx.deleteMessage()
        this.bot.telegram.sendMessage(ctx.from.id, `${this.UItitle} \n${this.UIbody}`, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                        text: "ጥያቄ",
                        callback_data: "askQuestion"
                        // web_app: {
                        //    url: `${process.env.BOT_API}/question/${ctx.from.id}`
                        // }
                        }, 
                        {
                        text: "አስተያየት",
                        callback_data: "giveSuggestion"
                        // web_app: {
                        //    url: `${process.env.BOT_API}/question/${ctx.from.id}`
                        // }
                        }
                    ]
                ]
            }
        })
    }

    askQuestion(ctx){
        ctx.deleteMessage()
        ctx.answerCbQuery()
        ctx.sendMessage("የጥያቄዎትን ዓይነት ይምረጡ።", {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "ሥርዓተ ቤተክርስቲያን",
                            callback_data: "askSreateBetekrstianQuestion"
                        },
                    ],
                    [
                        {
                            text: "ትምህርተ ሃይማኖት",
                            callback_data: "askTmhrteHaymanotQuestion"
                        },
                    ],
                    [
                        {
                            text: "Relatoinship",
                            callback_data: "askRelationshipQuestion"
                        },
                    ],
                    [
                        {
                            text: "ሌላ",
                            callback_data: "askOtherQuestion"
                        },
                    ],
                    [
                        {
                            text: "ወደ ኋላ ተመለስ",
                            callback_data: "goHome"
                        },
                    ],
                    
                ]
            }
        })
    }

    askSreateBetekrstianQuestion(ctx) {
        ctx.deleteMessage()

        let question = {questionTitle: undefined, questionText: undefined, approve: undefined, turn : "questionTitle"}
        ctx.reply("የጥያቄዎትን አጭር ርእስ በText ይላኩ")
        this.bot.on("message", ctx => askQuestion(ctx, "ትምህርተ ሃይማኖት", question))
 
    }
    askTmhrteHaymanotQuestion(ctx) {
        ctx.deleteMessage()
        let question = {questionTitle: undefined, questionText: undefined, approve: undefined, turn : "questionTitle"}
        ctx.reply("የጥያቄዎትን ርእስ በText ይላኩ")
        this.bot.on("message", ctx => askQuestion(ctx, "ትምህርተ ሃይማኖት", question))
    }
    askRelationshipQuestion(ctx) {
        ctx.deleteMessage()
        let question = {questionTitle: undefined, questionText: undefined, approve: undefined, turn : "questionTitle"}
        ctx.reply("የጥያቄዎትን ርእስ በText ይላኩ")
        this.bot.on("message", ctx => askQuestion(ctx, "relationship", question))
    }
    askOtherQuestion(ctx) {
        ctx.deleteMessage()
        let question = {questionTitle: undefined, questionText: undefined, approve: undefined, turn : "questionTitle"}
        ctx.reply("የጥያቄዎትን ርእስ በText ይላኩ")
        this.bot.on("message", ctx => askQuestion(ctx, "other", question))
    }

    // Talk to estifBot


}

const askQuestion = async (ctx, questionType, question) => {

    console.log(question)
    if(question.questionTitle == undefined && question.turn == "questionTitle"){
        question.questionTitle = ctx.message.text
        ctx.reply("ጥያቄዎትን በአንድ text በዝርዝር የጠይቁ።")
        question.turn = "questionText"
        return
    }
    if(question.questionText == undefined && question.turn == "questionText"){
        question.questionText = ctx.message.text
        let approveText = `Please Approve your question by typing <b>yes</b>. \n\n<b>${question.questionTitle}</b>\n${question.questionText}.`
        ctx.reply(approveText, {parse_mode: "HTML"})
        question.turn = "approve"
        return
    }

    if (question.approve == undefined && question.turn == "approve"){
        question.approve = ctx.update.message.text
        if(question.approve == "yes"){
            quesitonObj = {
                questionTitle: question.questionTitle,
                questionText: question.questionText,
                questionType,
                date: new Date(Date.now()),
                telegramId: ctx.from.id,
            }
            //add to database
            ctx.reply("ጥያቄዎትን ተቀብለናል! ወደ ዋናው ማውጫ በ /home ይመለሱ።")
            question.turn = null
            return await Question.create(quesitonObj)
            //return user to main menu
        } else {
            return ctx.reply("Please Go /home and Ask another Question.")
        }
    }


    // if(!questionTitle){
    //     questionTitle = ctx.message.text
    //     ctx.reply("ጥያቄዎትን በአንድ text በዝርዝር የጠይቁ።")
    //     return
    // }
    
    // if(!questionText){
    //     questionText = ctx.message.text
    //     ctx.reply("ጥያቄዎትን ተቀብለናል። ምላሹን ይጠብቁ")
    //     return
    // }
    // if (!approve){
    //     approve = ctx.update.message.text
    //     if(approve == "yes"){
    //         quesitonObj = {
    //             questionTitle,
    //             questionText,
    //             questionType,
    //             date: new Date(Date.now()),
    //             telegramId: ctx.from.id,
    //         }
    //         //add to database
    //         await Question.create(quesitonObj)
    //         //return user to main menu
    //     }
    // }



}

module.exports = UserMenu