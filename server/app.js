const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

//Connect to mlab database
const URL = 'mongodb+srv://maverick:test123@cluster0.lamip.mongodb.net/<dbname>?retryWrites=true&w=majority';
mongoose.connect(
    URL, 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }
)
mongoose.connection.once('open',()=>{
    console.log("Connection is successful");
})




const app = express();


app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}));

app.get("/", (req, res) => {
    res.send("Welcome to GraphQL");
});

app.listen(3000,()=>{
    console.log("App is up...");
})