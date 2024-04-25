import express, { Express, Response, Request } from "express";
import { Op } from "sequelize";

import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import Users from "../models/user.model";
dotenv.config()

const authRoute : Express = express()

authRoute.post("/", async (req: Request, res: Response)=>{
    try {
        const {body} = req
        const condition = {
            [Op.and] : [
                {email : body.email},
                {password : Users.generateMD5(body.password) }
            ]
        }
        const response = await Users.findOne({ where : condition }) // paranoid : false,

        if(response){
            const jsondata = {
                id : response.id,
                name : `${response.firstName} ${response.lastName}`,
                account : response.account,
            }
            const secretkey:any = process.env.SECRET_KEY
            const token = jwt.sign(jsondata, secretkey);
            res.status(200).json({token : token, data : jsondata})
        }else {
            // Send 401 status code if credentials are incorrect
            res.status(401).json({ error: 'Invalid email or password' });
        }
        
    } catch (error) {
        res.status(500).json(error)
    }
})
authRoute.put("/", async (req: Request, res: Response)=>{
    try {
        const {body} = req
        const response = await Users.update(body,{ where : {email : body.email} }) // paranoid : false,
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error)
    }
})
authRoute.post("/adduser", async (req: Request, res: Response)=>{
    try {
        const {body} = req
        const response = await Users.create(body)
        res.status(200).json(response)
    } catch (error :any) {
        const errormessages = error.errors.map((errdata :any)=>{
            return errdata.message
        })
        res.status(500).json(error)
    }
})


export default authRoute