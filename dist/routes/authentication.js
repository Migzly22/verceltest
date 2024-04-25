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
        const errormessages = error.errors.map((errdata) => {
            return errdata.message;
        });
        res.status(500).json(error);
    }
}));
exports.default = authRoute;
//# sourceMappingURL=authentication.js.map