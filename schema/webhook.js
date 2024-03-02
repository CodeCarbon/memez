const { Schema, model, models } = require("mongoose")

const webhook = new Schema({
    url: String,
    type: String,
    day: {
        type: Number,
        default: 0
    },
});

module.exports = models.webhook || model("webhook", webhook, "webhook")