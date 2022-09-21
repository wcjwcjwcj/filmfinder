import axios, { AxiosRequestConfig } from "axios";
import { message } from "antd";

import store, { showSignIn, clearUserMsg } from './store';

export const PREFIX = `http://${window.location.hostname}:5000`;
export const PICTURE_PREFIX = `http://${window.location.hostname}:3000/backend-images`

const errorHandler = (slience: boolean) => (e: any) => {
  if (e.response.status === 401) {
    store.dispatch(showSignIn());
    store.dispatch(clearUserMsg());
    !slience && message.error('You need login first');
  } else if (e.response.status === 403) {
    !slience && message.error('You are not an admin, permission denied');
  } else {
    !slience && message.error(e.message)
  }
  throw e
}

function get(url: string, config?: AxiosRequestConfig, slience = false) {
  return axios.get(`${PREFIX}${url}`, {
    withCredentials: true,
    ...config
  }).then((res) => {
    if (res.data.code === 0) {
      !slience && res.data.message && message.success(res.data.message)
    } else {
      !slience && res.data.message && message.error(res.data.message)
    }
    return res
  }).catch(errorHandler(slience))
}

function post(url: string, data?: any, config?: AxiosRequestConfig, slience = false) {
  return axios.post(`${PREFIX}${url}`, data, {
    withCredentials: true,
    ...config
  }).then((res) => {
    if (res.data.code === 0) {
      !slience && res.data.message && message.success(res.data.message)
    } else {
      !slience && res.data.message && message.error(res.data.message)
    }
    return res
  }).catch(errorHandler(slience))
}

// common
export function login(userName: string, password: string) {
  return get('/login', {
    params: {
      user_name: userName,
      password,
    }
  })
}
interface SignupProps {
  username: string;
  password: string;
  gender: 'F' | 'M' | '';
  birthday: string,
  genre_bias: string,
  email: string,
  security_question: string,
  security_answer: string,
}
export function signup(params: SignupProps) {
  return get('/signup', {
    params,
  })
}
export function signout() {
  return get('/logout')
}
interface ForgetPassParams {
  username: string,
  security_question: string,
  security_answer: string,
  new_password: string,
}
export function forgetPassword(params: ForgetPassParams) {
  return get('/forget_password', {
    params
  })
}
export function getSecurityQuestion(username: string) {
  return get('/get_security_question', {
    params: {
      username
    }
  })
}


// user
export function userSearch(keyword: string, slience = false) {
  return get('/user/search', {
    params: {
      keyword
    }
  }, slience)
}

export function userSearchByID(id: string) {
  return get('/user/search_by_id', {
    params: {
      id
    }
  }, true)
}

export function userSearchByWishlistID(wishlist_id: string, slience = false) {
  return get('/user/search_by_wishlist_id', {
    params: {
      wishlist_id
    }
  }, slience)
}

export function userAddReview(movie_id: string, review: string) {
  return get('/user/review', {
    params: {
      movie_id,
      review
    }
  })
}

export function userGetReview(movie_id: string) {
  return get('/user/get_review', {
    params: {
      movie_id
    }
  })
}

export function userUpdateReview(review_id: string, new_review: string) {
  return get('/user/update_review', {
    params: {
      review_id,
      new_review,
    }
  })
}

export function userDeleteReview(review_id: string) {
  return get('/user/delete_review', {
    params: {
      review_id,
    }
  })
}

export function userRate(movie_id: string, rating: number) {
  return get('/user/rate', {
    params: {
      movie_id,
      rating,
    }
  })
}

export function userGetRate(movie_id: string) {
  return get('/user/get_rate', {
    params: {
      movie_id,
    }
  })
}

export function userGetHostIP() {
  return get('/user/get_host_ip', {
    params: {}
  }, true)
}

export function userSearchWishlist(keyword: string, slience = false) {
  return get('/user/get_wishlist', {
    params: {
      keyword
    }
  }, slience)
}
interface Wishlist {
  wishlist_name: string
  public_or_not: 'Y' | 'N'
  user_to_share: string
  movie_list: string
  // 'wishlist_id':'wishlist id',
}
export function userCreateWishtlist(params: Wishlist) {
  return get('/user/create_wishlist', {
    params,
  })
}
export function userUpdateWishtlist(params: Wishlist & { 'wishlist_id': number }) {
  return get('/user/update_wishlist', {
    params,
  })
}
export function userDeleteWishtlist(wishlist_id: number) {
  return get('/user/delete_wishlist', {
    params: {
      wishlist_id
    },
  })
}
export function userExistWishlist(wishlist_id: number) {
  return get('/user/exist_wishlist', {
    params: {
      wishlist_id
    },
  })
}
export function userAddMovieToWishtlist(wishlist_id: number, movie_id: number) {
  return get('/user/add_movie_into_wishlist', {
    params: {
      wishlist_id,
      movie_id
    },
  })
}


// admin
export function adminSearch(keyword: string) {
  return get('/admin/search', {
    params: {
      keyword
    }
  })
}
interface UploadParams {
  movie_name: string;
  director: string;
  genre_list: string;
  country: string;
  synopsis: string;
  production_year: string;
  studio: string;
  cast_list: string;
  file: File;
}
export function adminUpload(data: UploadParams) {
  const formdata = new FormData();
  for (let key in data) {
    formdata.append(key, data[key as keyof UploadParams])
  }
  return post('/admin/import', formdata, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export function adminDelete(id: number) {
  return get('/admin/delete', {
    params: {
      id
    }
  })
}
export function adminUpdate(data: UploadParams & { id: number }) {
  const formdata = new FormData();
  for (let key in data) {
    formdata.append(key, data[key as keyof UploadParams])
  }
  return post('/admin/update', formdata, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}