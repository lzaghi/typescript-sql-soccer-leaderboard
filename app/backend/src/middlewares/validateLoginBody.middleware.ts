import { NextFunction, Request, Response } from 'express';

const validateLoginBody = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400)
      .send({ message: 'All fields must be filled' });
  }
  next();
};

export default validateLoginBody;
