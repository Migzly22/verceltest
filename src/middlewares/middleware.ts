import {Request, Response, NextFunction } from "express";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config()

export default class RouterMiddleware{
    static routerMiddleware(req: Request, res: Response, next: NextFunction){
        try {
            const bearerToken: string[] = (req.headers.authorization || "").split(" ")            
            if(bearerToken.length && bearerToken[0] == "Bearer"){
                const secretKey:any = process.env.SECRET_KEY

                jwt.verify(bearerToken[1], secretKey, (err:any, decoded:any) => {
                    if (err) {
                        return res.status(401).json({message: "Invalid token"})
                    } else {
                        return next()
                    }
                });
            }else{
                return res.status(401).json({message: "Invalid token"})
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}