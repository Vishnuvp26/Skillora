import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const env = {
    get PORT() {
        return process.env.PORT
    },
    get MONGODB_URL() {
        return process.env.MONGODB_URL
    },
    get JWT_SECRET() {
        return process.env.JWT_SECRET!
    },
    get REFRESH_SECRET() {
        return process.env.REFRESH_SECRET!
    },
    get CLIENT_URL() {
        return process.env.CLIENT_URL
    },
    get EMAIL_USER() {
        return process.env.EMAIL_USER
    },
    get EMAIL_PASS() {
        return process.env.EMAIL_PASS
    }
};