const axios = require('axios').default;
const webhook = require("./schema/webhook")
async function getMeme(_type) {
    return new Promise((resolve, reject) => {
        axios(`https://www.reddit.com/r/${_type}/top/.json`)
            .then(({ data }) => {
                var list = data.data.children.filter(({ data }) => data.is_video == false)
                list = list.filter((post) => !post.data.over_18)
                resolve(list[Math.floor(Math.random() * list.length)].data);
            }).catch(reject)
    })
}

function sendMeme(webhook, meme) {
    axios.post(webhook, {
        username: "Memez",
        avatar_url: "https://e7.pngegg.com/pngimages/803/386/png-clipart-green-frog-wearing-sunglasses-illustration-twitch-emote-streaming-media-video-game-hitorigoto-others-miscellaneous-hat.png",
        embeds: [
            {
                title: meme.title,
                image: {
                    url: meme.url
                }
            }
        ],
    }).catch(err => {
        console.log(err.response)
        // If 401 or 403, the webhook is invalid
        if (err.response.status === 401 || err.response.status === 403) {
            webhook.deleteOne({ url: webhook }).then(() => {
                console.log("Webhook deleted")
            }).catch(console.error)
        }
    })
}
module.exports = { getMeme, sendMeme }