const webhook = require("./webhook");
const { getMeme, sendMeme } = require("./meme");
const types = ["meme", "dankmeme", "ProgrammerHumor"];

async function Fire() {
    for (const type of types) {
        await getMeme(type).then(async meme => {
            const list = await webhook.find({ type: types })
            list.forEach((webhook) => {
                sendMeme(webhook, meme);
            });
        });
    }
}

async function Test(webhook, _type) {
    const meme = await getMeme(_type);
    sendMeme(webhook, meme);
}

module.exports = { Fire, Test };