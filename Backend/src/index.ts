import express, { Application } from "express";
import { env } from "process";
import validateEnv from "./utils/validate.env";
import connectDB from "./config/db";
import cors from "cors";
import routes from  './routes/userRoutes'

class App {
    public app: Application;

    constructor() {
        validateEnv()
        this.app = express();

        this.initializeMiddlewares()
        this.initializeDatabase()
        this.initializeRoutes()
    }

    private initializeMiddlewares(): void {
        this.app.use(cors({ 
            origin: env.CLIENT_URL,
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true
        }));
        this.app.use(express.json());
    }

    private initializeDatabase(): void{
        connectDB()
    }

    private initializeRoutes(): void{
        this.app.use('/api/auth', routes);
    }

    public listen() {
        this.app.listen(env.PORT, () => {
            console.log(`Server running on http://localhost:${env.PORT}`);
        })
    }
};

const app = new App()
app.listen()