const grahql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');



// To create objects we need a GraphQLObjectType
const { GraphQLObjectType, 
        GraphQLString, 
        GraphQLSchema,
        GraphQLID,
        GraphQLInt,
        GraphQLList
} = grahql;


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
                /**
                 * Whenever an user requests for a book, they can request for the author as well
                 */

                 return Author.findById(parent.authorid)
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
                return Book.find({authorid: parent.id})
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
                return Book.findById(args.id)
            }
        },

        author: {
            type: AuthorType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args){
                return Author.findById(args.id)
            }
        },

        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){

                /**
                 * find() with an empty object applies no condition and return the complete array
                 */
                return Book.find({});
            }
        },

        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){

                /**
                 * find() with an empty object applies no condition and return the complete array
                 */
                return Author.find({});
            }
        }
    }

});


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addAuthor:{
            type: AuthorType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
            },
            resolve(parent, args){

                let author = new Author({
                    name: args.name,
                    age: args.age
                })

                return author.save();

            }
        },

        addBook: {
            type: BookType,
            args: {
                name: {type: GraphQLString},
                genre: {type: GraphQLString},
                authorid: {type: GraphQLID}

            },
            resolve(parent, args){

                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorid: args.authorid
                });

                return book.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})