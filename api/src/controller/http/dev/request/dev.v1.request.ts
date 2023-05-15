import { Request } from 'express';

export type GreetingV1Request = Request & {
  message?: string;
};
