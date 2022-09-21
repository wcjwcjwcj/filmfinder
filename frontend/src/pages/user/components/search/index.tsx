import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './index.css';

import { StateType } from '../../../../store';

interface SearchProps {
  onSearch: (keyword: string) => void;
}

export default function Search(props: SearchProps) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const { isAdmin } = useSelector<StateType, Pick<StateType, 'isAdmin'>>(
    (state) => ({
      isAdmin: state.isAdmin,
    }),
  );

  return (
    <div className="search">
      {isAdmin && (
        <div
          onClick={() => {
            navigate('/admin');
          }}
          className="search-admin"
        >
          Enter Management System
        </div>
      )}
      <div className="search-main">
        <div>
          <span className="search-menu search-menu--selected">Film</span>
          <span className="search-menu">Wishlist</span>
        </div>
        <div className="search-input-wrap">
          <input
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            className="search-input"
          ></input>
          <div
            onClick={() => {
              props.onSearch(keyword);
            }}
            className="search-input-icon"
          ></div>
        </div>
      </div>
    </div>
  );
}
