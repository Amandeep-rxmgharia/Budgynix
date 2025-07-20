import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://budgynix-api.onrender.com" }),
  tagTypes: ["Expense"],
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
      },
      providesTags: ["expenses"]
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
        providesTags: ["expenses"]
      }),
       updateExpense: builder.mutation({
        query: ({ id, ...data }) => ({
          url: `expenses/${id}`,
          method: "PATCH",
          body: data,
        }),
        providesTags: ["expenses"]
      }),
  }),
});
export const {
  useGetExpensesQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation
} = expenseApi;
