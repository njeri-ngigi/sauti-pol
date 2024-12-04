import { IAuthResponse, ILoginInput, ISignupInput } from "@/store/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:3000/api/v1/";

export const electionsApi = createApi({
  reducerPath: "polineApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: 'include', mode: 'cors' }),
  endpoints: (builder) => ({
    login: builder.mutation<IAuthResponse, ILoginInput>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body
      }),
    }),
    signup: builder.mutation<IAuthResponse, ISignupInput>({
      query: (body) => ({
        url: "auth/signup",
        method: "POST",
        body
      }),
    }),
    refreshToken: builder.mutation<IAuthResponse, void>({
      query: () => ({
        url: "auth/refresh",
        method: "POST",
      }),
    }),
  })
});

export const { useLoginMutation, useSignupMutation, useRefreshTokenMutation } = electionsApi;

