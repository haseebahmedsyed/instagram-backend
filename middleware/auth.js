import jwt from 'jsonwebtoken'
import { pool } from '../database/connection.js'

export const authMiddleware = async (req, res, next) => {
    let { cookies } = req;

    if (cookies && cookies.token) {
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
    }
    next();
}