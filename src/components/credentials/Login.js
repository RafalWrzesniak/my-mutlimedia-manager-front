import React, { useState } from 'react';
import '../../css/login.css';
import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import {registerInApp} from "../api/MutlimediaManagerApi";

const Login = ({ onSuccessfulLogin }) => {
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [shouldShowMessage, setShouldShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isMessageError, setIsMessageError] = useState(false);

  const clearInputs = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setRepeatedPassword('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isRegistering) {   
      handleRegister();   
    } else {
      handleLogin();
    }    
  };

  const handleLogin = async () => {
    const authenticationData = {
      Username: username,
      Password: password,
    };  
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const userData = {
      Username: username,
      Pool: getCognitoUserPool(),
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: async (session) => {
        let usernameToDisplay = session.idToken.payload.preferred_username;
        localStorage.setItem('authorizationBearer', session.idToken.jwtToken);
        if(shouldRegisterNewUser()) {
          await registerInApp(localStorage.getItem('registrationDataUserId'), localStorage.getItem('registrationDataUsername'), localStorage.getItem('registrationDataEmail'));
          localStorage.removeItem('registrationDataUsername')
          localStorage.removeItem('registrationDataUserId')
          localStorage.removeItem('registrationDataEmail')
        }
        onSuccessfulLogin(usernameToDisplay)
      },
      onFailure: (err) => {
        console.error('Błąd logowania:', err.message);
        handleErrorMessage(err.message);
        clearInputs();          
      },
    });
  }

  const shouldRegisterNewUser = () => {
    return localStorage.getItem('registrationDataUserId') && localStorage.getItem('registrationDataUsername') && localStorage.getItem('registrationDataEmail');
  }

  const handleRegister = async () => {
    if(!isPassingRegistrationInitialValidation()) {
      return;
    }
    const userPool = getCognitoUserPool();
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'preferred_username', Value: username })
    ];
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        console.error('Błąd rejestracji:', err.message);
        handleErrorMessage(err.message);
        return;
      }
      localStorage.setItem('registrationDataUsername', username)
      localStorage.setItem('registrationDataUserId', result.userSub)
      localStorage.setItem('registrationDataEmail', email)
      setIsRegistering(false);
      clearInputs();
      setShouldShowMessage(true);
      setIsMessageError(false);
      setMessageText('Konto utworzone. Zweryfikuj konto klikając link w wysłanym mailu.')
    });
  };

  const isPassingRegistrationInitialValidation = () => {
    if(password !== repeatedPassword) {
      setPassword('');
      setRepeatedPassword('');
      setShouldShowMessage(true);
      setIsMessageError(true);
      setMessageText('Hasła muszą być takie same!')
      return false;
    }
    if(!(new RegExp("^([\\w\\.@_\\- ]{4,32})$").test(username))) {
      setMessageText('Nazwa użytkownika musi mieć między 4-32 znaki i zawierać tylko litery, cyfry, spacje, podkreślenia i myślniki')
      setShouldShowMessage(true);
      setIsMessageError(true);
      return false;
    }
    return true;
  }

  const handleErrorMessage = (message) => {
    if(message.includes('Password did not conform with policy') || message.includes('Member must satisfy regular expression pattern')) {
      setMessageText('Hasło zbyt proste. Minimum 8 znaków, cyfra, mała i duża litera oraz znak specjalny są wymagane')
      setPassword('');
      setRepeatedPassword('');
    } else if(message === 'Invalid email address format.') {
      setMessageText('Nieprawidłowy adres email')
      setEmail('')
    } else if(message.includes('An account with the given email already exists')) {
      setMessageText('Ten adres email jest już zajęty')
      setEmail('')
    } else if(message === 'User does not exist.') {
      setMessageText('Nie znaleziono użytkownika z mailem: ' + username)
    } else if(message === 'Incorrect username or password.') {
      setMessageText('Niepoprawny login lub hasło dla użytkownika: ' + username)
    } else if(message === 'Missing required parameter USERNAME') {
      setMessageText('Podaj adres email do zalogowania')
    }
    setShouldShowMessage(true);
    setIsMessageError(true);
  }

  const getCognitoUserPool = () => {
    let cognitoPool = {
      UserPoolId: process.env.REACT_APP_USER_POOL_ID,
      ClientId: process.env.REACT_APP_CLIENT_ID
    }
    return new CognitoUserPool(cognitoPool);
  }

  return (
    <div className='login-container'>
      <h2>{isRegistering ? 'Rejestracja' : 'Logowanie'}</h2>
      <form onSubmit={handleSubmit} className='form'>
      <input
          type="text"
          placeholder={isRegistering ? "Nazwa użytkownika" : "Adres email"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='input'
          maxLength={32}
        />
        {(isRegistering) && (<input
          type="text"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='input'
          maxLength={32}
        />)}
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='input'
          maxLength={32}
        />
        {(isRegistering) && (
          <input
          type="password"
          placeholder="Powtórz hasło"
          value={repeatedPassword}
          onChange={(e) => setRepeatedPassword(e.target.value)}
          className='input'
          maxLength={32}
        />
        )}
        {(shouldShowMessage) && (
          <div className={`messageClass${isMessageError ? 'Error' : ''}`}>{messageText}</div>
        )}

        <button type="submit" className='button'>
          {isRegistering ? 'Zarejestruj' : 'Zaloguj'}
        </button>
      </form>
      <p className='toggleText'>
        {isRegistering ? 'Masz już konto?' : 'Nie masz jeszcze konta?'}
        <span
          className='toggleLink'
          onClick={() => {
            setIsRegistering(!isRegistering);
            setShouldShowMessage(false);
            clearInputs();
          }}>
          {isRegistering ? 'Zaloguj' : 'Zarejestruj'}
        </span>
      </p>
    </div>
  );
};

export default Login;
