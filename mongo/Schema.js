const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    isAnnonymous: {
        type: Boolean,
        required: [true, "You need to specify the visibility of the user"],
        default: false
    },
    isUrgent: {
        type: Boolean,
        required: [true, "You need to specify the Urgency of the question"],
        default: false
    },
    telegramId: {
        type: String,
        required: [true, "No Telegram Id found"]
    },
    

    userData: {
        telegramName: {
            type: String
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
    }, 
    question: [{
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
        }
        // sth: {
        //     type: String,
        //     required: true
        // }
    }]
})

const Question = mongoose.model('Question', questionSchema)


module.exports = Question