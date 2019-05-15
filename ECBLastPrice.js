const request = require("request")
const R = require("ramda")
const moment = require("moment")
const { promisify } = require('bluebird')
const convert = require("xml-js")
const dateFns = require("date-fns")

const requestAsync = promisify(request)

const getTimeSeries = async (currency, startDate, endDate) => {
    const response = await requestAsync({
        method : "GET",
        url : `https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.${currency}.EUR.SP00.A?startPeriod=${startDate}&endPeriod=${endDate}`,
        encoding : null
    })

    const data = JSON.parse(convert.xml2json(response.body.toString(), { compact : true, spaces : 4}))
    const rows = data["message:GenericData"]["message:DataSet"]["generic:Series"]["generic:Obs"]
    
    const formatRows = R.map(row => {
        return {
            currencyPair : currency + "/EUR",
            date : moment(row["generic:ObsDimension"]._attributes.value, "YYYY-MM-DD").format("DD/MM/YYYY"),
            rate : Number(row["generic:ObsValue"]._attributes.value),
            source : "ECB"
        }
    })

    return formatRows(rows)
}

const getLastPrice = async (currency) => {
    const startDate = moment(dateFns.startOfMonth(new Date())).format("YYYY-MM-DD")
    const endDate = moment().format("YYYY-MM-DD")
    const series = await getTimeSeries(currency, startDate, endDate)
    const last = R.last(series)

    return `<h1> European Central Bank Last Price </h1>
            <h2>Currency Pair : ${last.currencyPair}</h2>
            <h2>Date : ${last.date}</h2>
            <h2>Rate : ${last.rate}</h2>`
}

module.exports = {
    getTimeSeries,
    getLastPrice
}




