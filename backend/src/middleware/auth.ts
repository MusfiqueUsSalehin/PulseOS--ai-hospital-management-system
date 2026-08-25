import {auth} from '../lib/auth';
import {fromNodeHeaders} from 'better-auth/node';
import type {Request, Response, NextFunction} from 'express';


export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {

    try {
        
        const session = await auth.api.getSession(
            {headers: fromNodeHeaders(req.headers)});

        if (!session) {
            return res.status(401).json({message: "Unauthorized"});
        }

        (req as any).session = session; // Attach session to request object for downstream use
        (req as any).user = session.user; // Attach user to request object for downstream use
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error in requireAuth middleware:", error);
        res.status(500).json({message: "Internal server error"});
    }
    
};
