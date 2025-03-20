import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { errorHandler } from "./src/middlewares/error.middleware.js"

const app = express()

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)

//common middleware
app.use(express.json({
    limit: "16kb"
}))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())

//import routes
import  projectRouter  from "./src/routes/project.routes.js"
import userRouter from "./src/routes/user.routes.js"
import inviteRouter from "./src/routes/invite.routes.js"
import taskRouter from "./src/routes/task.routes.js"



//routes
app.use("/api/v1/projects", projectRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/invites", inviteRouter)
app.use("/api/v1/tasks", taskRouter)

app.use(errorHandler)   


export{app}
