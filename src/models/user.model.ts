

import { DataTypes, InitOptions, ModelAttributes, Model, Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import * as crypto from 'crypto';
dotenv.config();

export default class Users extends Model{
    static readonly modelName:string = 'Users';

    declare id:number;
    declare firstName: string;
    declare middleName: string;
    declare lastName: string;
    declare username: string;
    declare sex : string;
    declare phoneNumber : string;
    declare birthDate : Date;
    declare address: string;
    declare city: string;
    declare email: string;
    declare password: string;
    declare account: string;

    static associate() {
      
    }
    static generateMD5(input: any): string {
        const hash = crypto.createHash('md5');
        hash.update(input);
        console.log(hash)
        return hash.digest('hex');
    }
}

let options: InitOptions = {
    sequelize: new Sequelize(process.env.POSGRES_URL!),
    tableName: Users.modelName,
    schema:'public',
    paranoid : true
}

let fields: ModelAttributes = {
    id: {
        type: new DataTypes.INTEGER,
        allowNull: false,
        primaryKey : true,
        autoIncrement : true
    },
    firstName: {
        type: new DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: new DataTypes.STRING,
        allowNull: true,
    },
    middleName: {
        type: new DataTypes.STRING,
        allowNull: true,
    },
    username: {
        type: new DataTypes.STRING,
        allowNull: true,
        unique : true
    },
    sex: {
        type: new DataTypes.STRING,
        allowNull: true,
        defaultValue : "MALE"
    },
    phoneNumber: {
        type: new DataTypes.STRING,
        allowNull: true,
    },
    birthDate: {
        type: new DataTypes.DATE,
        allowNull: true,
    },
    address: {
        type: new DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: new DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: new DataTypes.STRING,
        allowNull: true,
        validate : {
            is : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i
        }
    },
    password: {
        type: new DataTypes.STRING,
        allowNull: true,
        set(value) {
            this.setDataValue('password', Users.generateMD5(value));
        },
    },
    account: {
        type: new DataTypes.STRING,
        allowNull: true
    },

    createdAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
    updatedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    },
    deletedAt: {
        type: new DataTypes.DATE,
        allowNull: true
    }
}

Users.init(fields, options)
