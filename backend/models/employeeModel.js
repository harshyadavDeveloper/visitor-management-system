const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const employee = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false 

    }


});
employee.methods.generateToken = async function(){
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email:this.email,
            isAdmin: this.isAdmin,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn:'30d'
        }
      );
        
    } catch (error) {
        console.error("Error while generating token", error);
        // return null;
        
    }
}
employee.methods.comparePassword = async function(password){
    try {
      const isMatch = await bcrypt.compare(password, this.password);
      return isMatch;
    } catch (error) {
      console.error("Error while comparing passwords", error);
      return false;
    }
  }
const Employee = new mongoose.model("Employee", employee);

module.exports = Employee;