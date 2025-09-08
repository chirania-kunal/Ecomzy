import { toast } from "react-hot-toast"

import { setLoading, setToken,setUser } from "../../redux/Slices/AuthSlice"
import { resetCart } from "../../redux/Slices/CartSlice"
import { apiConnector } from "../apiConnector"
import {  wishlistEndpoints } from "../api2"
import { useSelector } from "react-redux"

const {
    CHECK_WISHLIST_API,
    GET_WISHLIST_API,
    GET_WISHLIST_COUNT_API
} = wishlistEndpoints




export const checkWishlist = async (post,token,setIsInWishlist) => {
    try {
        const endpoint=`${CHECK_WISHLIST_API}/${post._id}`;
        const response = await apiConnector("GET",endpoint,
                null, 
                {
                    Authorization: `Bearer ${token}`,
                });
        setIsInWishlist(response.inWishlist);
    } catch (error) {
        console.error('Error checking wishlist status:', error);
    }
};


export const getWishlist = async(setWishlist,token)=>{
    try {
        const response = await apiConnector("GET",GET_WISHLIST_API,
                null, 
                {
                    Authorization: `Bearer ${token}`,
                }
        );
        console.log(response.data.data);
        setWishlist(response.data.data || []);
    } catch (error) {
        toast.error('Failed to load wishlist');
    } finally {
        setLoading(false);
    }
}


export const getWishlistCount = async(setWishlistCount,token) =>{
    try {
        const response = await apiConnector("GET",GET_WISHLIST_COUNT_API,null,
            {
                Authorization: `Bearer ${token}`,                
            }
        );
        if (response.success) {
        setWishlistCount(response.count);
        }
    } catch (error) {
        console.error('Error fetching wishlist count:', error);
    }
}

