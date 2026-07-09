const express = require("express");
const cors = require("cors")
const postRouter = require("../routes/post.routes");
const app = express();

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173"
}))
app.get("/", (req, res) => {
  res.send("Server Working");
});

app.use("/api/post",postRouter)

module.exports=app