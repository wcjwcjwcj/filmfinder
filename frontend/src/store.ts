import { createSlice, configureStore } from '@reduxjs/toolkit'

const IS_ADMIN_STORAGE_KEY = 'is_admin'
const USER_NAME_STORAGE_KEY = 'username'

const mainSlice = createSlice({
  name: 'main',
  initialState: {
    isAdmin: localStorage.getItem(IS_ADMIN_STORAGE_KEY) === 'true',
    userName: localStorage.getItem(USER_NAME_STORAGE_KEY) || 'Not logged in',
    signInPage: false,
    signUpPage: false,
    signOutPage: false,
    privacyPolicyPage: false,
    forgetPasswordPage: false
  },
  reducers: {
    setUserMsg: (state, actions) => {
      const { payload } = actions;
      state.isAdmin = payload.isAdmin
      state.userName = payload.userName
      localStorage.setItem(IS_ADMIN_STORAGE_KEY, payload.isAdmin ? 'true' : 'false')
      localStorage.setItem(USER_NAME_STORAGE_KEY, payload.userName)
    },
    clearUserMsg: (state) => {
      state.isAdmin = false
      state.userName = 'Not logged in'
      localStorage.setItem(IS_ADMIN_STORAGE_KEY, 'false')
      localStorage.setItem(USER_NAME_STORAGE_KEY, 'Not logged in')
    },
    showSignIn: (state) => {
      state.signInPage = true
    },
    hideSignIn: (state) => {
      state.signInPage = false
    },
    showSignOut: (state) => {
      state.signOutPage = true
    },
    hideSignOut: (state) => {
      state.signOutPage = false
    },
    showSignUp: (state) => {
      state.signUpPage = true
    },
    hideSignUp: (state) => {
      state.signUpPage = false
    },
    showPrivacyPolicy: (state) => {
      state.privacyPolicyPage = true
    },
    hidePrivacyPolicy: (state) => {
      state.privacyPolicyPage = false
    },
    showForgetPassword: (state) => {
      state.forgetPasswordPage = true
    },
    hideForgetPassword: (state) => {
      state.forgetPasswordPage = false
    },
  }
})

export const {
  showSignIn,
  hideSignIn,
  showSignOut,
  hideSignOut,
  showSignUp,
  hideSignUp,
  setUserMsg,
  clearUserMsg,
  showPrivacyPolicy,
  hidePrivacyPolicy,
  showForgetPassword,
  hideForgetPassword
} = mainSlice.actions

const store = configureStore({
  reducer: mainSlice.reducer
})

export type StateType = ReturnType<typeof store.getState>

export default store;
