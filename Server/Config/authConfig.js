import crypto from 'crypto'

const JWT_SECRET = crypto.randomBytes(32).toString();

export default JWT_SECRET