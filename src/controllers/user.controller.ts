import { Response, Request } from "express";
import { UserService } from "../services/user.services";

import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { createToken } from "../middleware/auth.middleware";
import { User } from "../models/users.model";
import { CommonError } from "../models/error.model";
const userService = new UserService();

/**
 * 获取用户列表
 */
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  if (!users) {
    res.status(500);
    throw new Error("用户列表为空");
  }
  res.status(200).json(users);
});

/**
 * 创建新用户
 */
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  // 判断是否已有此用户
  const userExist: User = await userService.getUserByName(req.body.name);
  console.log(userExist);
  if (userExist) {
    console.log("ddd");
    res.status(400);
    throw new CommonError("该用户已存在");
  }
  const hashCode = await bcrypt.hash(req.body.password, 10);
  const user: User = {
    name: req.body.name,
    address: req.body.address,
    description: req.body.description,
    password: hashCode,
  };
  const newUser = await userService.create(user);
  res.status(200).json(newUser);
});
/**
 * 获取指定用户信息
 */
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  console.log(req.params.id);
  const user = await userService.getUser(req.params.id);
  console.log(user);
  if (!user) {
    res.status(404);
    throw new CommonError("该用户不存在");
  }
  res.status(200).json(user);
});

/**
 * 删除用户
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userExist: User = await userService.getUser(req.params.id);
  if (!userExist) {
    res.status(404);
    throw new CommonError("该用户不存在");
  }
  await userService.delete(req.params.id);
  res.status(200).json({ id: req.params.id });
});

/**
 * 更新用户
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userExist: User = await userService.getUser(req.params.id);
  if (!userExist) {
    res.status(404);
    throw new CommonError("该用户不存在");
  }
  const updated = await userService.update(req.params.id, req.body);
  res.status(200).json(updated);
});
/**
 * 用户登录
 */
export const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { name, password } = req.body;

  const userExist: User = await userService.getUserByName(name);

  const passwordIsCorrect = await bcrypt.compare(password, userExist.password);
  if (userExist) {
    if (passwordIsCorrect) {
      const jwtPayloadData: User = {
        name: userExist.name,
        address: userExist.address,
        description: userExist.description,
        password: "",
      };

      res.json({
        token: createToken(jwtPayloadData),
      });
    } else {
      res.status(400).json({ message: "密码错误" });
    }
  } else {
    res.status(404);
    throw new CommonError("该用户不存在");
  }
});
