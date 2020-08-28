const express = require("express");
const app = express();
const path = require("path");

app.listen(3000, () => {
    console.log("Server listening on 3000");
});

app.use(express.static(path.resolve(__dirname, "node_modules/@asgardio/oidc-js/dist")))
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
});
