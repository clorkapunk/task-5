const {fakerEN, fakerRU, fakerPL} = require("@faker-js/faker");
require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors')
// Функция для генерации случайных данных
function generateRandomData() {
    return Array.from({ length: 10 }, () => Math.random());
}

const fakers = {
    us: fakerEN,
    pl: fakerPL,
    ru: fakerRU
}


app.use(cors())
app.use(express.json())
// Маршрут для получения данных
app.get('/data', (req, res) => {
    const {r, s, e, page, limit} = req.query
    // console.log(r ,s ,e ,page , limit)
    const faker = fakers[r]

    if(Number.isNaN(Number(page)) || Number.isNaN(Number(s)) || Number.isNaN(Number(e)))
    {
        res.status(400).json({message: "You idiot"})
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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
