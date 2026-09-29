import express from "express";

const app = express();
const port = 3000;

app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});