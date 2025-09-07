import { toast } from "react-hot-toast"

import { setLoading, setToken,setUser } from "../../redux/Slices/AuthSlice"
import { resetCart } from "../../redux/Slices/CartSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../api2"

const {
//   SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
//   RESETPASSTOKEN_API,
//   RESETPASSWORD_API,
} = endpoints


export function signUp(
  formData,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API,formData)

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      dispatch(setToken(response.data.token))
      const userImage = response.data?.user?.avatar
        ? response.data.user.avatar
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user, image: userImage }))
      // console.log("User data: ",response.data.user)
      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("user",JSON.stringify(response.data.user));
      navigate("/")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/register")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(formData, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, formData)

      console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")
      dispatch(setToken(response.data.token))
      const userImage = response.data?.user?.avatar
        ? response.data.user.avatar
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user, image: userImage }))
      // console.log("User data: ",response.data.user)
      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("user",JSON.stringify(response.data.user));
      navigate("/")
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error("Login Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

// export function getPasswordResetToken(email, setEmailSent) {
//   return async (dispatch) => {
//     const toastId = toast.loading("Loading...")
//     dispatch(setLoading(true));
//     try {
//       const response = await apiConnector("POST", RESETPASSTOKEN_API, {
//         email,
//       })

//       console.log("RESETPASSTOKEN RESPONSE............", response)

//       if (!response.data.success) {
//         throw new Error(response.data.message)
//       }

//       toast.success("Reset Email Sent")
//       setEmailSent(true)
//     } catch (error) {
//       console.log("RESETPASSTOKEN ERROR............", error)
//       toast.error("Failed To Send Reset Email")
//     }
//     toast.dismiss(toastId)
//     dispatch(setLoading(false))
//   }
// }

// export function resetPassword(password, confirmPassword, token) {
//   return async (dispatch) => {
//     const toastId = toast.loading("Loading...")
//     dispatch(setLoading(true))
//     try {
//       const response = await apiConnector("POST", RESETPASSWORD_API, {
//         password,
//         confirmPassword,
//         token,
//       })

//       console.log("RESETPASSWORD RESPONSE............", response)

//       if (!response.data.success) {
//         throw new Error(response.data.message)
//       }

//       toast.success("Password Reset Successfully");
//       // navigate("/login")
//     } catch (error) {
//       console.log("RESET PASSWORD ERROR............", error)
//       toast.error("Failed To Reset Password")
//     }
//     toast.dismiss(toastId)
//     dispatch(setLoading(false))
//   }
// }

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}