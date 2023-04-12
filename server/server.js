import express from "express";
import cors from 'cors';
import router from "./src/router/router.js";


const app = express();
const addr = "127.0.0.1"
const port = 6060;

app.use(cors()); // <-- alla ips är tillåtna att ansluta
app.use(express.json()); // <-- in-data går från json till javascript-objekt

app.get("/health", (request, response) => {
    response.send({ state: "up", message: "Server is healthy" });
});



//Routes
app.use("/ducks/api", router)



app.listen(port, addr, () => {
    console.log(`server is listening on port ${port}`)
})
