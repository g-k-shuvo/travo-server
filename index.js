const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ux6rs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("travo");
    const tour_collection = database.collection("tours");
    const booking_collection = database.collection("bookings");
    const team_collection = database.collection("team");

    // GET ALL TOURS
    app.get("/tours", async (req, res) => {
      const cursor = tour_collection.find({});
      tours = await cursor.toArray();
      res.json(tours);
    });

    // GET A SINGLE TOUR
    app.get("/tours/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tour = await tour_collection.findOne(query);
      res.json(tour);
    });

    // GET TEAM
    app.get("/team", async (req, res) => {
      const cursor = team_collection.find({});
      team = await cursor.toArray();
      res.json(team);
    });

    // Book A TOUR
    app.post("/book", async (req, res) => {
      const tour = req.body;
      const bookedTour = await booking_collection.insertOne(tour);
      res.json(bookedTour);
    });

    // GET MY BOOKINGS
    app.get("/mybookings/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const myBookings = await booking_collection.find(query).toArray();
      res.json(myBookings);
    });

    // DELETE MY BOOKING
    app.delete("/mybookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const deletedBooking = await booking_collection.deleteOne(query);
      res.json(deletedBooking);
    });

    // GET ALL BOOKINGS
    app.get("/allbookings", async (req, res) => {
      const cursor = booking_collection.find({});
      bookings = await cursor.toArray();
      res.json(bookings);
    });

    // DELETE ANY BOOKING
    app.delete("/allbookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const deletedBooking = await booking_collection.deleteOne(query);
      res.json(deletedBooking);
    });

    // EDIT ANY BOOKING
    app.put("/allbookings/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBooking = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updatedBooking.status,
        },
      };
      const result = await booking_collection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // ADD A NEW TOUR
    app.post("/addtour", async (req, res) => {
      const tour = req.body;
      const addedTour = await tour_collection.insertOne(tour);
      res.json(addedTour);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Travo Server");
});

app.listen(port, () => {
  console.log("server is running on port", port);
});
