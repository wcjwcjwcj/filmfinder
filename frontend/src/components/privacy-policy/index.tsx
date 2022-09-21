import React from 'react';
import { useDispatch } from 'react-redux';

import './index.css';

import { showSignUp, hidePrivacyPolicy } from '../../store';

export default function PrivacyPolicy() {
  const dispatch = useDispatch();

  const handleHide = () => {
    dispatch(showSignUp());
    dispatch(hidePrivacyPolicy());
  };

  return (
    <div className="policy-wrap">
      <div className="policy">
        <div className="policy-content">
          1. This the privacy policy for out website. This the privacy policy
          for out website. This the privacy policy for out website. <br></br>
          <br></br>
          2. This the privacy policy for out website. This the privacy policy
          for out website. This the privacy policy for out website. This the
          privacy policy for out website. This the privacy policy for out
          website. This the privacy policy for out website. This the privacy
          policy for out website. <br></br>
          <br></br>
          3. This the privacy policy for out website. This the privacy policy
          for out website. This the privacy policy for out website. This the
          privacy policy for out website. This the privacy policy for out
          website. This the privacy policy for out website. This the privacy
          policy for out website. This the privacy policy for out website. This
          the privacy policy for out website. This the privacy policy for out
          website. This the privacy policy for out website. This the privacy
          policy for out website. This the privacy policy for out website. This
          the privacy policy for out website. <br></br>
          <br></br>
          4. This the privacy policy for out website. This the privacy policy
          for out website. This the privacy policy for out website. This the
          privacy policy for out website. This the privacy policy for out
          website. This the privacy policy for out website. This the privacy
          policy for out website. This the privacy policy for out website.
        </div>
        <div onClick={handleHide} className="policy__close"></div>
      </div>
    </div>
  );
}
