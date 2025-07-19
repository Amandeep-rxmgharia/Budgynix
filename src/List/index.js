import { configureStore } from "@reduxjs/toolkit";
import { expenseApi } from "../../apiSlice";

export const List = configureStore({
    reducer: {
        [expenseApi.reducerPath] : expenseApi.reducer
    },
    middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    expenseApi.middleware,
  ],

})

