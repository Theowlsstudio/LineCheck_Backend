const { config } = require("dotenv");

config();

const configurations = {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    url:'https://phpstack-1080450-3997134.cloudwaysapps.com/'
};

module.exports = configurations;