var person = prompt("Cual es tu nombre:");
while (person == null || person == "") {
  person = prompt("Cual es tu nombre:");
}

const socket = io("/chat");

const chatContent = document.querySelector(".content-chat");
const chatText = document.querySelector(".form-control");
const btnSubmit = document.querySelector(".chat-submit input");
const chatActions = document.querySelector(".actions");
const userName = document.getElementById("username");
userName.innerHTML = person;

getMessages();

socket.on("chat:message", (data) => {
  //console.log("data io", data);
  updateMessages(data);
});

function updateMessages(data) {
  chatContent.innerHTML += `
  <div class="d-flex flex-row p-3"> <img
  src="https://img.icons8.com/color/48/000000/circled-user-male-skin-type-7.png" width="30"
  height="30">
<div class="chat ml-2 p-3" style="display:flex"><p style="text-transform:uppercase">${data.user}</p>: ${data.message}</div>
</div>
  `;
}

socket.on("chat:typing", (data) => {
  if (data.typing) {
    chatActions.innerHTML = `
        <div class="d-flex flex-row p-3"> <img
            src="https://img.icons8.com/color/48/000000/circled-user-male-skin-type-7.png" width="30"
            height="30">
            <div class="chat ml-2 p-3"><span class="text-muted dot">${data.user} esta escribiendo. . .</span></div>
        </div>
      `;
  } else {
    chatActions.innerHTML = "";
  }
});

function getMessages() {
  console.log("get chats");
  var request = new XMLHttpRequest();
  request.open("GET", "/chat", true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send();
  request.onload = function () {
    console.log("get success");
    console.log(JSON.parse(request.responseText));
    let data = JSON.parse(request.responseText);

    if (data.messages !== 0) {
      data.messages.forEach((element) => {
        updateMessages(element);
      });
    }
  };
}

btnSubmit.addEventListener("click", function () {
  if (chatText.value !== null && chatText.value !== "") {
    //console.log("chatText.value", chatText.value)
    //socket.emit("chat:message", { user: person, message: chatText.value });
    //console.log("message post", chatText.value)

    var request = new XMLHttpRequest();
    request.open("POST", "/chat", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(
      JSON.stringify({
        user: person,
        message: chatText.value,
      })
    );
    request.onload = function () {
      console.log(JSON.parse(request.responseText));
    };

    chatText.value = "";
  }
});

chatText.addEventListener("input", function (evt) {
  socket.emit("chat:typing", { typing: true, user: person });
});

chatText.addEventListener("focusout", (evt) => {
  socket.emit("chat:typing", { typing: false });
});
