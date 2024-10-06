const express = require('express');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization')
    next()
});
const bodyParser = require('body-parser');
const PORT = 3000;
const secretKey = 'My super secret key';
const jwtMW = exjwt.expressjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

app.use(bodyParser.json());

let users = [{
    id: 1,
    username: 'Prasanth',
    password: '2601'
}, {
    id: 2,
    username: 'Preethi',
    password: '2402'
}];


app.post('/api/login', (req, res) => {
    const {username, password} = req.body;
    for (let user of users) {
        if (username === user.username && password === user.password) {
            console.log(user)
            let token = jwt.sign({
                id: user.id,
                username: user.username
            }, secretKey, {
                expiresIn: '180s'
            });
            res.json({
                success: true,
                err: null,
                token
            });
            break;
        } else {
            res.status(401).json({
                success: false,
                token: null,
                err: 'Username or Password is incorrect'
            });
        }
    }
    console.log('This is me', username, password)
    res.json({data: 'it works'})
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

app.get('/api/dashboard', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Secret content that only logged in people can see'
    })
});

app.get('/api/settings', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'This is the settings page'
    })
});


app.use(function (err, req, res, next) {
    console.log(err)
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Username or paassword is incorrect 2'
        });
    } else {
        next(err)
    }
});

app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`)
});
