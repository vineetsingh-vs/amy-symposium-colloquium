import express, {Application, Request, Response, NextFunction} from "express"
import cors from "cors"
import logger from "./logger"

const app: Application = express()

app.use(cors({ origin: "*" }));
app.use(logger)

app.get("/", (req: Request, res: Response) => {
    res.send("Backend is Running :)")
})

app.post("/login", (req: Request, res: Response) => {
    res.status(200).send({body: "Login", access_token: "test"})
})

app.post("/login_cas", (req: Request, res: Response) => {
    res.status(200).send({body: "Login CAS", access_token: "test"})
})

app.post("/login_social", (req: Request, res: Response) => {
    res.status(200).send({body: "Login Social", access_token: "test"})
})

app.get("/v1/users/me", (req: Request, res: Response) => {
    res.status(200).send({id: "1234", name: "name", isAdmin: true, emailId: "Test@email.com", bio: "Bio", tags: []})
})

app.get("/v1/papers", (req: Request, res: Response) => {
    let ao = [];
    ao.push({id: "1", title: "Title", url: "www.google.com", creator: "Creator", authors: [{name: "Author", id: "1"}], tags: [], reviews: []})
    res.status(200).send(ao)
})

app.get("/v1/tags", (req: Request, res: Response) => {
    res.status(200).send([])
})

const PORT = 4000//process.env.NODE_PORT

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})