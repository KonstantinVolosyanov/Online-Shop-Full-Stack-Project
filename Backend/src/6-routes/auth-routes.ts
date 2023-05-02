import express, { Request, Response, NextFunction} from "express";
import {CredentialsModel} from "../4-models/credentials-model";
import {UserModel} from "../4-models/user-model";
import authService from "../5-services/auth-service";

const router = express.Router(); // Capital R

// Register // POST // http://localhost:4000/api/auth/register
router.post("/auth/register", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Create new user by model:
        const user = new UserModel(request.body);
        // Create token for new user:
        const token = await authService.register(user);
        // Respond status and token:
        response.status(201).json(token);
    }
    catch(err: any) {
        next(err);
    }
});

// Login // POST // http://localhost:4000/api/auth/login
router.post("/auth/login", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Create new Credentials by model:
        const credentials = new CredentialsModel(request.body);
        // Create new token for credentials:
        const token = await authService.login(credentials);
        // Respond token:
        response.json(token);
    }
    catch(err: any) {
        next(err);
    }
});

export default router;
