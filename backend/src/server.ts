import dotenv from "dotenv";
import express, {
    type Application,
    type Request,
    type Response,
} from "express";

import cors from "cors";

import helmet from "helmet";

import cookieParser from "cookie-parser";


import morgan from "morgan";
import { connectDB } from "./config/db";

// Load environment variables from .env file
dotenv.config();


console.log("FRONTEND_URL from env:", process.env.PORT);


// Create an instance of the Express application
const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;


// Middleware to parse incoming JSON requests
app.use(cors({origin: process.env.FRONTEND_URL || "http://localhost:5173"}

));



// Middleware to set security-related HTTP headers
app.use(helmet(
    {crossOriginResourcePolicy: {policy: "cross-origin"}}
));



// Middleware to parse cookies from incoming requests
app.use(cookieParser());


//body parser middleware to parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({extended: true}));



if (process.env.NODE_ENV === "development") {
    // Serve static files from the "client/dist" directory in development
    app.use(morgan("dev"));
}

//basic route for testing the server
app.get("/", (req: Request, res: Response) => {
    res.send("Server is running");
});


//Global error handler
app.use((err: any, req: Request, res: Response, next: any) => {
    const statusCode = res.statusCode !== 200 ? 500 : res.statusCode;
    res.status(statusCode);
    console.error(err.stack);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});

// Start the server and listen on the specified port

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
})

.catch((error) => {
    console.error("Failed to connect to the database:", error);
});
