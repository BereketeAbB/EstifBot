exports.sendQuestion = function (username, isUrgent, questionTitle, questionText, dateAndTime) {
    console.log(`@<b>${username}</b> \nisUrgent: ${isUrgent}, \n\n
    <b><u>${questionTitle}</u></b> \n
    ${questionText} \n\n
    ${dateAndTime} \n`);
    return `@<b>${username}</b> \nisUrgent: ${isUrgent}, \n\n
    <b><u>${questionTitle}</u></b> \n
    ${questionText} \n\n
    ${dateAndTime} \n`
}