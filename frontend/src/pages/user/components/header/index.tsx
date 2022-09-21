import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Popover } from 'antd';
import './index.css';

import logo from '../../../../images/logo.jpg';

import { StateType, showSignOut, clearUserMsg } from '../../../../store';
import { signout } from '../../../../service';

export default function Header() {
  const username = useSelector<StateType, string>((state) => state.userName);

  const dispatch = useDispatch();

  return (
    <div className="header">
      <img className="header-logo" src={logo} alt=""></img>
      <div className="header-discover">DISCOVER</div>
      <div className="header-wish">MY WISHLIST</div>
      <Popover
        content={
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            onClick={() => {
              signout().then((res) => {
                if (res.data.code === 0) {
                  dispatch(clearUserMsg());
                  dispatch(showSignOut());
                }
              });
            }}
          >
            SignOut
          </a>
        }
        trigger="click"
      >
        <div className="header-avator">{username}</div>
      </Popover>
    </div>
  );
}
