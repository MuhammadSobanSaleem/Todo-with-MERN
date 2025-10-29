const mongoose = require('mongoose')

async function connectDB(){
    try{

        const connection = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log(`Database Connected Successfully`)

    }catch(err){

        console.log(`Database Connection Error : ${err.message}`)

    }

}

module.exports = {
    connectDB
}