const {Telegraf} = require('telegraf')
const pug = require('pug')
const path = require('path')
require('dotenv').config()

const EstifMenu = require('./menu/estifMenu')
const UserMenu = require('./menu/userMenu')

const mongoDb = require('./../mongo/mongo')

const bot = new Telegraf("6379778395:AAG6aEGdbnvOMwmxRSWXkM_L-maefn8nZxg")

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

    userMenu.startMenu(ctx)

    ctx.sendMessage("Requesting Contact", {
        parse_mode: "HTML",
        reply_markup: {
            keyboard: [
                [
                    {
                    text: "request contact",
                    request_contact: true
                    }
                ]
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        }

    })
    bot.on("contact", ctx => console.log(ctx.update.message.contact))

    await mongoDb.addUser(user)
        .then(() => console.log(`${ctx.from.username}: ${ctx.from.id} is on the database`))
        .catch((err) => ctx.reply(err.message))   
})

bot.action("getQuestionsOption", (ctx) => estifMenu.getQuestionsOptionMenu(ctx))
bot.action("getNewQuestions",(ctx) =>  estifMenu.getNewQuestionsMenu(ctx))

bot.action(/private_(.+)/, ctx => estifMenu.getPrivateReplyPrompt(ctx))
bot.action(/group_(.+)/, ctx => estifMenu.getGroupReplyPrompt(ctx))
bot.action(/seen_(.+)/, ctx => estifMenu.getQuestionSeenOnly(ctx))
bot.action("discard_(.+)", ctx => estifMenu.discardQuestion(ctx))

module.exports = bot;
