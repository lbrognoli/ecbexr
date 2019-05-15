const express = require('express')
const ECB = require('./ECBLastPrice')

const app = express()

app.get("/", (req, res) => {
    res.send(`<h3>To use the tool go to https://ecblastprices.herokuapp.com/ECB/lastPrice?curr=BRL, for example.</h3> 
                <p>You can change the currency code in the parameter curr in order to see other currencies</p>`)
})

app.get("/ECB/lastPrice", (req, res) => {
    ECB.getLastPrice(req.query.curr).then(r => res.send(r) ).catch(e => res.send({
        "error" : "Something went very wrong"
    }) )
})

app.listen(process.env.PORT || 3000, () => {
    console.log("ECB Last Price API is UP")
})