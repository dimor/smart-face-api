const express = require ('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')



process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl:true
  }
});


app.use(express.json());
app.use(cors());


///////////////////////////GET ///////////////////////////////
app.get('/',(req,res)=>{
  res.json('its Working');

})

///////////////////////SIGNIN////////////////////////////////////////////////
app.post('/signin',(req,res)=>{signin.handleSignIn(req,res,db,bcrypt)});
/////////////////////REGISTER////////////////////////////////////////////////
app.post('/register',(req,res)=>{register.handleRegister(req,res,db,bcrypt)});
///////////////////////PROFILE GET//////////////////////////////
app.get('/profile/:id',(req,res)=>{profile.handleProfile(req,res,db)});
////////////////////////PROFILE UPDATE ////////////////////////////////
app.put('/image',(req,res)=>{image.handleImage(req,res,db)});
////////////////////////////////////////////////////////////////////
app.post('/imageUrl',(req,res)=>{image.handleApiCall(req,res)});




app.listen(process.env.PORT||3000,()=>{

    console.log(`the server is runnign at port ${process.env.PORT} :)`);

})
