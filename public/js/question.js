const submit = document.getElementById("submit")

submit.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default form submission
  
    const name = document.getElementById("name").value;
    const telegramId = document.getElementById("telegramId").innerText
    const phoneNumber = document.getElementById("phoneNumber").value;
    const questionTitle = document.getElementById("questionTitle").value;
    const question = document.getElementById("question").value;
    const date = new Date(Date.now())
  
    fetch("/question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        telegramId,
        phoneNumber,
        questionTitle,
        question,
        date
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        //console.log(data);
        if(data.status){
          await clearAndConfirm(name)
        }
      })
      .catch((err) => console.log(err));
  
    //alert("Hello");
  });


async function clearAndConfirm(name){
  document.body.innerHTML = "";
  const acceptanceText = document.createElement("h3")
  acceptanceText.innerHTML = `${name}, ስለጥያቄው አመሰግናለሁ! መልሱን በTelegram Bot ይጠብቁ።`
  document.body.appendChild(acceptanceText)

  setTimeout(()=>{
    window.close()
    //Telegram.webApp.close()
  }, 3000)
}