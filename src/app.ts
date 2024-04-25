import express, { Request, Response, Application } from 'express'
import cors from 'cors'
import userRoute from './routes/user'
import RouterMiddleware from './middlewares/middleware'
import authRoute from './routes/authentication'

const port:Number = 8080
const app: Application = express()

const start = async (app: Application) => {
    app.use(cors());
    app.use(express.json())
    app.get("/", (req: Request, res: Response)=>{
        try {
            res.status(200).json("Rest API SERVER READY")
        } catch (error) {
            res.status(500).json(error)
        }
    })

    app.use('/authenticate',authRoute)
    app.use(RouterMiddleware.routerMiddleware)
    app.use('/users',userRoute)
    app.listen(port,()=>{
        console.log(`REST API SERVER READY AT http:localhost:${port}`);
    })
}



start(app)
