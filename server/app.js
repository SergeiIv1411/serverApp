const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(`mongodb://admin-triol:Amma123@127.0.0.1:27017/TriolMarket`, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

const dbConnection = mongoose.connection;
dbConnection.on('error', error => console.log(`Connection error: ${error}`));
dbConnection.once('open', () => console.log(`Connection to DB!`));

app.listen(PORT, err => {
    err ? console.log(err) : console.log(`Server started on port: ${PORT}`);
});