import express, { Express, Response, Request } from "express";
import { Op } from "sequelize";

import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import Users from "../models/user.model";

import nodemailer from 'nodemailer'

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
//check if the email exist
authRoute.post("/checkemail", async (req: Request, res: Response)=>{
    try {
        const {body} = req
        const response = await Users.findAndCountAll({ where : {email : body.email} }) // paranoid : false,
        if(response.count > 0){
            const message = await main(body.token, body.email)
            res.status(200).json({message : message})
        }else{
            res.status(403).json({message : "Failed"})
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
        res.status(500).json(error)
    }
})

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "noncre123@gmail.com",
      pass: "ywlewgcdbwiyrpvb",
    },
  });
  
  async function main(otpcode : number, targetuser : string = "noncre123@gmail.com") {
    try {
      // Send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Cinnamon Rols" <cinnamon@gmail.email>', // sender address
        to: `${targetuser}`, // list of receivers
        subject: "Recrea Forgotten Password", // Subject line
        html: `<b>Your OTP code is: ${otpcode}. Please use this code within 10 minutes as it will expire after that.</b>`, // html body
      });
  
      return "Success"
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    } catch (error) {
        return "Failed"
    }
  }
  
  

export default authRoute