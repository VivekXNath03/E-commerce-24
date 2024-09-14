import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../utils/authHelper.js";
import JWT from "jsonwebtoken";


export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address ,answer} = req.body;
    
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      answer,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        adddress: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};


//forgot password

export const forgotPasswordController = async (req, res) => {
  try {
    const {email,answer , newPassword} = req.body;

    if(!email){
      return res.status(400).send({
        success:false,
        message:"Email is Required"
      });
    }

    if(!question){
      return res.status(400).send({
        success:false,
        message:"Question is Required"
      });
    }
    
    if(!newPassword){
      return res.status(400).send({
        success:false,
        message:"New Password is Required"
      });
    }

    const user = await userModel.findOne({email , answer});
    if(!user)({
      success:false,
      message:"Invalid Email or Answer"
    });
    
    const hashedPassword = await hashPassword(newPassword);

    await userModel.findByIdAndUpdate(user._id , {password:hashedPassword});

    res.status(200).send({
      success:true,
      message:"Password Reset Successfully"
    });



  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in forgot password",
      error,
    })
  }
};