import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import postReducer from './Post'
export const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
  },
})
