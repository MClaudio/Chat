var person = prompt("Cual es tu nombre:");
while (person == null || person == "") {
  person = prompt("Cual es tu nombre:");
}

const socket = io();

const chatContent = document.querySelector(".content-chat");
const chatText = document.querySelector(".form-control");
const btnSubmit = document.querySelector(".chat-submit input");
const chatActions = document.querySelector(".actions");
const userName = document.getElementById("username");

userName.innerHTML = person;

socket.on("chat:message", (data) => {
  chatContent.innerHTML += `
  <div class="d-flex flex-row p-3"> <img
  src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png" width="30"
  height="30">
<div class="chat ml-2 p-3">${data.message}</div>
</div>
  `;
});

socket.on("chat:typing", (data) => {
  if (data.typing) {
    chatActions.innerHTML = `
        <div class="d-flex flex-row p-3"> <img
            src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png" width="30"
            height="30">
            <div class="chat ml-2 p-3"><span class="text-muted dot">${data.user} esta escribiendo. . .</span></div>
        </div>
      `;
  } else {
    chatActions.innerHTML = "";
  }
});

btnSubmit.addEventListener("click", function () {
  if (chatText.value !== null && chatText.value !== '') {
    //console.log("chatText.value", chatText.value)
    socket.emit("chat:message", { user: person, message: chatText.value });

    chatContent.innerHTML += `
    <div class="d-flex flex-row p-3 my-message">
        <div class="bg-white mr-2 p-3"><span class="text-muted">${chatText.value}</span></div> <img
            src="https://img.icons8.com/color/48/000000/circled-user-male-skin-type-7.png" width="30"
            height="30">
    </div>
  `;

    chatText.value = "";
  }
});

chatText.addEventListener("input", function (evt) {
  socket.emit("chat:typing", { typing: true, user: person });
});

chatText.addEventListener("focusout", (evt) => {
  socket.emit("chat:typing", { typing: false });
});
