import { toast } from "react-hot-toast"

import { setLoading, setToken,setUser } from "../../redux/Slices/AuthSlice"
import { resetCart } from "../../redux/Slices/CartSlice"
import { apiConnector } from "../apiConnector"
import { endpoints, productEndpoints } from "../api2"

const {
    PRODUCT_CATEGORIES_API,
    GET_PRODUCT_FILTER_API,
} = productEndpoints

// export function getProductCategories(){
//     try {
//       const response = await apiService.getProductCategories();
//       if (response.success) {
//         setCategories(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
// }

// fetching the available course categories
export const getProductCategories = async (setCategories) => {
  try {
    const response = await apiConnector("GET", PRODUCT_CATEGORIES_API)
    console.log("PRODUCT_CATEGORIES_API API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Product Categories")
    }
    setCategories(response.data.data);
  } catch (error) {
    console.log("PRODUCT_CATEGORY_API API ERROR............", error)
    toast.error(error.message)
  }
  
}
export const getProducts = async (params = {},setProducts) => {
    try {
      console.log('jjjhdg');
      const queryString = new URLSearchParams(params).toString();
     const endpoint = `${GET_PRODUCT_FILTER_API}${queryString ? `?${queryString}` : ''}`;
     console.log('endpoint',endpoint)
      const response = await apiConnector("GET",endpoint);
      console.log("PRODUCT API RESPONSE............", response)
      if (response.data.success) {
        console.log(response.data.data);
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    }
  
}

