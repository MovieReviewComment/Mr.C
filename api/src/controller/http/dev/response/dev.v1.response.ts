import { Response } from 'express';

export type GreetingV1Response = Response & {
  message?: string;
};
