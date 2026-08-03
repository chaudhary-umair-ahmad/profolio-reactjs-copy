import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAPIBaseURL, getClassifiedBaseURL } from '../utility/env';



export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getAPIBaseURL(),
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({ url: 'auth/login', method: 'POST', body: { email: body.email, pass: body.password } }),
      transformErrorResponse: (response) => response?.data?.errors?.[0],
    }),
    logout: builder.mutation({
      query: (body) => ({ url: '/authentication/logout', method: 'POST', body }),
    }),
    logoutStrat: builder.mutation({
      query: (body) => ({ url: `${getClassifiedBaseURL()}/api/logout`, method: 'POST', body }),
    }),

  }),
});

export const { useLoginMutation, useLogoutMutation, useLogoutStratMutation } = authApi;

export default authApi;
