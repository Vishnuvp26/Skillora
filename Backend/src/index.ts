import express, { Application } from "express";
import { env } from "process";
import validateEnv from "./utils/validate.env";
import connectDB from "./config/db";

class App {
    public app: Application;

    constructor() {
        validateEnv()
        this.app = express();

        this.initializeDatabase()
    }

    private initializeDatabase(): void{
        connectDB()
    }

    public listen() {
        this.app.listen(env.PORT, () => {
            console.log(`Server running on http://localhost:${env.PORT}`);
        })
    }
};

const app = new App()
app.listen()