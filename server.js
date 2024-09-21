const {fakerEN, fakerRU, fakerPL} = require("@faker-js/faker");
const express = require('express')
const path = require('path')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()


const app = express()
const port = process.env.PORT || 3000


const buildPath = path.join(__dirname, 'client/dist')


const fakers = {
    us: fakerEN,
    pl: fakerPL,
    ru: fakerRU
}

app.use(express.static(buildPath))
app.use(express.json())
app.use(cors())


app.get('/data', (req, res) => {
    const {r, s, e, page, limit} = req.query
    // console.log(r ,s ,e ,page , limit)
    const faker = fakers[r]

    if(Number.isNaN(Number(page)) || Number.isNaN(Number(s)) || Number.isNaN(Number(e)))
    {
        return res.status(400).json({message: "You idiot"})
    }
    faker.seed(Number(s + page))
    const data = []
    for (let i = 0; i < 20; i++) {
        let temp = {
            id: faker.string.uuid(),
            fullName: faker.person.fullName(),
            address: [faker.location.city(), faker.location.streetAddress({useFullAddress: true})].join(', '),
            phoneNumber: faker.phone.number()
        }
        data.push(temp)
    }
    res.json({data, page: page});
});

app.get('*', (req, res) => {
    console.log(buildPath)
    res.sendFile('index.html', {root: buildPath})
})

app.listen(port, () => {
    console.log(`Server is online on port: ${port}`)
})
