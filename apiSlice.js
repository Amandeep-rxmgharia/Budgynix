import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://budgynix-api.onrender.com" }),
  tagTypes: ["expenses"],
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
      invalidatesTags: ["expenses"],
       async onQueryStarted(expense, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    expenseApi.util.updateQueryData('getExpenses', undefined, (expenseList) => {
                        const autopayExpenses = expenseList.filter((eachExpense) => {
                          return eachExpense.nextDueDate })
                          const normalExpenses = expenseList.filter((eachExpense) => {
                          return !eachExpense.nextDueDate })
                          expense.nextDueDate ? autopayExpenses.unshift(expense) : normalExpenses.unshift(expense)
                    })
                )
                try {
                    await queryFulfilled
                }
                catch {
                    patchResult.undo()
                }
            }
    }),
    deleteExpense: builder.mutation({
        query: (id) => ({
          url: `/expenses/${id}`,
          method: "DELETE"
        }),
        invalidatesTags: ["expenses"],
         async onQueryStarted(expense, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    expenseApi.util.updateQueryData('getExpenses', undefined, (expenseList) => {
                        const expenseIndex = expenseList.findIndex((el) => el.id == expense.id)
                        expenseList.splice(expenseIndex, 1)
                    })
                )
                try {
                    await queryFulfilled
                }
                catch {
                    patchResult.undo()
                }
            }
      }),
       updateExpense: builder.mutation({
        query: ({ id, ...data }) => ({
          url: `expenses/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["expenses"],
         async onQueryStarted(expense, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    expenseApi.util.updateQueryData('getExpenses', undefined, (expenseList) => {
                        const expenseIndex = expenseList.findIndex((el) => el.id == expense.id)
                        expenseList[expenseIndex] = {...expenseList[expenseIndex],...expense}
                    })
                )
                try {
                    await queryFulfilled
                }
                catch {
                    patchResult.undo()
                }
            }
      }),
  }),
});
export const {
  useGetExpensesQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation
} = expenseApi;
