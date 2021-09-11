const graphql = require('graphql');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

// const mockDB = require('../mockDB');

const baseURL = `http://localhost:3000`;

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            async resolve(parentValue, _) {
                const { data } = await axios.get(`${baseURL}/users?company=${parentValue.id}`);
                return data;
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            async resolve(parentValue, _) {
                const { data } = await axios.get(`${baseURL}/companies/${parentValue.company}`);
                return data;
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            async resolve(_, args) {
                // return await mockDB.find(args.id);
                const { data } =  await axios.get(`${baseURL}/users/${args.id}`);
                return data;
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            async resolve(_, args) {
                const { data } = await axios.get(`${baseURL}/companies/${args.id}`);
                return data;
            }
        }
    })
});

const RootMutation = new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString }
            },
            async resolve(_, args) {
                const payload = {
                    firstName: args.firstName,
                    age: args.age
                };
                const { data } = await axios.post(`${baseURL}/users`, payload);
                return data;
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, args) {
                const { data } = await axios.delete(`${baseURL}/users/${args.id}`);
                return data;
            }
        }
    }
});

module.exports = new GraphQLSchema({ 
    query: RootQuery,
    mutation: RootMutation
});
