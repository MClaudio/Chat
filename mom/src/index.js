const express = require("express");
const path = require("path");
var router = express.Router();
const socket = require("socket.io");
const connection = require("./conection");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("port", process.env.PORT || 5000);

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(app.get("port"), () => {
  console.log("listening on *:5000");
});

//config websockets
const io = socket(server);
var chat = io.of("/chat");

connection((conn) => {
  //console.log(soket)
  conn.createChannel((err, ch) => {
    if (err) {
      console.log(err);
    }
    var ex = "chat_ex";
    ch.assertExchange(ex, "fanout", { durable: false });
    ch.assertQueue(
      "",
      { exclusive: true },
      (err, q) => {
        if (err) {
          throw new Error(err);
        }

        console.log("q.queue binding", q.queue);
        ch.bindQueue(q.queue, ex, "");
        ch.consume(q.que, (msg) => {
          console.log("new message in queue ", msg.content.toString());
          //chat.emit("chat:message", JSON.parse(msg.content.toString()));
          //soket.on("chat:message", (data) => {
          //console.log("message", data)
          chat.emit(
            "chat:message",
            JSON.parse(msg.content.toString())
          );
          //});
        });
      },
      { noAck: true }
    );
  });
});

chat.on("connection", (soket) => {
  soket.on("chat:typing", (data) => {
    //console.log("message", data)
    soket.broadcast.emit("chat:typing", data);
  });
});

app.use("/", router);
router.route("/chat").post(postChat).get(getChat);

function postChat(req, res) {
  console.log("req", req.body);
  connection((conn) => {
    conn.createChannel((err, ch) => {
      if (err) {
        throw err;
      }

      var ex = "chat_ex";
      var q = "chat_q";
      var msg = JSON.stringify(req.body);

      ch.assertExchange(ex, "fanout", { durable: false });
      ch.publish(ex, "", Buffer.from(msg), { persistent: false });
      ch.sendToQueue(q, Buffer.from(msg), { persistent: true });
      ch.close(() => {
        conn.close();
      });
    });
  });
}

function getChat(req, res) {
  connection((conn) => {
    conn.createChannel(
      (err, ch) => {
        if (err) {
          throw err;
        }
        var q = "chat_q";
        let messages = [];
        let messageCount = 0;

        ch.assertQueue(q, { durable: true }, (err, status) => {
          if (err) {
            throw err;
          }
          if (status.messageCount === 0) {
            //console.log("status 0", status.messageCount);
            res.status(200).send({ status: "ok", messages: 0 });
            //return;
          }
          messageCount = status.messageCount;

          ch.consume(q.que, (msg) => {
            messages.push(JSON.parse(msg.content.toString()));
            //ch.ack(msg);
            if (messages.length === messageCount) {
              //console.log('messagesCount', messages.length)
              ch.close(() => {
                conn.close();
              });
              res.status(200).send({ status: "ok", messages, messageCount });
            }
          });
        });
      },
      { noAck: true }
    );
  });
}
