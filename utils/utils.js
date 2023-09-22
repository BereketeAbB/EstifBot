exports.makeQuestion = function (question) {
        console.log(question);
       
        console.log(typeof(`@<b>${question.username}</b> \nisUrgent: ${question.isUrgent? question.isUrgent: ""}, \n\n<b><u>${question.questionTitle}</u></b> \n${question.questionText} \n\n${question.date} \nEOQQQ`));


    return `@<b>${question.username}</b> \nisUrgent: ${question.isUrgent}, \n\n<b><u>${question.questionTitle}</u></b> \n${question.questionText} \n\n${question.date} \n`
}

exports.makeResponseConfirm = function (question, type) {
    const responsesCheck = `<b>${type} Response</b>\n Type your Response to the quesiton...\n${`@${question.user.username}` || question.user.telegramName}\n<b><u>${question.questionTitle}</u></b>\n${question.questionText}\n\n`

    return responsesCheck
}


exports.makeResponse = function (question, response) {
    const responses = `<b>ሰላም ${`@${question.user.username}` || question.user.telegramName}</b>\n\n<b><u>${question.questionTitle}</u></b>\n${question.questionText}\n\n በሚል ለጠየከው ይኽን ምላሽ ሰጥቻለሁ። \n\n\n\n\n <b>ምላሽ</b>\n ${response}.`

    return responses
}

