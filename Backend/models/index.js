const mongoose = require("mongoose");
const uri = "mongodb+srv://dantilinca03:SSl8H5HNOqJFKstH@cluster0.1lnh2xn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };