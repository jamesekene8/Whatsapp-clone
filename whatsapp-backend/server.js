import express from "express";
import mongoose from "mongoose";
import Message from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";

const app = express();

dotenv.config({ path: "./config.env" });

app.use(cors());

const port = process.env.PORT || 9000;

//Change streams watches our database and watches for changes
const db = mongoose.connection;

db.once("open", () => {
  console.log("DB connected");
  // This selects the collection you want to listen to
  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      //The first parameter is the Channel and the second parameter is the Event. the third parameter is the data. NB: Pusher debug console must be open when you are doing this.
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

const pusher = new Pusher({
  appId: process.env.pusherAppId,
  key: process.env.pusherKey,
  secret: process.env.pusherSecret,
  cluster: "eu",
  useTLS: true,
});

app.use(express.json());

const connection_url = process.env.DATABASE;

mongoose.connect(connection_url, {});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/messages/sync", (req, res) => {
  Message.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/api/v1/messages/new", (req, res) => {
  const dbMessage = req.body;

  Message.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
