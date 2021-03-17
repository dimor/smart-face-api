const { MODERATION_MODEL } = require('clarifai');
const { response } = require('express');
const db = require('../db');


const getData= async(req,res)=>{

    try{
        const [{rank}]  = await getProfileRank(req.body.id);
        const [{ user_faces, user_used }]  = await getProfileStats(req.body.id);
        return res.json({'user':{ user_faces, user_used,rank}});
    }catch(err){
        res.status(400).json();
    }


  



}


const getProfileStats=(id)=>{
    return db.select('user_faces', 'user_used').from('users').where('login_id','=',id).returning();
}


const getProfileRank= (id)=>{

   return db.select('rank')
      .from(db.select(db.raw('*,rank() over(order by user_faces desc) as rank from users')).as('temp'))
      .where({ 'login_id': id })
      .returning()


}

module.exports.getProfileStats = getProfileStats;
module.exports.getProfileRank = getProfileRank;
 module.exports.getData = getData;