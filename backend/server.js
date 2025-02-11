require("dotenv").config();
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const cors = require("cors");
const { buildSchema } = require("graphql");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const Booking = mongoose.model("Booking", {
  name: String,
  email: String,
  from: String,
  to: String,
  adults: Number,
  children: Number,
  travelClass: String,
  departureOn: String,
  journeyType: String,
});

const schema = buildSchema(`
  type Booking {
    id: ID!
    name: String!
    email: String!
    from: String!
    to: String!
    adults: Int!
    children: Int!
    travelClass: String!
    departureOn: String!
    journeyType: String!
  }

  type Query {
    bookings: [Booking]
  }

  type Mutation {
    addBooking(
      name: String!,
      email: String!,
      from: String!,
      to: String!,
      adults: Int!,
      children: Int!,
      travelClass: String!,
      departureOn: String!,
      journeyType: String!
    ): Booking
  }
`);

const root = {
  bookings: async () => await Booking.find(),
  addBooking: async ({ name, email, from, to, adults, children, travelClass, departureOn, journeyType }) => {
    const newBooking = new Booking({ name, email, from, to, adults, children, travelClass, departureOn, journeyType });
    await newBooking.save();
    return newBooking;
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();
server.applyMiddleware({ app });

app.get('/', (req, res) => {
    res.send('GraphQL API is running');
  });

app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
