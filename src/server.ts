import express from "express";
import router from "./router";
import db from "./config/db";
import colors from "colors"
import cors,{CorsOptions} from "cors"
import morgan from "morgan"
import swaggerUI from "swagger-ui-express"
import swaggerSpec from "./config/swagger";

async function connectDB(){
    try {
        await db.authenticate()
        db.sync()

    } catch (error) {
        console.log(colors.red.bold("Hubo un error al conectarse a la BD"))
    }
}
connectDB()
const server=express()

const corsOptions:CorsOptions={
    origin:function(origin,callback){
        if(origin==process.env.FRONTEND_URL){
            callback(null,true)
        }
        else{
            callback(new Error('Error de CORS'))
        }
    }
}

server.use(cors(corsOptions))

server.use(express.json())

server.use(morgan("dev"))

server.use('/api/v1/products',router)

server.use("/docs",swaggerUI.serve,swaggerUI.setup(swaggerSpec))

export default server