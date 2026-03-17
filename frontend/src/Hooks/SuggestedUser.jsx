import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'

import { setSuggestedUsers } from '../redux/userSlice'
function SuggestedUser() {
  const dispatch = useDispatch()
  const serverUrl = "http://localhost:5000"
  useEffect(() => {
    try {
      const fetchSuggestedUsers = async () => {
        const result = await axios.get(serverUrl + '/api/user/suggesteduser', {
          withCredentials: true,
        })
        if (result.status === 200) {
          dispatch(setSuggestedUsers(result.data.user))

        }
        console.log(result.data.user)

      }
      fetchSuggestedUsers()
    } catch (error) {
      console.log("Error fetching suggested users:", error)
    }
  }, [])
}
export default SuggestedUser
