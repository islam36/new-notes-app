const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine','ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', (req,res) => {
    axios.get('http://localhost:8001/notes')
        .then( (response) => {
            var notes = response.data;
            res.render('index.ejs' , {notes: notes});
        })
        .catch( (err) => {
            console.log(err);
        });
});


app.post('/' , (req, res) => {
    axios({
        url: 'http://localhost:8001/notes',
        method: 'post',
        data: {
            title: req.body.title,
            note: req.body.note
        }
    })
        .then((response) => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
        });
});



app.listen(8000);
console.log("server runnig on http://localhost:8000");
