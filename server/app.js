const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');

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