import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';

import './App.css';
import 'antd/dist/antd.min.css';

import store from './store';

import SignIn from './components/sign-in';
import SignUp from './components/sign-up';
import SignOut from './components/sign-out';
import PrivacyPolicy from './components/privacy-policy';
import ForgetPassword from './components/forget-password';

import User from './pages/user';
import Admin from './pages/admin';
import Tourists from './pages/tourists';

function App() {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="app">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/user" replace={true} />}
            ></Route>
            <Route path="/user" element={<User />}></Route>
            <Route path="/admin" element={<Admin />}></Route>
            <Route path="/tourists" element={<Tourists />}></Route>
          </Routes>
        </BrowserRouter>
        {state.signInPage && <SignIn></SignIn>}
        {state.signOutPage && <SignOut></SignOut>}
        {state.signUpPage && <SignUp></SignUp>}
        {state.privacyPolicyPage && <PrivacyPolicy></PrivacyPolicy>}
        {state.forgetPasswordPage && <ForgetPassword></ForgetPassword>}
      </Provider>
    </div>
  );
}

export default App;
