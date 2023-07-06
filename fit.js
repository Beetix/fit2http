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


// Require the module
const fitDecoder = require('fit-decoder');

// fit2json expects binary represetnation in FIT format as ArrayBuffer
// You can get it by reading a file in Node:

const fs = require('fs');
const file = fs.readFileSync('activity.fit');
const buffer = file.buffer;

// fit2json converts binary FIT into a raw JSON representation. No record names, types or values
// are parsed. It is useful for low level data analysis
const jsonRaw = fitDecoder.fit2json(buffer);
//console.log(jsonRaw);

// parseRecords converts raw JSON format into readable format using current
// Global FIT Profile (SDK 21.47.00)
// It also performs simple conversions for some data formats like time, distance, coordinates.
const json = fitDecoder.parseRecords(jsonRaw);
//console.log(json);

const parseRecords = async () => {
    let ref_ts = 0;
    for(record_id in json['records']) {
        const record = json['records'][record_id];
        if (record.type === 'file_id') ref_ts = record.data.time_created.getTime() / 1000 - 631065600;
        else if (record.type === 'monitoring' && record.data.heart_rate) {
            console.log(record.data);
            const { timestamp_16 } = record.data;
            const rel_ts = (timestamp_16 - (ref_ts & 0xFFFF)) & 0xFFFF;
            const abs_ts = (rel_ts + ref_ts + 631065600) * 1000;
            const heartrate = record.data.heart_rate;
            try {
                await Heartrates.create({
                    time: abs_ts,
                    heartrate
                });
                console.log(`Inserted time = ${abs_ts}, heartrate = ${heartrate}`);
            } catch (e) {
                console.log('Error inserting data ', e);
            }
        }
    }
}

parseRecords();

