const grahql = require('graphql');



// To create objects we need a GraphQLObjectType
const { GraphQLObjectType, GraphQLString, GraphQLSchema} = grahql;


/**
 * 1. name is the name given to the Object
 * 2. String cannot be used directly, hence use GraphQLString
 */
const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        genre: {type: GraphQLString}
    })
});


// We are not using a function to wrap up the fields because the order does not matter.
/**
 * In the book root query ID is used as a primary identifier for any book we query from FE.
 */
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        book: {
            type: BookType,
            args: {
                id: {type: GraphQLString}
            },
            resolve(parent, args){
                // Code to get the data from the DB / other resources

            }
        }
    }

});

module.exports = new GraphQLSchema({
    query: RootQuery
})