import { useState, useRef } from 'react';
import { loginCall, registerCall } from '../../shared/api/auth';
import { useNavigate } from 'react-router-dom';
import s from './AuthPage.module.scss'; // Import SCSS module
import { GoogleLogin } from '@react-oauth/google';

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsernameState] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [backendError, setBackendError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const validateUsername = (username: string) => {
    if (!username) {
      return 'Имя пользователя обязательно для заполнения';
    }
    if (username.length < 4 || username.length > 20) {
      return 'Имя пользователя должно содержать от 4 до 20 символов';
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return 'Имя пользователя должно состоять только из букв латинского алфавита и цифр';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return 'Пароль обязателен для заполнения';
    }
    if (password.length < 8 || password.length > 40) {
      return 'Пароль должен содержать от 8 до 40 символов';
    }
    if (!/[a-zA-Z]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну букву латинского алфавита';
    }
    if (!/\d/.test(password)) {
      return 'Пароль должен содержать хотя бы одну цифру';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      return 'Подтверждение пароля обязательно для заполнения';
    }
    if (password !== confirmPassword) {
      return 'Пароли не совпадают';
    }
    return '';
  };

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email обязателен для заполнения';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Неверный формат email';
    }
    return '';
  };

  const handleBlur = (field: string) => {
    switch (field) {
      case 'email':
        setEmailError(validateEmail(email));
        break;
      case 'username':
        setUsernameError(validateUsername(username));
        break;
      case 'password':
        setPasswordError(validatePassword(password));
        break;
      case 'confirmPassword':
        setConfirmPasswordError(validateConfirmPassword(confirmPassword));
        break;
      default:
        break;
    }
  };

  const translateBackendError = (error: string) => {
    switch (error) {
      case 'Email already registered':
        return 'Этот email уже зарегистрирован';
      case 'Invalid credentials':
        return 'Неверный email или пароль';
      default:
        return 'Произошла ошибка. Попробуйте позже';
    }
  };

  const handleSubmit = async () => {
    const emailError = validateEmail(email);
    setEmailError(emailError);
    const usernameError = isRegistering ? validateUsername(username) : '';
    setUsernameError(usernameError);
    const passwordError = validatePassword(password);
    setPasswordError(passwordError);
    const confirmPasswordError = isRegistering ? validateConfirmPassword(confirmPassword) : '';
    setConfirmPasswordError(confirmPasswordError);

    if (emailError || usernameError || passwordError || confirmPasswordError) {
      return;
    }
    console.log('after');
    try {
      setIsLoading(true);
      setBackendError('');
      if (isRegistering) {
        await registerCall(email, username, password);
        setIsRegistering(false);
      } else {
        await loginCall(email, password);
      }
      navigate('/');
    } catch (error: any) {
      setBackendError(translateBackendError(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    const googleToken = credentialResponse.credential;
    if (googleToken) {
      try {
        const response = await fetch('http://localhost:3000/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: googleToken }),
        });

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);
        navigate('/');
      } catch (error) {
        console.error('Google sign-in error:', error);
      }
    }
  };

  return (
    <div className={s.auth_wrapper}>
      <div className={s.box}>
        <h1>{isRegistering ? 'Регистрация' : 'Вход'}</h1>
        <div className={s.field_wrapper}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="Email"
            className={s.authInput}
            required
            ref={emailRef}
          />
          {emailError && <div className={s.error}>{emailError}</div>}
          {isRegistering && (
            <>
              <input
                value={username}
                onChange={(e) => setUsernameState(e.target.value)}
                onBlur={() => handleBlur('username')}
                placeholder="Имя пользователя"
                className={s.authInput}
                required
                ref={usernameRef}
              />
              {usernameError && <div className={s.error}>{usernameError}</div>}
            </>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur('password')}
            placeholder="Пароль"
            className={s.authInput}
            required
            ref={passwordRef}
          />
          {passwordError && <div className={s.error}>{passwordError}</div>}
          {isRegistering && (
            <>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="Подтвердите пароль"
                className={s.authInput}
                required
                ref={confirmPasswordRef}
              />
              {confirmPasswordError && <div className={s.error}>{confirmPasswordError}</div>}
            </>
          )}
        </div>
        {backendError && <div className={s.back_error}>{backendError}</div>}
        <div className={s.button_wrapper}>
          <button onClick={handleSubmit} className={s.authButton} disabled={isLoading}>
            {isLoading ? 'Загрузка...' : isRegistering ? 'Зарегистрироваться' : 'Войти'}
          </button>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => console.log('Login Failed')}
          />
          <button onClick={() => setIsRegistering(!isRegistering)} className={s.authSwitchButton}>
            {isRegistering ? 'Перейти ко входу' : 'Перейти к регистрации'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
