export default () => ({
    jwtSecret: process.env.JWT_SECRET_KEY,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME
});