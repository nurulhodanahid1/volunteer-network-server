const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6dt9c.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventCollection = client.db(process.env.DB_NAME).collection("events");
    
    app.post("/addEvent", (req, res) => {
      const newEvent = req.body;
      console.log("New Event", newEvent);
      eventCollection.insertOne(newEvent)
      .then(result => {
        console.log("inserted count", result.insertedCount);
        res.send(result.insertedCount > 0)
      })
    })

    app.get('/events', (req, res) => {
      eventCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
    })

    app.delete('/deleteEvent/:id', (req, res) => {
      const id = ObjectID(req.params.id);
      console.log('delete event', id);
      eventCollection.findOneAndDelete({_id: id})
      .then(documents => res.send(!!documents.value))
    })
  
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})