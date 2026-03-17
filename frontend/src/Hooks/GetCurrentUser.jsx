import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setUser } from "../redux/userSlice"

function GetCurrentUser() {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          "http://localhost:5000/api/user/getcurrentuser",
          { withCredentials: true }
        )

        dispatch(setUser(result.data.user))
      } catch (error) {
        console.log(error)
      }
    }

    fetchUser()
  }, [dispatch,])

  return null
}

export default GetCurrentUser
