import { createSchema } from 'graphql-yoga';
import { inputs } from './input.js';
import { types } from './types.js';
import { authQuery } from './queries/auth.js';
import { postQuery } from './queries/post.js';
import { authResolver } from './resolvers/auth.js';
import { postResolver } from './resolvers/post.js';
import { DateTimeResolver, DateTimeTypeDefinition } from 'graphql-scalars'
import _ from 'lodash';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';


let quereis = `
    ${DateTimeTypeDefinition}
    scalar Upload
    type Query {
        hello: String,
    }
`
let resolvers = {
    DateTime: DateTimeResolver,
    Upload: GraphQLUpload,
    Query: {
        hello: () => 'world',
    },
}

export const schema = createSchema({
    typeDefs: [quereis, inputs, types, authQuery, postQuery],
    resolvers: _.merge(resolvers, {}, authResolver, postResolver)
})