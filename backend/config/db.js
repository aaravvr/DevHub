const mongoose = require('mongoose')

// DB Connection 
const connectDB = async () => {
    try {
        if (process.env.NODE_ENV === 'test') return; // skip if testing
        
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = {
    connectDB
}