import express from "express";
import cors from 'cors'
import { } from 'dotenv/config' // module
import { createYoga } from 'graphql-yoga'
import { schema } from "./graphql/index.js";
import { pool } from './database/connection.js'
import { ruruHTML } from "ruru/server"
import cookieParser from 'cookie-parser';
import { authMiddleware } from "./middleware/auth.js";
import { v2 as cloudinary } from 'cloudinary';
import { createServer } from 'http';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import { PubSub } from "graphql-subscriptions";

const pubSub = new PubSub();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const yoga = createYoga({
    schema: schema,
    context: ({ req, res }) => { return { pool, req, res, pubSub } },
    graphiql: {
        // Use WebSockets in GraphiQL
        subscriptionsProtocol: 'WS'
    }
})


// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
    res.type("html")
    res.end(ruruHTML({ endpoint: "/graphql" }))
})

app.all('/graphql', yoga)

// Get NodeJS Server from Yoga
const httpServer = createServer(app)
// Create WebSocket server instance from our Node server
const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql"
})

// Integrate Yoga's Envelop instance and NodeJS server with graphql-ws
useServer(
    {
        execute: (args) => args.rootValue.execute(args),
        subscribe: (args) => args.rootValue.subscribe(args),
        onSubscribe: async (ctx, msg) => {
            const { schema, execute, subscribe, contextFactory, parse, validate } = yogaApp.getEnveloped({
                ...ctx,
                req: ctx.extra.request,
                socket: ctx.extra.socket,
                params: msg.payload
            })

            const args = {
                schema,
                operationName: msg.payload.operationName,
                document: parse(msg.payload.query),
                variableValues: msg.payload.variables,
                contextValue: await contextFactory(),
                rootValue: {
                    execute,
                    subscribe
                }
            }

            const errors = validate(args.schema, args.document)
            if (errors.length) return errors
            return args
        }
    },
    wsServer
)

httpServer.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT)
})