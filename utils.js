import jwt from 'jsonwebtoken'

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