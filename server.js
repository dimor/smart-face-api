const express = require ('express');
const cors = require('cors');
const registerRoute = require('./routes/register')
const signInRoute = require('./routes/signin')
const imageRoute = require('./routes/image');
const verifyRoute =require('./routes/verifyToken')
const profileRoute = require('./routes/profile');


process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Route Middlewares

app.use('/signin',signInRoute);
app.use('/register',registerRoute);
app.use('/image',imageRoute)
app.use('/verify',verifyRoute)
app.post('/profile',profileRoute.getData);



app.listen(process.env.PORT||3000,()=>{

    console.log(`the server is runnign at port ${process.env.PORT} :)`);

})
