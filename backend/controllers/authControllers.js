const employeeModel = require("../models/employeeModel");

const home = async (req, res) => {
    try {
        res
            .status(200)
            .send(
                "login successful, welcome to the employee page"
            );
    } catch (error) {
        console.log(error);
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;

        // Check if employee already exists
        const employeeExists = await employeeModel.findOne({ email });
        if (employeeExists) {
            return res.status(400).send("Employee already exists");
        }

        // Create new employee
        const employeeCreated = await employeeModel.create({ name, email, password, isAdmin });

        // Generate token and send response
        const token = await employeeCreated.generateToken();
        res.status(201).json({
            message: "Registration Successful",
            token,
            userId: employeeCreated._id.toString(),
            role: employeeCreated.isAdmin ? 'Admin' : 'Employee',
        });
    } catch (error) {
        console.error("Error in register controller:", error);
        res.status(500).send("Server error");
    }
};


const login = async(req, res) => {
    try{
        const {email, password} = req.body;
        const employeeExists = await employeeModel.findOne({ email }); 
        if (!employeeExists) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await employeeExists.comparePassword(password);
        if(!isMatch){
            res.status(200).json({
              msg: "Login sucessfull. Welcome to the Visiting management system.",
              token: await employeeExists.generateToken(),
              userId: employeeExists._id.toString(),
              role: employeeExists.isAdmin,
            });
          } else{
            res.status(401).json({msg: "Invalid email or password" });
          }
    } catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
      }
    }
module.exports = { home, register, login };