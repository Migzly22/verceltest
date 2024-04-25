import express, { Express, Response, Request } from "express";
//import Users from "../models/users.model";
import { Op } from "sequelize";
import Users from "../models/user.model";

const userRoute: Express = express();

userRoute.get("/", async (req: Request, res: Response) => {
  try {
    const response = await Users.findAll(); // paranoid : false,
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});
// for searching functionality and Individual query
userRoute.get("/search", async (req: Request, res: Response) => {
  try {
    const { query, params } = req;

    let condition = !isNaN(Number(query.q))
      ? {
          [Op.or]: {
            id: query.q,
            firstName: { [Op.iLike]: `%${query.q}%` },
            middleName: { [Op.iLike]: `%${query.q}%` },
            lastName: { [Op.iLike]: `%${query.q}%` },
            email: { [Op.iLike]: `%${query.q}%` },
          },
        }
      : {
          [Op.or]: {
            firstName: { [Op.iLike]: `%${query.q}%` },
            middleName: { [Op.iLike]: `%${query.q}%` },
            lastName: { [Op.iLike]: `%${query.q}%` },
            email: { [Op.iLike]: `%${query.q}%` },
          },
        };

    const response = await Users.findAll({ where: condition });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get the counts
userRoute.get("/count", async (req: Request, res: Response) => {
  try {
    const response = await Users.findAndCountAll(); // paranoid : false,
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});
userRoute.get("/counttoday", async (req: Request, res: Response) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const tomorrowStart = new Date();
    tomorrowStart.setDate(todayStart.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0);
    const response = await Users.findAndCountAll({
      where: {
        createdAt: {
            [Op.gte]: todayStart,
            [Op.lt]: tomorrowStart
        }
      },
    }); // paranoid : false,
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

userRoute.get("/:id", async (req: Request, res: Response) => {
  try {
    const { params } = req;
    const response = await Users.findByPk(params.id); // paranoid : false,
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

userRoute.post("/", async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const response = await Users.create(body);
    res.status(200).json(response);
  } catch (error: any) {
    const errormessages = error.errors.map((errdata: any) => {
      return errdata.message;
    });
    res.status(500).json(error);
  }
});

userRoute.put("/:id", async (req: Request, res: Response) => {
  try {
    const { body, params } = req;
    const response = await Users.update(body, { where: params });
    if (response[0] == 1) {
      res
        .status(200)
        .json({ message: "Updated Successfully", process: "success" });
    } else {
      res.status(200).json({ message: "Transaction Failed", process: "error" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

userRoute.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { params } = req;
    const response = await Users.destroy({ where: params });
    if(response){
      res
        .status(200)
        .json({ message: "Delete Successfully", process: "success" });
    } else {
      res.status(200).json({ message: "Transaction Failed", process: "error" });
    } 
    
  } catch (error) {
    res.status(500).json(error);
  }
});

export default userRoute;
