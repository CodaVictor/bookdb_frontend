import { configureStore } from '@reduxjs/toolkit'
import loginReducer from "../features/login/loginSlice";
import bookReducer from "../features/book/bookSlice";
import authorSlice from "../features/author/authorSlice";
import reviewSlice from "../features/review/reviewSlice";

// Store je objekt tvořený stromem objektů, který ukládá všechny stav aplikace
const store = configureStore({
    reducer: {
        login: loginReducer,
        book: bookReducer,
        author: authorSlice,
        review: reviewSlice
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;