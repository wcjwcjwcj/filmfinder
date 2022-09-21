import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { message, Input, Button } from 'antd';

import './index.css';

import { hideForgetPassword, showSignIn } from '../../store';
import { forgetPassword, getSecurityQuestion } from '../../service';

export default function ForgetPassword() {
  const dispatch = useDispatch();

  const [username, setUserName] = useState<string>('');
  const [securityAnswer, setSecurityAnswer] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const handleSubmit = () => {
    if (!username || !securityQuestion || !securityAnswer || !newPassword) {
      message.error('Please complete all the form item');
      return;
    }
    forgetPassword({
      username: username,
      security_question: securityQuestion,
      security_answer: securityAnswer,
      new_password: newPassword,
    }).then((res) => {
      if (res.data.code === 0) {
        dispatch(showSignIn());
        dispatch(hideForgetPassword());
      }
    });
  };

  const [securityQuestion, setSecurityQuestion] = useState<string>('');
  const handleGetSecurityQuestion = () => {
    if (!username) {
      message.error('Please input your user name');
      return;
    }
    getSecurityQuestion(username).then((res) => {
      if (res.data.code === 0) {
        setSecurityQuestion(res.data.data);
      }
    });
  };

  return (
    <div className="forget-pass-wrap">
      <div className="forget-pass">
        <div className="forget-pass__wrap">
          <div className="forget-pass__label">*User name</div>
          <div className="forget-pass__item">
            <Input.Group compact>
              <Input
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                style={{ width: 'calc(100% - 175px)' }}
              />
              <Button onClick={handleGetSecurityQuestion}>
                Get security question
              </Button>
            </Input.Group>
          </div>

          <div className="forget-pass__label">
            Security Question:{' '}
            {securityQuestion ? securityQuestion : '  Not yet obtained'}
          </div>

          <div className="forget-pass__label">*Security Answer</div>
          <div className="forget-pass__item">
            <input
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
            ></input>
          </div>

          <div className="forget-pass__label">*New Password</div>
          <div className="forget-pass__item">
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            ></input>
          </div>

          <div onClick={handleSubmit} className="forget-pass__button">
            Submit
          </div>
        </div>
        <div
          onClick={() => {
            dispatch(hideForgetPassword());
            dispatch(showSignIn());
          }}
          className="forget-pass__close"
        ></div>
      </div>
    </div>
  );
}
