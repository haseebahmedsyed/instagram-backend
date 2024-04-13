import { createCookie } from "../../utils.js";
import bcrypt from 'bcryptjs';

export const authResolver = {
    Mutation: {
        signup: async (_, { user }, { pool, req, res }) => {
            try {
                user['password'] = await bcrypt.hash(user.password, 10);
                const fields = Object.keys(user).join(', ');
                const placeholders = Object.keys(user).map((_, index) => `$${index + 1}`).join(', ');
                const values = Object.values(user);
                let userData = await pool.query(
                    `INSERT INTO users (${fields}) VALUES (${placeholders}) RETURNING *`,
                    values
                )
                res = createCookie(res, userData?.rows[0])
                return userData?.rows[0];
            } catch (error) {
                console.error("Error during signup:", error);
            }
        }
    }
}