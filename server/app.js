const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');



const app = express();

/**
 * Allowing cross origin requests
 */
app.use(cors())



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




app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}));

app.get("/", (req, res) => {
    res.send("Welcome to GraphQL");
});

app.listen(3000,()=>{
    console.log("App is up on port 3000...");
})