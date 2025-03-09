import express, { Application } from "express";
import { env } from "process";
import validateEnv from "./utils/validate.env";
import connectDB from "./config/db.config";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from './routes/user/userRoutes'
import adminRoutes from './routes/admin/adminRoute'
import { errorHandler } from "./middlewares/errorMiddleware";

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
        this.app.use(cookieParser())
    }

    private initializeDatabase(): void{
        connectDB()
    }

    private initializeRoutes(): void{
        this.app.use('/api/auth', routes);
        this.app.use('/api/admin', adminRoutes);
        this.app.use(errorHandler)
    }

    public listen() {
        this.app.listen(env.PORT, () => {
            console.log(`Server running on http://localhost:${env.PORT}`);
        })
    }
};

const app = new App()
app.listen()