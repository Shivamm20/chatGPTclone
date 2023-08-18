const errorHandler = require("../middlewares/errorMiddleware");
const userModel = require("../models/userModel");
const errorResponse = require("../utils/errorResponse");

// JWT TOKEN
exports.sendToken = (user, statusCode, res) => {
    try {
        const token = user.getSignedToken(res);
        console.log(token);
        res.status(statusCode).json({
            success: true,
            token: "hello",
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

//REGISTER
exports.registerContoller = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        //exisitng user
        const exisitingEmail = await userModel.findOne({ email });
        console.log(exisitingEmail);
        if (exisitingEmail) {
            return next(new errorResponse("Email is already register", 500));
        }
        const user = await userModel.create({ username, email, password });
        this.sendToken(user, 201, res);
        // res.status(200).send({ msg: "Registration Successful!" })
    } catch (error) {
        console.log(error);
        next(error);
    }
};

//LOGIN
exports.loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return next(new errorResponse("Please provide email or password"));
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return next(new errorResponse("Invalid Creditial", 401));
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return next(new errorResponse("Invalid Creditial", 401));
        }
        //res
        this.sendToken(user, 200, res);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

//LOGOUT
exports.logoutController = async (req, res) => {
    res.clearCookie("refreshToken");
    return res.status(200).json({
        success: true,
        message: "Logout Succesfully",
    });
};