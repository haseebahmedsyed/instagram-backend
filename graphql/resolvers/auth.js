import { createCookie } from "../../utils.js";
import bcrypt from 'bcryptjs';
import { UserInputError } from 'apollo-server';

export const authResolver = {

    Query: {
        login: async (_, { username, password }, { pool, req, res }) => {
            let user = await pool.query(
                'SELECT * FROM users WHERE username = $1',
                [username]
            )
            user = user?.rows[0]
            if (user) {
                let isAuthenticated = await bcrypt.compare(password, user.password);
                if (isAuthenticated) {
                    res = createCookie(res, user);
                    return user;
                }
            }
            // throw new UserInputError('Incorrect Credentials');
            return res.status(401).json({ error: 'Incorrect Credentials' });
        }
    },

    Mutation: {
        signup: async (_, { user }, { pool, req, res }) => {
            try {
                let isUserExists = await pool.query(
                    'SELECT COUNT(username) FROM users WHERE username = $1',
                    [user.username]
                )
                console.log(isUserExists)
                if (isUserExists?.rows[0]?.count !== '0')
                    // throw new UserInputError('Try with another username');
                    return res.json({ error: 'Try with another username' });

                user['password'] = await bcrypt.hash(user.password, 10);
                const fields = Object.keys(user).join(', ');
                const placeholders = Object.keys(user).map((_, index) => `$${index + 1}`).join(', ');
                const values = Object.values(user);
                let userObj = await pool.query(
                    `INSERT INTO users (${fields}) VALUES (${placeholders}) RETURNING *`,
                    values
                )
                userObj = userObj?.rows[0];
                res = createCookie(res, userObj)
                return userObj;
            } catch (error) {
                console.error("Error during signup:", error);
                // throw new UserInputError('Error during signup');
                return res.json({ error: 'Something went wrong' });
            }
        }
    }
}