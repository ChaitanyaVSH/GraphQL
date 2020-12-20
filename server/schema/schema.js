const grahql = require('graphql');
const _ = require('lodash');



// To create objects we need a GraphQLObjectType
const { GraphQLObjectType, 
        GraphQLString, 
        GraphQLSchema,
        GraphQLID,
        GraphQLInt,
        GraphQLList
} = grahql;

// Dummy books data
const books = [
    {
        "id":"1",
        "name":"The power of Maverick Mind",
        "genre": "Power",
        "authorid": "1"
    },
    {
        "id":"2",
        "name":"Attitude is everything",
        "genre": "Guts",
        "authorid": "2"
    },
    {
        "id":"3",
        "name":"Richest man in the Babylon",
        "genre": "Skill",
        "authorid": "1"
    },
];

const authors = [
    {
        "id":"1",
        "name": "Maverick",
        "age": "21",
    },
    {
        "id":"2",
        "name": "Monal",
        "age": "23",
    },
];

/**
 * 1. name is the name given to the Object
 * 2. String cannot be used directly, hence use GraphQLString
 */
const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                console.log(parent);
                return _.find(authors, {id: parent.authorid})
            }
        }
    })
});

/**
 * Author type
 */
const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return _.filter(books, {authorid: parent.id})
            }
        }
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
                id: {type: GraphQLID}
            },
            resolve(parent, args){
                // Code to get the data from the DB / other resources
                return _.find(books, {id: args.id});
            }
        },

        author: {
            type: AuthorType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args){
                return _.find(authors, {id: args.id})
            }
        }
    }

});

module.exports = new GraphQLSchema({
    query: RootQuery
})