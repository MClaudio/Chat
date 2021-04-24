const amqplib= require("amqplib/callback_api");

module.exports = async (rc) => await amqplib.connect('amqp://localhost', (err, conn) => {
    if(err){
      throw err // console.log(err)
    }
    rc(conn)
  });
