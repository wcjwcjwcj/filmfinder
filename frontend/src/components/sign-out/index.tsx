import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './index.css';

import { hideSignOut, showSignIn } from '../../store';

export default function SignOut() {
  const dispatch = useDispatch();

  const [seconds, setSeconds] = useState(10);
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((now) => {
        if (now <= 0) {
          handleHideSignOut();
          return 0;
        } else {
          return now - 1;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHideSignOut = () => {
    dispatch(hideSignOut());
    dispatch(showSignIn());
  };

  return (
    <div className="sign-out-wrap">
      <div className="sign-out">
        <div className="sign-out__word">
          You have successfully signed out :)
        </div>
        <div className="sign-out__goodby">SEE YOU.</div>
        <div onClick={handleHideSignOut} className="sign-out__button">
          BYE（{seconds}s）
        </div>
        <div onClick={handleHideSignOut} className="sign-out__close"></div>
      </div>
    </div>
  );
}
