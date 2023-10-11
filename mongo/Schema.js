const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
        telegramName: {
            type: String
        },
        telegramId: {
            type: String,
            required: [true, "Telegram Id must be specified"]
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        username: {
            type: String
        },
        phoneNumber: {
            type: String,
            //required: true
        }
    })

const User = mongoose.model('User', userSchema)

const questionSchema = new mongoose.Schema({
    user: Object,
    telegramId: String,
    questionType: String,
    questionTitle: {
        type: String
    },
    questionText: {
        type: String
    },
    date: {
        type: Date
    }, 
    isSeen: {
        type: Boolean,
        default: false
    },
    isDiscarded: {
        type: Boolean,
        default: false
    },
    isUrgent: {
        type: Boolean,
        required: [true, "You need to specify the Urgency of the question"],
        default: false
    },
    myAnswer: {
        type: String
    }
})

questionSchema.pre('save',  async function (next) {
    console.log(this);
    this.user = await User.findOne({telegramId: this.telegramId})
    next()
})

const Question = mongoose.model('Question', questionSchema)




module.exports = {Question, User}