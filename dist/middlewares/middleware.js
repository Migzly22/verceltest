"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
class RouterMiddleware {
    static routerMiddleware(req, res, next) {
        try {
            const bearerToken = (req.headers.authorization || "").split(" ");
            if (bearerToken.length && bearerToken[0] == "Bearer") {
                const secretKey = process.env.SECRET_KEY;
                jsonwebtoken_1.default.verify(bearerToken[1], secretKey, (err, decoded) => {
                    if (err) {
                        return res.status(401).json({ message: "Invalid token" });
                    }
                    else {
                        return next();
                    }
                });
            }
            else {
                return res.status(401).json({ message: "Invalid token" });
            }
        }
        catch (error) {
            res.status(500).json(error);
        }
    }
}
exports.default = RouterMiddleware;
//# sourceMappingURL=middleware.js.map