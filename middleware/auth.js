import jwt from 'jsonwebtoken'
import { pool } from '../database/connection.js'
import { GraphQLError } from 'graphql'

export const authMiddleware = async (req, res, next) => {
    let { cookies } = req;
    if (req.body.operationName === 'login' || req.body.operationName === 'signup' || req.body.operationName === undefined)
        next();
    else if (cookies && cookies.token) {
        const decode = jwt.verify(cookies.token, process.env.JWT_SECRET);
        let user = await pool.query(
            'SELECT * FROM users WHERE id=$1',
            [decode.id]
        )
        if (user && user.rows && user.rows.length) {
            user = user.rows[0]
            let { password, ...userObj } = user;
            req.user = userObj;
        }
        next();
    } else {
        // return new GraphQLError('You are not authorized to perform any action.');
        return res.status(401).json({ error: 'Invalid token or authentication failed.' });
    }
}