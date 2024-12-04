export interface ILoginInput {
  email: string;
  password: string;
}

export interface ISignupInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
}

export interface IErrorResponse {
  error: {
    status: number;
    data: {
      message: string;
      error: string;
      statusCode: number;
    };
  }
}

// TODO:
// - fix the error typing error
// - create auth context
// - store token in context
// - pass token in all api requests that need it
