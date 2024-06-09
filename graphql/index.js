import { createSchema } from 'graphql-yoga';
import { inputs } from './input.js';
import { types } from './types.js';
import { authQuery } from './queries/auth.js';
import { postQuery } from './queries/post.js';
import { followQuery } from './queries/follow.js';
import { storyQuery } from './queries/stories.js';
import { chatQuery } from './queries/chat.js';
import { authResolver } from './resolvers/auth.js';
import { postResolver } from './resolvers/post.js';
import { followResolver } from './resolvers/follow.js';
import { storyResolver } from './resolvers/stories.js';
import { chatResolver } from './resolvers/chat.js';
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
    typeDefs: [quereis, inputs, types, authQuery, postQuery, followQuery, storyQuery, chatQuery],
    resolvers: _.merge(resolvers, {}, authResolver, postResolver, followResolver, storyResolver, chatResolver)
})