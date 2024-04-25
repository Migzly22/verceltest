"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const crypto = __importStar(require("crypto"));
dotenv_1.default.config();
class Users extends sequelize_1.Model {
    static associate() {
    }
    static generateMD5(input) {
        const hash = crypto.createHash('md5');
        hash.update(input);
        console.log(hash);
        return hash.digest('hex');
    }
}
Users.modelName = 'Users';
exports.default = Users;
let options = {
    sequelize: new sequelize_1.Sequelize(process.env.POSGRES_URL, {
        dialectModule: require('pg')
    }),
    tableName: Users.modelName,
    schema: 'public',
    paranoid: true
};
let fields = {
    id: {
        type: new sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    middleName: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    username: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    sex: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: "MALE"
    },
    phoneNumber: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    birthDate: {
        type: new sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    address: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: true,
        validate: {
            is: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i
        }
    },
    password: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: true,
        set(value) {
            this.setDataValue('password', Users.generateMD5(value));
        },
    },
    account: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: new sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    updatedAt: {
        type: new sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    deletedAt: {
        type: new sequelize_1.DataTypes.DATE,
        allowNull: true
    }
};
Users.init(fields, options);
//# sourceMappingURL=user.model.js.map