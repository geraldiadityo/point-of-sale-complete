import { jwtVerify } from "jose";

export function getJwtSecretKey() {
    const secret = process.env.JWT_SECRET_KEY;

    if(!secret){
        throw new Error('JWT secret key is invalid');
    }

    return new TextEncoder().encode(secret);
}

export async function verifyJwtToken(token){
    try {
        const { payload } = await jwtVerify(token, getJwtSecretKey());

        return payload
    } catch (err){
        return null;
    }
}
