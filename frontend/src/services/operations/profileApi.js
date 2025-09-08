import { toast } from "react-hot-toast"

// import { setLoading, setUser } from "../../slice/profileSlice"
import { apiConnector } from "../apiConnector"
import { profileEndpoints } from "../api2"
import { setUser } from "../../redux/Slices/AuthSlice"



const { GET_USER_PROFILE_API } = profileEndpoints



// export function getUserDetails(token, navigate) {
//   return async (dispatch) => {
//     const toastId = toast.loading("Loading...")
//     dispatch(setLoading(true))
//     try {
//       const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
//         Authorisation: `Bearer ${token}`,
//       })
//       console.log("GET_USER_DETAILS API RESPONSE............", response)

//       if (!response.data.success) {
//         throw new Error(response.data.message)
//       }
//       const userImage = response.data.data.image
//         ? response.data.data.image
//         : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
//       dispatch(setUser({ ...response.data.data, image: userImage }))
//     } catch (error) {
//       dispatch(logout(navigate))
//       console.log("GET_USER_DETAILS API ERROR............", error)
//       toast.error("Could Not Get User Details")
//     }
//     toast.dismiss(toastId)
//     dispatch(setLoading(false))
//   }
// }

export const getProfile = async(setFormData,token)=>{
    try {
        const response = await apiConnector("GET",GET_USER_PROFILE_API,null,
            {
                Authorization: `Bearer ${token}`,
            });
        console.log(response.data.data);
      setUser(response.data.data);
      setFormData({
        name: response.data.data.name || '',
        email: response.data.data.email || '',
        phone: response.data.data.phone || '',
        address: {
          street: response.data.data.address?.street || '',
          city: response.data.data.address?.city || '',
          state: response.data.data.address?.state || '',
          zipCode: response.data.data.address?.zipCode || '',
          country: response.data.data.address?.country || ''
        }
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } 
}


export const updateProfile = async(profileData,setFormData,token)=>{
    try {
        // const body=JSON.stringify(profileData)
        console.log(profileData);
        const response=await apiConnector("PUT",GET_USER_PROFILE_API,
            profileData,
            {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            }

        );
        setFormData({
            name: response.data.data.name || '',
            email: response.data.data.email || '',
            phone: response.data.data.phone || '',
            address: {
                street: response.data.address?.street || '',
                city: response.data.address?.city || '',
                state: response.data.address?.state || '',
                zipCode: response.data.address?.zipCode || '',
                country: response.data.address?.country || ''
            }
        });
        toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } 
}
