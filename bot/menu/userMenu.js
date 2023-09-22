const path = require('path')
require('dotenv').config()

class UserMenu {
    constructor (bot) {
        this.bot = bot
        this.UItitle = "ዓምደ እስጢፋኖስ"
        this.UIbody = "ይህ የዓምደ እስጢፋኖስ ጥያቄ መቀበያ ነው"
    }

    
    startMenu(ctx){
        this.bot.telegram.sendMessage(ctx.from.id, `${this.UItitle} \n${this.UIbody}`, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "ጥያቄ",
                        web_app: {
                           url: `${process.env.BOT_API}/question/${ctx.from.id}`
                        }
                    }]
                ]
            }
        })
    }

    //ህምምምምም
    anonymousCheck(userId){
        this.bot.telegram.sendMessage(userId, "ማንነትዎን እንዳውቅ ይፈቅዱልኛል? ይህ መሆኑ ለኔም ለመልስ ያመቸኛል", {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "አዎ",
                        callback_data: "notAnnonymous"
                    }, 
                    {
                        text: "አይ",
                        callback_data: "Annonymous"
                    }]
                ]
            }
        })
    }

}

module.exports = UserMenu