import { queryValuesForDB } from "../../utils.js";

export const chatResolver = {
    Query: {
        getChat: async (_, { reciever }, { pool, req, res, pubSub }) => {
            try {
                let messages = await pool.query(
                    `SELECT * FROM chats WHERE sender=$1 AND reciever=$2`,
                    [req.user.id, reciever]
                )
                return messages?.rows ? messages.rows : [];
            } catch (error) {
                console.log(error)
                return res.json({ error })
            }
        }
    },
    Mutation: {
        sendMessage: async (_, { message }, { pool, req, res, pubSub }) => {
            try {
                message['sender'] = req.user.id;
                let { fields, placeholders, values } = queryValuesForDB(message);
                let msg = await pool.query(
                    `INSERT INTO chats (${fields}) VALUES (${placeholders}) RETURNING *`,
                    values
                )
                pubSub.publish(`newMessage_${message.reciever}`, { messageSent: msg })
                return msg?.rows[0];
            } catch (error) {
                console.log(error)
                return res.json({ error })
            }

        }
    },
    Subscription: {
        messageSent: {
            subscribe: (_, { receiverid }, { pubSub }) => pubSub.asyncIterator(`newMessage_${receiverid}`),
            resolve: (payload) => {
                return payload.messageSent.rows[0]
            }
        }
    }
}