import cookieParser from "cookie-parser";
import cors from "cors";
// import expressSession from "express-session";
import express , { Request, Response }from "express";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErroHandler";
import notFound from "./app/middlewares/notFound";

const app = express()


app.use(cookieParser())
app.use(express.json())
app.use(cors())
app.use("/api/v1",router)
app.get("/",(req: Request, res:Response) => {
    res.status(200).json({
        message:"Welcome to Digital Wallet System Backend"
    })
})

app.use(globalErrorHandler)

app.use(notFound)

export default app