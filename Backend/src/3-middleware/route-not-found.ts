import { NextFunction, Request, Response } from "express";
import { RouteNotFoundError } from "../4-models/client-errors";

function routeNotFound(request: Request, response: Response, next: NextFunction): void {
    // Create route-not-found error:
    const err = new RouteNotFoundError(request.originalUrl);
    // Send to catch-all middleware:
    next(err);
}

export default routeNotFound;
