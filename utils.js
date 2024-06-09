import jwt from 'jsonwebtoken'
import cron from 'node-cron'
import { UserInputError } from 'apollo-server';

var scheduledJobs = {}

const createJsonWebToken = ({ id }) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
}

export const createCookie = (res, user) => {
    const options = {
        expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
        httpOnly: true
    }
    const token = createJsonWebToken(user)
    res.cookie("token", token, options);
    return res;
}

export function queryValuesForDB(data) {
    const fields = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map((_, index) => `$${index + 1}`).join(', ');
    const values = Object.values(data);
    return { fields, placeholders, values }
}

export function sheculeArchiving(table, id, pool) {
    let query = `UPDATE ${table} SET isarchieved=$1 WHERE id=$2`
    console.log("Archiving started...")
    let job = cron.schedule('0 0 */24 * * *', async () => {
        await pool.query(query, [true, id])
        console.log("story deleted...")
        job.stop();
        delete scheduledJobs[`${table}-` + id]
        console.log("job destroyed...")
    })
    scheduledJobs[`${table}-` + id] = job;
}

export function cancelArchiving(table, id) {
    if (scheduledJobs[`${table}-` + id]) {
        console.log("destroying cron job...")
        scheduledJobs[`${table}-` + id].stop();
        delete scheduledJobs[`${table}-` + id]
    }
}
