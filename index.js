import express from "express";
import cors from 'cors'
import { } from 'dotenv/config' // module
import { createYoga } from 'graphql-yoga'
import { schema } from "./graphql/index.js";
import { pool } from './database/connection.js'
import { ruruHTML } from "ruru/server"
import cookieParser from 'cookie-parser';
import { authMiddleware } from "./middleware/auth.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);

const yoga = createYoga({
    schema: schema,
    context: ({ req, res }) => { return { pool, req, res } }
})


// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
    res.type("html")
    res.end(ruruHTML({ endpoint: "/graphql" }))
})

app.all('/graphql', yoga)


app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT)
})