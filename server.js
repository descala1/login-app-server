const { ApolloServer, gql } = require('apollo-server');
const pgsql = require('./repository/pgsqlRepository.js');

const port = process.env.PORT ? process.env.PORT : 5000;

const typeDefs = gql`
    type Query {
        login(un: String, pw: String): String
    },

    type Mutation {
        register(name: String, un: String, email: String, pw: String): String
    }
`;

const resolvers = {
    Query: {
        login: (_, args) => {
            return tryPassword(args.un, args.pw);         
        }       
    },

    Mutation: {
        register: (_, args) => {
            return registerUser(args.name, args.un, args.email, args.pw);
        }     
    }
};

let tryPassword = async (un, pw) => {
    let res = await pgsql.login(un);        
    if(res && res == pw) return 'SUCCESS';
    else return 'FAIL';
}

let registerUser = async (name, un, email, pw) => {
    let res = await pgsql.register(name, un, email, pw);
    console.log(res);
    if(res) return 'SUCCESS';
    else return 'FAIL';
}

const server = new ApolloServer({typeDefs, resolvers});

server.listen({port})
    .then((serverInfo) => { 
      console.log(`Server running at ${serverInfo.url}`);
    });