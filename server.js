require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

//routes
const userRoutes = require("./routes/users");
const pollRoutes = require("./routes/polls");

const app = express();
const port = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB is now connected."))
  .catch((error) => console.error(error));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));

app.use("/users", userRoutes);
app.use("/polls", pollRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
//Logout
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/index.html");
});

app.use((req, res) => res.status(404).send("Page not found."));
app.listen(port, () => {
    console.log(`Port ${port} is listening.`);
    if(process.env.NODE_ENV === "test"){
        console.log("Run test...");
    }
});