import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Select, message, Input } from 'antd';

import './index.css';

import { hideSignUp, showPrivacyPolicy, showSignIn } from '../../store';
import { signup } from '../../service';

export default function SignUp() {
  const dispatch = useDispatch();

  const [username, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [securityQuestion, setSecurityQuestion] = useState<string>('');
  const [securityAnswer, setSecurityAnswer] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [gender, setGender] = useState<'M' | 'F' | ''>('');
  const [birthday, setBirthday] = useState<string>('');
  const [genreBias, setGenreBias] = useState<string>();
  const [policy, setPolicy] = useState<boolean>(false);
  const handleSignup = () => {
    if (
      !policy ||
      !username ||
      !password ||
      !genreBias ||
      !email ||
      !securityQuestion ||
      !securityAnswer
    ) {
      message.error('Please complete all the form item');
      return;
    }
    if (!/(.+)@(.+){2,}\.(.+){2,}/.test(email)) {
      message.error('Please enter your vaild email');
      return;
    }
    signup({
      username,
      password,
      gender,
      birthday,
      genre_bias: genreBias,
      email,
      security_answer: securityAnswer,
      security_question: securityQuestion,
    }).then((res) => {
      if (res.data.code === 0) {
        window.location.reload();
      }
    });
  };
  const handlePrivacy = () => {
    dispatch(hideSignUp());
    dispatch(showPrivacyPolicy());
  };

  return (
    <div className="sign-up-wrap">
      <div className="sign-up">
        <div className="sign-up__wrap">
          <div>*User name</div>
          <div className="sign-up__username">
            <input onChange={(e) => setUserName(e.target.value)}></input>
          </div>
          <div className="sign-up__password-text">*Password</div>
          <div className="sign-up__password">
            <input onChange={(e) => setPassword(e.target.value)}></input>
          </div>
          <div className="sign-up__password-text">*Security Question</div>
          <div className="sign-up__password">
            <input
              onChange={(e) => setSecurityQuestion(e.target.value)}
            ></input>
          </div>
          <div className="sign-up__password-text">*Security Answer</div>
          <div className="sign-up__password">
            <input onChange={(e) => setSecurityAnswer(e.target.value)}></input>
          </div>
          <div className="sign-up__password-text">*Email</div>
          <div className="sign-up__password">
            <Input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
          </div>
          <div className="sign-up__gender-text">Gender</div>
          <div className="sign-up__gender">
            <Select
              style={{
                width: '100%',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
              onChange={(e) => setGender(e)}
            >
              <Select.Option value="M">male</Select.Option>
              <Select.Option value="F">female</Select.Option>
            </Select>
          </div>
          <div className="sign-up__birthday-text">Birthday</div>
          <div className="sign-up__birthday">
            <input
              onChange={(e) => setBirthday(e.target.value)}
              type="date"
            ></input>
          </div>
          <div className="sign-up__genre-text">*Preferrer Genre</div>
          <div className="sign-up__genre">
            <Select
              onChange={(e) => setGenreBias(e.join('/'))}
              mode="multiple"
              style={{
                width: '100%',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <Select.Option value="COMEDY">Comedy</Select.Option>
              <Select.Option value="HORROR">Horror</Select.Option>
              <Select.Option value="ROMANCE">Romance</Select.Option>
              <Select.Option value="SCI-FI">Sci-Fi</Select.Option>
              <Select.Option value="DOCUMENTARY">Documentary</Select.Option>
              <Select.Option value="DRAMA">Drama</Select.Option>
              <Select.Option value="ACTION">Action</Select.Option>
              <Select.Option value="THRILLER">Thriller</Select.Option>
            </Select>
          </div>

          <div className="sign-up__policy">
            <input
              onChange={(e) => setPolicy(e.target.checked)}
              type="checkbox"
            />
            *I have read and accepted all the{' '}
            <span onClick={handlePrivacy}>Privacy Policy</span>.
          </div>
          <div onClick={handleSignup} className="sign-up__button">
            SIGN UP
          </div>
        </div>
        <div
          onClick={() => {
            dispatch(hideSignUp());
            dispatch(showSignIn());
          }}
          className="sign-up__close"
        ></div>
        <div className="sign-up__joinus">JOIN US</div>
      </div>
    </div>
  );
}
