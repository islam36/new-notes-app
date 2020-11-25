const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/views/index.html');
});


app.get('/notes', (req, res) => {
    try {
        if(fs.existsSync('db.json') ) {
            let notes = JSON.parse(fs.readFileSync('db.json')).notes;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(notes);
        }
        else {
            let err = new Error('File not found');
            throw err;
        }
    } catch (err) {
        console.log(err);
        res.statusCode = 404;
        res.end(err);
    }

});


app.post('/notes', (req, res) => {
    try {
        if(fs.existsSync('db.json') ){
            let data = JSON.parse(fs.readFileSync('db.json'));
            let notes = data.notes;
            let newNote = {
                id: new Date().valueOf().toString(),
                title: req.body.title,
                note: req.body.note
            };
            notes.push(newNote);

            fs.writeFileSync('db.json', JSON.stringify(data, null, 2));

            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json(newNote);
        }
        else {
            let err = new Error('File not found');
            throw err;
        }
    } catch (err) {
        console.log(err);
        res.statusCode = 404;
        res.end(err);
    }
});


app.put('/notes', (req, res) => {
    try {
        if(fs.existsSync('db.json') ){
            let data = JSON.parse(fs.readFileSync('db.json'));
            let notes = data.notes;

            
            let note = null;         
            for(let i=0; i < notes.length; i++){
                if (notes[i].id === req.body.id) {
                    note = notes[i];
                    break;
                }
            }

            if(note != null) {
                note.title = req.body.title;
                note.note = req.body.note; 
                
                fs.writeFileSync('db.json', JSON.stringify(data, null, 2));

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(note);
            }
            else {
                let err = new Error('Note not found!');                
                throw err;
            }


        }
        else {
            let err = new Error('File not found');
            throw err;
        }
    } catch (err) {
        console.log(err);
        res.statusCode = 404;
        res.end(err);
    }
});


app.delete('/notes', (req, res) => {
    try {
        if(fs.existsSync('db.json') ){
            let data = JSON.parse(fs.readFileSync('db.json'));
            let notes = data.notes;
            let index = notes.findIndex((note) => note.id === req.body.id);

            if (index > -1) {
                notes.splice(index, 1);

                fs.writeFileSync('db.json', JSON.stringify(data, null, 2));

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                let response = { id: req.body.id };
                res.json(response);
            }
            else {
                let err = new Error('Note not found!');
                throw err;
            }
        }
        else {
            let err = new Error('File not found');
            throw err;
        }
    } catch (err) {
        console.log(err);
        res.statusCode = 404;
        res.end(err);
    }
});



app.listen(8000);
console.log("server runnig on http://localhost:8000");