import { env } from '../config/env.config'

export default function validateEnv() {
    if (!env.PORT) {
        throw new Error('PORT is not defined in env')
    }
    if (!env.MONGODB_URL) {
        throw new Error('MONGODB_URL is not defined in env')
    }
    if (!env.JWT_SECRET) {
        throw new Error('JWT_Secret is not defined in env')
    }
    if (!env.CLIENT_URL) {
        throw new Error ('CLIENT_URL is not defined in env')
    }
}