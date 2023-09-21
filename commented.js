        // await mongoDb.addQuestion(telegramId, userData, questionObj, (result) => {
        //     if(result.status){
        //         username = result.result.username
        //         return res.status(200).json({
        //             status: "true",
        //             result: {
        //                 msg: "Question Added Successfully"
        //             }
        //         })
        //     } else{
        //         res.status(400).json({
        //             status: false,
        //             result: {
        //                 msg: "Question Adding failed"
        //             }
        //         })
        //     }
        // })

// try {
        
        // const userMessaged = await expressText.sendUserMessage(telegramId, "Received your question, Will get back")
        
        // console.log(userMessaged);
        // await expressText.sendEstifMessage(`@${username} has sent you a question titled ' ${questionTitle} '`, 
        // (result) => {
        //          if(!result.status){
        //              throw new Error(result.result.msg)
        //          }
        //      })

        //     expressText.sendWelcomePro("telegramId")
        //         .then((data) => console.log(data))
        //         .catch((err) => console.log(err))
        
        
    //     //  await expressText.sendUserMessage(telegramId, "Received your question, Will get back", 
    //     //          (result) => {
    //     //              console.log(result);
    //     //              if(!result.status){
    //     //                  throw new Error(`${result.result.msg}`)
    //     //              }
    //     //          })
    //     //  await expressText.sendEstifMessage(`@${username} has sent you a question titled ' ${questionTitle} '`, 
    //     //      (result) => {
    //     //          if(!result.status){
    //     //              throw new Error(result.result.msg)
    //     //          }
    //     //      })
         

    // } catch (error) {
    //     console.log("RES");
    //     res.status(400).json({
    //         status: false,
    //         result: {
    //             msg: error.message,
    //             error
    //         }
    //     })
    // }

    // try {
    //     expressText.sendWelcome("telegramId", (result) => {
    //         if(!result.status){
    //             throw new Error(result.result.msg)
    //         }
    //     });
    // } catch (error) {
    //     console.log("ERROR");
    // }























    
        // axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        //     chat_id: telegramId, 
        //     text: "ዓምደ እስጢፋኖስ \nይህ የዓምደ እስጢፋኖስ ጥያቄ መቀበያ ነው \n ተጨማሪ ጥያቄ ካልዎት ይጨምሩ!",
        //     parse_mode: "HTML",
        //         reply_markup: {
        //             inline_keyboard: [
        //                 [{
        //                     text: "ጥያቄ",
        //                     web_app: {
        //                        url: `${process.env.BOT_API}/question/${telegramId}`
        //                     }
        //                 }]
        //             ]
        //         }
        // })
        
        
        // .then((result) => {
        //     if(result.data.ok){
        //         const ret = {
        //             status: true
        //         }
        //         callback(ret)
        //     }
        // })
    //     .catch((err) => {
    //         const ret = {
    //             status: false,
    //             result: {
    //                 msg: err.message,
    //                 err
    //             }
    //         }
    //         callback(ret)
    //     })
    // }

    
    // async sendUserMessage(telegramId, text, callback) {
    //     axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    //         chat_id: telegramId, 
    //         text,
    //     }).then((result) => {
    //         if(result.data.ok){
    //             const ret = {
    //                 status: true,
    //                 what: "is"
    //             }
    //             callback(ret)
    //         }
    //     })
    //     .catch((err) => {
    //         const ret = {
    //             status: false,
    //             result: {
    //                 msg: err.message,
    //                 err
    //             }
    //         }
    //         callback(ret)
    //     })
    // }

    // async sendEstifMessage(text, callback) {
    //     return this.sendUserMessage("346399468", text, (result) => {
    //         if(result.status) {
    //                 const ret = {
    //                     status: true,
    //                 }
    //                 callback(ret)
    //         } else {
    //             const ret = {
    //                 status: false,
    //                 result: {
    //                     msg: result.result.msg
    //                 }
    //             }
    //             callback(ret)
    //         }
    //     })
    // }








    // bot.action("question", (ctx) => {
//     console.log("here");
//     pugLoc = path.join(__dirname, "../", "public", "question.pug")
//     console.log(pugLoc);
//     const renderedHTML = pug.renderFile(pugLoc, {telegramId: ctx.from.id})
//     ctx.reply(renderedHTML)
//     // open("http://localhost:3000/question")
// })












    // db.prototype.addQuestion = async function(telegramId, userData, questionObj, callback) {
//     console.log(userData);
//     console.log(questionObj);
//     await Question.findOneAndUpdate({telegramId}, {$set: userData, $push: {question: questionObj}}, {
//         returnDocument: 'after',
//     })
//         .then((data) => {
//             const res = {
//                 status: true,
//                 result: {
//                     msg: "Question Created",
//                     username: data.userData.username
//                 }
//             }
//             return callback(res)
//         }). catch((err) => {
//             const res = {
//                 status: false,
//                 result: {
//                     msg: "Error Creating Questions"
//                 }
//             }
//             callback(res)
//         })
// }