const proxy = require("express-http-proxy")
const express = require("express");
const app = express();
const port = 8080

const dir = __dirname + "/dist/my-wiener-linien/browser";

app.use(express.static(dir));

app.use("/api", proxy("www.wienerlinien.at", {
  https: true,
}));

app.get("/*", function (req, res) {
  res.sendFile(dir + "/index.html");
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
});
