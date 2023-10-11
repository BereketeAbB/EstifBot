const {Telegraf} = require('telegraf')
const pug = require('pug')
const path = require('path')
require('dotenv').config()

const EstifMenu = require('./menu/estifMenu')
const UserMenu = require('./menu/userMenu')

const mongoDb = require('./../mongo/mongo')

const bot = new Telegraf(process.env.BOT_TOKEN)

const estifMenu = new EstifMenu(bot)
const userMenu = new UserMenu(bot)


bot.start(async (ctx) => {
    console.log(process.env.ESTIF_ID);

    if(ctx.chat.id == process.env.ESTIF_ID)
        return  estifMenu.startMenu(ctx)

    const user = {
        telegramName: ctx.from.first_name,
        telegramId: ctx.from.id,
        username: ctx.from.username
    }
    await mongoDb.addUser(user)
        .then(() => console.log(`${ctx.from.username}: ${ctx.from.id} is on the database`))
        .catch((err) => ctx.reply(err.message))   

    userMenu.startMenu(ctx)

    ctx.sendMessage("Please allow me to get your contact information by tapping on the button below", {
        parse_mode: "HTML",
        reply_markup: {
            keyboard: [
                [
                    {
                    text: "Give contact",
                    request_contact: true
                    }
                ]
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        }

    })

        
        bot.on("contact", async ctx => {
            user.phoneNumber = ctx.update.message.contact.phone_number
         
            await mongoDb.addUser(user)
            .then(() => console.log(`${ctx.from.username}: ${ctx.from.id} is on the database`))
            .catch((err) => ctx.reply(err.message)) 
    
        })
})
bot.command("home", ctx => {
    ctx.deleteMessage()
    ctx.from.id == process.env.ESTIF_ID? estifMenu.startMenu(ctx) : userMenu.startMenu(ctx)

})
    
bot.action("goHome", ctx => {
    ctx.deleteMessage()
    ctx.from.id == process.env.ESTIF_ID? estifMenu.startMenu(ctx) : userMenu.startMenu(ctx)
})

    

bot.action("getQuestionsOption", (ctx) => estifMenu.getQuestionsOptionMenu(ctx))
bot.action("getNewQuestions",(ctx) =>  estifMenu.getNewQuestionsMenu(ctx))
bot.action("getListOfUsernames",(ctx) =>  estifMenu.getListOfUsernames(ctx))

bot.action("askQuestion", ctx => userMenu.askQuestion(ctx))
bot.action("askSreateBetekrstianQuestion", ctx => userMenu.askSreateBetekrstianQuestion(ctx))
bot.action("askTmhrteHaymanotQuestion", ctx => userMenu.askTmhrteHaymanotQuestion(ctx))
bot.action("askRelationshipQuestion", ctx => userMenu.askRelationshipQuestion(ctx))
bot.action("askOtherQuestion", ctx => userMenu.askOtherQuestion(ctx))

bot.action(/USR_(.+)/, ctx => estifMenu.getQuestionsByUsername(ctx))
bot.action(/private_(.+)/, ctx => estifMenu.getPrivateReplyPrompt(ctx))
bot.action(/group_(.+)/, ctx => estifMenu.getGroupReplyPrompt(ctx))
bot.action(/seen_(.+)/, ctx => estifMenu.getQuestionSeenOnly(ctx))
bot.action(/discard_(.+)/, ctx => estifMenu.discardQuestion(ctx))


module.exports = bot;
