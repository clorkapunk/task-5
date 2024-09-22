const {fakerEN, fakerRU, fakerPL} = require("@faker-js/faker");
const express = require('express')
const path = require('path')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const {introduceErrors} = require('./errors')
const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');
const {writeFileSync, unlinkSync} = require("node:fs");
const seedrandom = require("seedrandom");

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

function generatePage(faker, page, errorsRate, r, seed){
    let data = []
    for (let i = 1; i <= 20; i++) {
        let addressArr = []

        for (let j = 0; j < 2; j++) {
            Math.random = seedrandom((seed + page) * i * j)
            let result = Math.random() > 0.7
            addressArr.push(result)
        }

        const address = []
        if(addressArr[0]) address.push(faker.location.state())
        if(addressArr[1]) address.push(faker.location.city())
        address.push(faker.location.streetAddress({ useFullAddress: true}))

        console.log(address.length)

        let temp = {
            index: (Number(page) - 1) * 20 + i,
            id: faker.string.uuid(),
            fullName: faker.person.fullName(),
            address: address.join(', '),
            phoneNumber: faker.phone.number()
        }

        temp.id = introduceErrors(temp.id, errorsRate, r, seed)
        temp.fullName = introduceErrors(temp.fullName, errorsRate, r, seed)
        temp.address = introduceErrors(temp.address, errorsRate, r, seed)
        temp.phoneNumber = introduceErrors(temp.phoneNumber, errorsRate, r, seed)

        data.push(temp)
    }

    return data
}


app.get('/page', (req, res) => {
    const {r, s, e, page} = req.query

    const faker = fakers[r]

    if(Number.isNaN(Number(page)) || Number.isNaN(Number(s)) || Number.isNaN(Number(e)))
    {
        return res.status(400).json({message: "You idiot"})
    }
    const seed = Number(s + page)
    const errorsRate = Number(e)

    faker.seed(seed)
    const data = generatePage(faker, page, errorsRate, r, seed)
    res.json({data, page: Number(page)});
});

app.get('/all', (req, res) => {
    const {r, s, e, max} = req.query

    const faker = fakers[r]

    if(Number.isNaN(Number(max)) || Number.isNaN(Number(s)) || Number.isNaN(Number(e)))
    {
        return res.status(400).json({message: "You idiot"})
    }

    const data = []

    for (let i = 1; i <= max; i++) {

        const seed = Number(s + i)
        const errorsRate = Number(e)
        faker.seed(seed)
        const dataPage = generatePage(faker, i, errorsRate, r, seed)
        data.push(...dataPage)
        // for (let j = 1; j <= 20; j++) {
        //     let temp = {
        //         index: ((i - 1) * 20) + j,
        //         id: faker.string.uuid(),
        //         fullName: faker.person.fullName(),
        //         address: [faker.location.city(), faker.location.streetAddress({useFullAddress: true})].join(', '),
        //         phoneNumber: faker.phone.number()
        //     }
        //
        //     temp.id = introduceErrors(temp.id, errorsRate, r, seed)
        //     temp.fullName = introduceErrors(temp.fullName, errorsRate, r, seed)
        //     temp.address = introduceErrors(temp.address, errorsRate, r, seed)
        //     temp.phoneNumber = introduceErrors(temp.phoneNumber, errorsRate, r, seed)
        //
        //     data.push(temp)
        // }
    }


    res.json({data, page: Number(max)});
});

app.get('/download-all', (req, res) => {
    const {r, s, e, max} = req.query

    const faker = fakers[r]

    if(Number.isNaN(Number(max)) || Number.isNaN(Number(s)) || Number.isNaN(Number(e)))
    {
        return res.status(400).json({message: "You idiot"})
    }

    const data = []

    for (let i = 1; i <= max; i++) {
        const seed = Number(s + i)
        const errorsRate = Number(e)
        faker.seed(seed)
        const dataPage = generatePage(faker, i, errorsRate, r, seed)
        data.push(...dataPage)
    }

    const csvFromArrayOfObjects = convertArrayToCSV(data, {separator: ";"});

    // Создаем временный файл
    const tempFilePath = 'temp.csv';
    writeFileSync(tempFilePath, csvFromArrayOfObjects);

    // Отправляем файл пользователю
    res.download(tempFilePath, 'my_data.csv', (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Ошибка при скачивании файла');
        } else {
            // Удаляем временный файл после отправки
            unlinkSync(tempFilePath);
        }
    });
});

app.get('/download-page', (req, res) => {
    const {r, s, e, page} = req.query

    const faker = fakers[r]

    if(Number.isNaN(Number(page)) || Number.isNaN(Number(s)) || Number.isNaN(Number(e)))
    {
        return res.status(400).json({message: "You idiot"})
    }

    const seed = Number(s + page)
    const errorsRate = Number(e)

    faker.seed(seed)
    const data = generatePage(faker, page, errorsRate, r, seed)

    const csvFromArrayOfObjects = convertArrayToCSV(data, {separator: ";"});

    // Создаем временный файл
    const tempFilePath = 'temp.csv';
    writeFileSync(tempFilePath, csvFromArrayOfObjects);

    // Отправляем файл пользователю
    res.download(tempFilePath, 'my_data.csv', (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Ошибка при скачивании файла');
        } else {
            // Удаляем временный файл после отправки
            unlinkSync(tempFilePath);
        }
    });
});

app.get('*', (req, res) => {
    console.log(buildPath)
    res.sendFile('index.html', {root: buildPath})
})

app.listen(port, () => {
    console.log(`Server is online on port: ${port}`)
})
