const mongoose = require('mongoose')
require('dotenv').config()

const {Question, User} = require('./Schema')

function db () {
    mongoose.connect(process.env.MONGO_CONN)
    .then((data)=>{
        console.log(`MongoDb Connected`);
    }).catch((err) => {
        console.log(`Erroe: ${err.message}`);
    })
}

db.prototype.addQuestion = async function(questionObj) {
    return new Promise(async (resolve, reject) => {

        await Question.create(questionObj)
            .then((data) => {
                //console.log(data);
                const res = {
                    status: true,
                    result: {
                        msg: "Question Created",
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

db.prototype.getQuestions = async function (queryObj) {
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

db.prototype.addUser = async function (userObj) {
    return new Promise(async (resolve, reject) => {
        await User.findOneAndUpdate({telegramId: userObj.telegramId || ""}, userObj, {new: true, upsert: true})
            .then(data => {
                const ret = {
                    status: true,
                    result: {
                        msg: "User Added to Database",
                        user: data
                    }
                }
                resolve(ret)
            })
            .catch (err => {
                const ret = {
                    status: true,
                    result: {
                        msg: err.message,
                        err
                    }
                }
                reject(ret)
            })
    })
}

db.prototype.getUser = async function (queryObj) {
    return new Promise(async (resolve, reject) => {
        await User.find(queryObj)
            .then(data => {
                const ret = {
                    status: true,
                    result: {
                        length: data.length,
                        users: data
                    }
                }
                resolve(ret)
            })
            .catch (err => {
                const ret = {
                    status: true,
                    result: {
                        msg: err.message,
                        err
                    }
                }
                reject(ret)
            })
    })
}

db.prototype.makeSeen = async function (questionId) {
    return new Promise(async (resolve, reject) => {
        await Question.findByIdAndUpdate(questionId, {$set: {isSeen: true}})
            .then(data => {
                const ret = {
                    status: true,
                    result: {
                        msg: "Question is seen",
                        question: data
                    }
                }
                resolve(ret)
            })
            .catch(err => {
                const ret = {
                    status: false,
                    result: {
                        msg: "Question status is not updated",
                        err
                    }
                }
                reject(ret)
            })

    })
}     

db.prototype.addAnswer = async function (questionId, myAnswer) {
    return new Promise(async (resolve, reject) => {
        await Question.findByIdAndUpdate(questionId, {$set: {myAnswer}})
            .then(data => {
                const ret = {
                    status: true,
                    result: {
                        msg: "Answer is Added",
                        question: data
                    }
                }
                resolve(ret)
            })
            .catch(err => {
                const ret = {
                    status: false,
                    result: {
                        msg: "Answer is not updated",
                        err
                    }
                }
                reject(ret)
            })

    })
}     



const mongoDb = new db()

module.exports = mongoDb