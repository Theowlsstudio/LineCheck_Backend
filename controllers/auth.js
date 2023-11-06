const User = require("../models/User");
const Bar = require("../models/Bar");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../configurations");

const SignUp = async (req, res) => {

    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        let hash = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            username,
            email,
            password: hash,
            role
        });

        let token = jwt.sign({ _id: newUser._id }, JWT_SECRET);

        return res.status(201).json({
            message: 'User registered successfully', token, user: {
                username: newUser.username,
                email: newUser.email,
                number: newUser.number,
                role_type: newUser.role
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Duplicate key error' });
        }

        return res.status(500).json({ error: 'Internal Server Error', details: error.message });

    }
};

const Login = async (req, res) => {
    try {

        const { email, password } = req.body;

        let user = await User.findOne({ email })

        if (user) {

            let matchpassword = await bcrypt.compare(password, user.password);
            if (!matchpassword) {
                return res.status(400).json({ msg: "Bad request, credentails didn't matched!" })
            };

            let token = jwt.sign({ _id: user._id }, JWT_SECRET);

            return res.status(200).json({
                msg: "Login successfull", token, user: {
                    username: user.username,
                    email: user.email,
                    number: user.number,
                    role_type: user.role,
                    id: user._id
                }
            })
        }


        let bar_user = await Bar.findOne({ email })

        if (bar_user) {

            let matchpassword = await bcrypt.compare(password, bar_user.password);

            if (!matchpassword) {
                return res.status(400).json({ msg: "Bad request, credentails didn't matched!" })
            };

            let token = jwt.sign({ _id: bar_user._id }, JWT_SECRET);

            return res.status(200).json({
                msg: "Login successfull", token, user: {
                    firstname: bar_user.firstname,
                    email: bar_user.email,
                    number: bar_user.number,
                    role_type: bar_user.role,
                    id: bar_user._id,
                    description: bar_user.description,
                    rating: bar_user.rating
                }
            })
        }

        return res.status(400).json({msg:"Bad request, No use exists with this email."})

    } catch (error) {
        return res.status(error?.statusCode ?? 500).json({ msg: error?.message ?? 'internal server error' })
    }
};

module.exports = {
    SignUp,
    Login
}





