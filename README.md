

***

# [Api](https://github.com/dimor/smart-face-api/)



# **SMART FACE API **

a back end api for smart face app.

### Routes:
* /image - handle image face detection request and update stats.
* /profile - get user stats .
* /register -handle register request.
* /signin  - handle signin request.
* /verify - verify web tokens.

### Technologies:
The project was coded with NodeJs.

**libraries:**
* bcrypt - hash passwords.
* ExpressJS - web framework for nodejs.
* clarifai - clarifai api , for face recognition .
* knex - SQL Query Builder.
* jsonwebtoken - sign and verify web tokens.
* joi- data validation.

**Database**
* PostgreSQL
