const axios = require('axios')
require('dotenv').config()

class ExpressText {
    // constructor(bot, telegramId) {
    //     this.bot = bot
    //     this.telegramId = telegramId
    // }
    sendWelcomePro = async (telegramId) => {
        return new Promise((resolve, reject) => {
                axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
                    chat_id: telegramId, 
                    text: "ዓምደ እስጢፋኖስ \nይህ የዓምደ እስጢፋኖስ ጥያቄ መቀበያ ነው \n ተጨማሪ ጥያቄ ካልዎት ይጨምሩ!",
                    parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: "ጥያቄ",
                                    web_app: {
                                       url: `${process.env.BOT_API}/question/${telegramId}`
                                    }
                                }]
                            ]
                        }
                }).then((result) => {
                    if(result.data.ok){
                        const ret = {
                            status: true
                        }
                        resolve(ret)
                    }
                }).catch((err) => {
                    //console.log(err.response.data);
                    const ret = {
                        status: false,
                        result: {
                            msg: `Error: SendWelcomePro \n\t${err.response.data.description || ""} \n\t${err.message}`,
                            err
                        }
                    }
                    reject(ret)
                })
        })
    }

    sendUserMessagePro = async (telegramId, text) => {
        return new Promise((resolve, reject) => {
            axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
            chat_id: telegramId, 
            text,
        }).then((result) => {
            if(result.data.ok){
                const ret = {
                    status: true,
                }
                resolve(ret)
            }
        })
        .catch((err) => {
            const ret = {
                status: false,
                result: {
                    msg: `Error: SendUserMessagePro \n\t${err.response.data.description || ""} \n\t${err.message}`,
                    err
                }
            }
            reject(ret)
        })
        })
    }

    sendEstifMessagePro = async (text) => {
        return new Promise (async (resolve, reject) => {
            await this.sendUserMessagePro(process.env.ESTIF_ID, text)
                .then(result => {
                    if(result.status) {
                        const ret = {
                            status: true,
                        }
                        resolve(ret)
                    }
                }).catch(err => {
                    const ret = {
                        status: false,
                        result: {
                            msg: `sendEstifMessagePro: ${err.result.msg}`,
                            err
                        }
                    }
                    reject(ret)
                })
        })
    }
    
}

const expressText = new ExpressText()

module.exports = expressText