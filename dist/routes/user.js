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
//import Users from "../models/users.model";
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("../models/user.model"));
const userRoute = (0, express_1.default)();
userRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield user_model_1.default.findAll(); // paranoid : false,
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
// for searching functionality and Individual query
userRoute.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, params } = req;
        let condition = !isNaN(Number(query.q))
            ? {
                [sequelize_1.Op.or]: {
                    id: query.q,
                    firstName: { [sequelize_1.Op.iLike]: `%${query.q}%` },
                    middleName: { [sequelize_1.Op.iLike]: `%${query.q}%` },
                    lastName: { [sequelize_1.Op.iLike]: `%${query.q}%` },
                    email: { [sequelize_1.Op.iLike]: `%${query.q}%` },
                },
            }
            : {
                [sequelize_1.Op.or]: {
                    firstName: { [sequelize_1.Op.iLike]: `%${query.q}%` },
                    middleName: { [sequelize_1.Op.iLike]: `%${query.q}%` },
                    lastName: { [sequelize_1.Op.iLike]: `%${query.q}%` },
                    email: { [sequelize_1.Op.iLike]: `%${query.q}%` },
                },
            };
        const response = yield user_model_1.default.findAll({ where: condition });
        res.status(200).json(response);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//get the counts
userRoute.get("/count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield user_model_1.default.findAndCountAll(); // paranoid : false,
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
userRoute.get("/counttoday", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const tomorrowStart = new Date();
        tomorrowStart.setDate(todayStart.getDate() + 1);
        tomorrowStart.setHours(0, 0, 0, 0);
        const response = yield user_model_1.default.findAndCountAll({
            where: {
                createdAt: {
                    [sequelize_1.Op.gte]: todayStart,
                    [sequelize_1.Op.lt]: tomorrowStart
                }
            },
        }); // paranoid : false,
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
userRoute.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params } = req;
        const response = yield user_model_1.default.findByPk(params.id); // paranoid : false,
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
userRoute.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
userRoute.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body, params } = req;
        const response = yield user_model_1.default.update(body, { where: params });
        if (response[0] == 1) {
            res
                .status(200)
                .json({ message: "Updated Successfully", process: "success" });
        }
        else {
            res.status(200).json({ message: "Transaction Failed", process: "error" });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
userRoute.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params } = req;
        const response = yield user_model_1.default.destroy({ where: params });
        if (response) {
            res
                .status(200)
                .json({ message: "Delete Successfully", process: "success" });
        }
        else {
            res.status(200).json({ message: "Transaction Failed", process: "error" });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
exports.default = userRoute;
//# sourceMappingURL=user.js.map