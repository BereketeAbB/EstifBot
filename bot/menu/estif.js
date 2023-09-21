const mongoDb = require('./../../mongo/mongo')
class Estif {
    constructor(bot){
        this.bot = bot
        this.startUI = "Welcome Estif! \nHere you will get your questions"
    }

    startMenu() {
        this.bot.telegram.sendMessage(process.env.ESTIF_ID, this.startUI, {
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

    async getQuestions(isSeen, telegramId) {
        let quizs

    try {
        await mongoDb.getQuestions(isSeen, telegramId)
            .then(data => {
                if(data.status && data.result.length == 0){
                    return quizs = {}
                } else if(data.status){
                    return quizs = JSON.parse(data.result.questions)
                }
            })
            .catch( err => {
                throw new Error(err.result.msg)
            })
    } catch (error) {
        
    }
        this.bot.sendMessage(process.env.ESTIF_ID, )
    }
}

module.exports = {Estif}