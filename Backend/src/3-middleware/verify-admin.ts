import { NextFunction, Request, Response } from "express";
import cyber from "../2-utils/cyber";
import { AuthenticationError } from "../4-models/client-errors";

async function verifyAdmin(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
        // Verify token - crash if not valid:
        const isAdmin = await cyber.verifyAdmin(request);
        if (!isAdmin) {
            next(new AuthenticationError("You are not admin"));
        }
        // If admin - continue:
        next();
    }
    catch (err: any) {
        next(err);
    }
}


export default verifyAdmin;
