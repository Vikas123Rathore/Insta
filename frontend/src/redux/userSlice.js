import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  user: null,
  suggestedUsers: [],
  profileData: null,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload
    },
  },
})

export const { setUser, setSuggestedUsers, setProfileData } = userSlice.actions
export default userSlice.reducer
