import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import path from "path";

const app = express();
const port = 3000;
env.config();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));


const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT),
});
db.connect();

app.post("/login", async (req, res) => {
  const { userid, password } = req.body;
  try{
  await db.query(
    "INSERT INTO users (userid, password) VALUES ($1, $2)",
    [userid, password]
  );
  res.redirect("/reviews.html");
}catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/reviews", async (req, res) => {
  const { rating, comment } = req.body;
  await db.query(
    "INSERT INTO reviews (rating, comment) VALUES ($1, $2)",
    [rating, comment]
  );
  res.redirect("/thankyou.html");
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});