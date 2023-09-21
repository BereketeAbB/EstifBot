const mongoose = require('mongoose')
require('dotenv').config()

const Question = require('./Schema')

function db () {
    mongoose.connect(process.env.MONGO_CONN)
    .then((data)=>{
        console.log(`MongoDb Connected`);
    }).catch((err) => {
        console.log(`Erroe: ${err.message}`);
    })
}


db.prototype.addQuestion = async function(telegramId, userData, questionObj) {
    return new Promise(async (resolve, reject) => {
        await Question.findOneAndUpdate({telegramId}, {$set: userData, $push: {question: questionObj}}, {
            returnDocument: 'after',
        })
            .then((data) => {
                const res = {
                    status: true,
                    result: {
                        msg: "Question Created",
                        username: data.userData.username
                    }
                }
                return resolve(res)
            }). catch((err) => {
                const res = {
                    status: false,
                    result: {
                        msg: "Error Creating Questions" || "",
                        err
                    }
                }
                reject(res)
            })
    })
}

db.prototype.getQuestions = async function (query) {
    let queryObj = {}
    if(typeof(query) == "object" && query.hasOwnProperty("isSeen")){
        queryObj = {'question': {$elemMatch: {isSeen: query.isSeen}}}
    }
    if (query && query.hasOwnProperty("username")){
        queryObj.username = username
    }

    return new Promise(async (resolve, reject) => {
        await Question.find(queryObj)
            .then((data) => {
                const ret = {
                    status: true,
                    result: {
                        length: data.length,
                        questions: data
                    }
                }
                resolve(ret)
            })
            .catch((err)=>{
                const ret = {
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


const mongoDb = new db()

module.exports = mongoDb