import jwt from 'jsonwebtoken'
import { UserInputError } from 'apollo-server';

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

export function checkUserAuthorization(req) {
    if (!req.user)
        throw new UserInputError('You are not authorized to perform any action');
}