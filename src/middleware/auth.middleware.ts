import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { User } from '../models/users.model';

const tokenSecret = String(process.env.TOKEN_SECRET);

export const createToken = (jwtPayloadData: User): string => {
  const options = {
    expiresIn: '30d',
    subject: 'access'
  };
  try {
    // eslint-disable-next-line no-var
    var token: string = jwt.sign(
      jwtPayloadData,
      String(process.env.TOKEN_SECRET),
      options
    );
    return token;
  } catch (err) {
    throw new Error(`get token   has  error: ${err}`);
  }
};

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authorisationHeader = String(req.headers.authorization);
    const jwtToken: string = authorisationHeader.split(' ')[1];
    const decoded = jwt.verify(jwtToken, tokenSecret);

    if (decoded) {
      next();
    }
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token!' });
  }
};
