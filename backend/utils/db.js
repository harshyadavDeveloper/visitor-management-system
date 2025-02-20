const mongoose = require('mongoose');

const chalk = require('chalk');
const URL = "mongodb+srv://newVisitor:eukZDOEeREFSVkmN@version1.nfho4.mongodb.net/?retryWrites=true&w=majority&appName=Version1";

const connectDb = async() => {
    try {
        await mongoose.connect(URL, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4  // Force IPv4
        });
        console.log(chalk.green.bold("Connection to DB was successful😊😊😊"));
    } catch (error) {
        console.error(chalk.red.bold("Database connection failed🥲:", error.message));
        // Also log the full error object
        console.error("Full error:", error);
        process.exit(1);
    }
};

module.exports = connectDb; 