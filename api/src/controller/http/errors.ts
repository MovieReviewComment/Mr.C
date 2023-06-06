export class CustomError extends Error {
  constructor(
    public type: NotFoundErrorType | InternalErrorType,
    public message: string
  ) {
    super(message);
  }
}

export enum NotFoundErrorType {
  ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  COMMENT_NOT_FOUND = 'COMMENT_NOT_FOUND',
  REVIEW_NOT_FOUND = 'REVIEW_NOT_FOUND',
  REPLY_NOT_FOUND = 'REPLY_NOT_FOUND'
}

export enum InternalErrorType {
  UNEXPECTED = 'UNEXPECTED'
}
