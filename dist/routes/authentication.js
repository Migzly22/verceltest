"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
const authRoute = (0, express_1.default)();
authRoute.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        const condition = {
            [sequelize_1.Op.and]: [
                { email: body.email },
                { password: user_model_1.default.generateMD5(body.password) }
            ]
        };
        const response = yield user_model_1.default.findOne({ where: condition }); // paranoid : false,
        if (response) {
            const jsondata = {
                id: response.id,
                name: `${response.firstName} ${response.lastName}`,
                account: response.account,
            };
            const secretkey = process.env.SECRET_KEY;
            const token = jsonwebtoken_1.default.sign(jsondata, secretkey);
            res.status(200).json({ token: token, data: jsondata });
        }
        else {
            // Send 401 status code if credentials are incorrect
            res.status(401).json({ error: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//check if the email exist
authRoute.post("/checkemail", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        const response = yield user_model_1.default.findAndCountAll({ where: { email: body.email } }); // paranoid : false,
        if (response.count > 0) {
            const message = yield main(body.token, body.email);
            res.status(200).json({ message: message });
        }
        else {
            res.status(403).json({ message: "Failed" });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
authRoute.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        const response = yield user_model_1.default.update(body, { where: { email: body.email } }); // paranoid : false,
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
authRoute.post("/adduser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        const response = yield user_model_1.default.create(body);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
const transporter = nodemailer_1.default.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "noncre123@gmail.com",
        pass: "ywlewgcdbwiyrpvb",
    },
});
function main(otpcode_1) {
    return __awaiter(this, arguments, void 0, function* (otpcode, targetuser = "noncre123@gmail.com") {
        try {
            // Send mail with defined transport object
            const info = yield transporter.sendMail({
                from: '"Cinnamon Rols" <cinnamon@gmail.email>', // sender address
                to: `${targetuser}`, // list of receivers
                subject: "Recrea Forgotten Password", // Subject line
                html: `<b>Your OTP code is: ${otpcode}. Please use this code within 10 minutes as it will expire after that.</b>`, // html body
            });
            return "Success";
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        }
        catch (error) {
            return "Failed";
        }
    });
}
exports.default = authRoute;
//# sourceMappingURL=authentication.js.map