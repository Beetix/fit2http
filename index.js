const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/fit');

sequelize.authenticate().then(() => {
    console.log('Connection OK');
}).catch(err => {
    console.error('Connection failed: ', err);
});

let Heartrates = sequelize.define('heartrates', {
    time: {
        type: Sequelize.DATE,
        primaryKey: true
    },
    heartrate: {
        type: Sequelize.INTEGER
    }
}, { timestamps: false });

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3333;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.get('/', async (req, res) => {
    try {
        const heartrates = await Heartrates.findAll({order: [['time', 'ASC']]});
        res.send(heartrates);
    } catch (e) {
        console.log('Error fetching data ', e);
    }

});
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

