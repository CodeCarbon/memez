const express = require("express");
const db = require("./schema/connect");
const webhook = require("./schema/webhook");
const { Fire, Test } = require("./events");
const app = express();

app.use(express.urlencoded({ extended: true }));

db.then(() => console.log("Connected to MongoDB " + new Date().toLocaleDateString())).catch(console.error);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", async (req, res) => {

    const _webhook = req.body.webhook;
    const _type = req.body.type;
    if (!_webhook || !_type) return res.json({ error: true });
    if (!["memes", "dankmeme", "ProgrammerHumor"].includes(_type)) return res.json({ error: true });

    if (_webhook.startsWith("https://discord.com/api/webhooks/")) {
        webhook.create({ url: _webhook, type: _type }).then(() => {
            res.json({ error: false });
            Test(_webhook, _type);
        }).catch(() => {
            res.json({ error: true });
        });
    } else {
        res.json({ error: true });
    }
});

app.listen(3000, () => console.log("http://localhost:3000"));

setInterval(() => {
    const date = new Date()
    const isHourFine = date.getHours() === 0 || date.getHours() === 12;
    const isMinuteFine = date.getMinutes() >= 0 && date.getMinutes() <= 1;
    if (isHourFine && isMinuteFine) Fire();
}, 1000 * 120); // 2 minutes