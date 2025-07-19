import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001" }),
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: () => "/expenses",
      transformResponse: (expenses) => {
        const autopayExpenses =  expenses.filter((eachExpense) => {
          return eachExpense.nextDueDate
        }).reverse()
        const normalExpenses = expenses.filter((eachExpense) => {
          return !eachExpense.nextDueDate
        }).reverse()
        return [...autopayExpenses,...normalExpenses]
      }
    }),
    addExpense: builder.mutation({
      query: (newExpense) => ({
        url: "/expenses",
        method: "POST",
        body: newExpense,
      }),
    }),
    deleteExpense: builder.mutation({
        query: (id) => ({
          url: `/expenses/${id}`,
          method: "DELETE"
        }),
      }),
       updateExpense: builder.mutation({
        query: ({ id, ...data }) => ({
          url: `expenses/${id}`,
          method: "PATCH",
          body: data,
        }),
      }),
  }),
});
export const {
  useGetExpensesQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation
} = expenseApi;
