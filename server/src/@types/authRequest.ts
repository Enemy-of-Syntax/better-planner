import { Request } from 'express';

export interface IauthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}
