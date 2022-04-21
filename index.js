const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const fileupload = require('express-fileupload')

const app = express()
const port = 5000 || process.env
//middleware
app.use(cors())
app.use(express.json())
app.use(fileupload())


//username: classroom
//password: QMegpSUbdry5tPmp

const uri = "mongodb+srv://classroom:QMegpSUbdry5tPmp@cluster0.u5ucb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('classroomdatabase');
        const coursecollection = database.collection('course');
        const instructorcollection = database.collection('instructor')

        //course POST
        app.post('/course', async (req, res) => {
            const coursename = req.body.coursename;
            const classnumber = req.body.classnumber;
            const date = req.body.date;
            const catagori = req.body.catagori;
            const amount = req.body.amount;
            const image = req.files.image;
            const imageData = image.data;
            const encodedimage = imageData.toString('base64');
            const imageBuffer = Buffer.from(encodedimage, 'base64');
            const courses = {
                coursename,
                classnumber,
                date,
                catagori,
                amount,
                picture: imageBuffer

            }
            const result = await coursecollection.insertOne(courses);
            res.json(result)


            // const newcourse = req.body;
            // const result = await coursecollection.insertOne(newcourse);

            // res.json(result);


        })
        //course GET
        app.get('/course', async (req, res) => {
            const cursor = coursecollection.find({})
            const courses = await cursor.toArray()
            res.json(courses)
        })
        //instructor POST
        app.post('/instructor', async (req, res) => {
            const name = req.body.name;
            const title = req.body.title;
            const image = req.files.image;
            const imageData = image.data;
            const encodedimage = imageData.toString('base64');
            const imageBuffer = Buffer.from(encodedimage, 'base64');
            const instructor = {
                name,
                title,
                picture: imageBuffer
            }
            const result = await instructorcollection.insertOne(instructor);
            res.json(result);

        })
        //instructor GET
        app.get('/instructor', async (req, res) => {
            const cursor = instructorcollection.find({})
            const instructors = await cursor.toArray();
            res.json(instructors)
        })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.log());




app.get('/', (req, res) => {
    res.send('Hello server! im find you')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})