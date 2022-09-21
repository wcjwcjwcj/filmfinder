import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import './index.css';

import {
  hideSignIn,
  showSignUp,
  setUserMsg,
  showForgetPassword,
} from '../../store';
import { login } from '../../service';

export default function SignIn() {
  const dispatch = useDispatch();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = () => {
    login(userName, password).then((res) => {
      dispatch(
        setUserMsg({
          isAdmin: res.data.data.adminaccess === 'Y',
          userName: res.data.data.username,
        }),
      );
      dispatch(hideSignIn());
      setTimeout(() => {
        window.location.reload();
      }, 50);
    });
  };

  return (
    <div className="sign-in-wrap">
      <div className="sign-in">
        <div className="sign-in__wrap">
          <div>User name</div>
          <div className="sign-in__username">
            <input
              onChange={(e) => setUserName(e.target.value)}
              type="text"
            ></input>
          </div>
          <div className="sign-in__password-text">Password</div>
          <div className="sign-in__password">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            ></input>
          </div>
          <div onClick={handleLogin} className="sign-in__button">
            SIGN IN
          </div>
          <div className="sign-in__create">
            Do not have an account? Let's
            <span
              onClick={() => {
                dispatch(hideSignIn());
                dispatch(showSignUp());
              }}
              className="sign-in__orange"
            >
              {' '}
              Create an Account!
            </span>
          </div>
          <div
            onClick={() => {
              dispatch(hideSignIn());
              dispatch(showForgetPassword());
            }}
            className="sign-in__create"
          >
            Forget your password?
          </div>
        </div>
        {/* <div
          onClick={() => {
            dispatch(hideSignIn());
          }}
          className="sign-in__close"
        ></div> */}
      </div>
    </div>
  );
}
