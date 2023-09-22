const {Telegraf} = require('telegraf')

const {Question, User} = require('../../mongo/Schema')
const {sendQuestion} = require('../../utils/utils')

const mongoDb = require('../../mongo/mongo')
const estif = require('../menu/estifMenu')
const user = require('../menu/userMenu')

const bot = new Telegraf("6379778395:AAG6aEGdbnvOMwmxRSWXkM_L-maefn8nZxg")


exports.getNewQuestions = async (ctx) => {
    //bot.telegram.deleteMessage(ctx.chat.id, ctx.update.callback_query.message.message_id)
    
    let ret

    return new Promise(async (resolve, reject) => {
        await mongoDb.getQuestions({isSeen: false})
        .then( data => {
            console.log(data);
            if(data.status && data.result.length == 0){
                ret = {
                    status: true,
                    result: {
                        length: 0,
                        questions: []
                    }
                }
                reject(ret)

            } else if(data.status){
                ret = {
                    status: true,
                    result: {
                        length: data.result.length,
                        questions: data.result.questions
                    }
                }
                resolve(ret)
            }
        })
        .catch((err) => {
            ret = {
                status: false,
                result: {
                    msg: err.message,
                    err
                }
            }
            reject(ret)
        })
    })
 
}