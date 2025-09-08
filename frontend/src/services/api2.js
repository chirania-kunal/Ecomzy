const BASE_URL =process.env.REACT_APP_BASE_URL

// AUTH ENDPOINTS
export const endpoints = {
//   SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/register",
  LOGIN_API: BASE_URL + "/auth/login",
//   RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
//   RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_PROFILE_API: BASE_URL + "/users/profile",
  // GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
}

// PRODUCT ENDPOINTS
export const productEndpoints = {
  PRODUCT_CATEGORIES_API: BASE_URL + "/products/categories",
  GET_PRODUCTS_API: BASE_URL + "/products",
  GET_FEATURED_PRODUCTS: BASE_URL + "/products/featured"
}

// WISHLIST
export const wishlistEndpoints = {
  GET_WISHLIST_API: BASE_URL + "/wishlist",
  CHECK_WISHLIST_API: BASE_URL+ "/wishlist/check",
  GET_WISHLIST_COUNT_API: BASE_URL+ "/wishlist/count"
}

// ORDERS API
export const orders = {
  CREATE_ORDER_API: BASE_URL + "/orders",
  GET_MY_ORDER_API: BASE_URL + "/orders/myorders",
}


// PAYMENTS API
// export const payments = {
//   CREATE_PAYMENT_INTENT_API: BASE_URL + "/payments/create-payment-intent",
//   CONFIRM_PAYMENT_API: BASE_URL + "/payments/confirm",
//   GET_PAYMENT_METHODS:BASE_URL + "payments/methods"
// }

// // CONTACT-US API
// export const contactusEndpoint = {
//   CONTACT_US_API: BASE_URL + "/reach/contact",
// }

// // SETTINGS PAGE API
// export const settingsEndpoints = {
//   UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
//   UPDATE_PROFILE_API: BASE_URL + "/profile/updatedProfile",
//   CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
//   DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
// }