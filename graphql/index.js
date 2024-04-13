import { createSchema } from 'graphql-yoga';
import { inputs } from './input.js';
import { types } from './types.js';
import { authQuery } from './queries/auth.js';
import { authResolver } from './resolvers/auth.js';
import { DateTimeResolver, DateTimeTypeDefinition } from 'graphql-scalars'

import _ from 'lodash'

let quereis = `
    ${DateTimeTypeDefinition}
    type Query {
        hello: String,
    }
`
let resolvers = {
    DateTime: DateTimeResolver,
    Query: {
        hello: () => 'world',
    },
}

export const schema = createSchema({
    typeDefs: [quereis, inputs, types, authQuery],
    resolvers: _.merge(resolvers, {}, authResolver)
})