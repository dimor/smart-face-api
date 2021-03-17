const db = require('../db');




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