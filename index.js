const express = require('express')
const ECB = require('./ECBLastPrice')

const app = express()

app.get("/ECB/lastPrice", (req, res) => {
    ECB.getLastPrice(req.query.curr).then(r => res.send(r) ).catch(e => res.send({
        "error" : "Something went very wrong"
    }) )
})

app.listen(process.env.PORT || 3000, () => {
    console.log("ECB Last Price API is UP")
})