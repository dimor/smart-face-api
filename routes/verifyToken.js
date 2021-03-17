const jwt = require('jsonwebtoken');
const router = require('express').Router();


router.post('/', async (req, res, next) => {

    const req_token = req.headers['auth-token'];

    console.log('@req-token', req_token);

    if (!req_token) return res.status(401).send('Access Denied');

    jwt.verify(req_token, 'secret', (err, token) => {

        console.log('@err - jwt', err);

        if (err) return res.status(401).send('Access Denied');
        else {
            console.log('@jwt - token', token);
            req.user = token.id;

            if (req.baseUrl === '/verify') {
                return res.status(200).end();
            } else {
                next();
            }


        }
    })
});
module.exports = router;

