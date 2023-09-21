const {Telegraf} = require('telegraf')
const pug = require('pug')
const path = require('path')

const estifController = require('./controller/estif')

const bot = new Telegraf("6379778395:AAG6aEGdbnvOMwmxRSWXkM_L-maefn8nZxg")


bot.start(estifController.startUI)
 
bot.action("getQuestionsOption", estifController.getQuestionsOption)
bot.action("getNewMessages", estifController.getNewMessages)



module.exports = bot;
