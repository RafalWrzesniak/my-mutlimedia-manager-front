import React, { useState } from 'react';
import { login, register } from '../api/MutlimediaManagerApi';
import '../../css/login.css';

const Login = ({ onSuccessfulLogin }) => {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [shouldShowMessage, setShouldShowMessage] = useState(false);
  const [meesageText, setMessageText] = useState('');
  const [isMessageError, setIsMessageError] = useState(false);

  const clearInputs = () => {
    setUsername('');
    setPassword('');
    setRepeatedPassword('');
  }

  const onFailedLoginOrRegister = (responseData) => {
    if(responseData.response.data != '') {
      if(responseData.response.data.messages[0] == 'UserAlreadyExistException') {
        setMessageText("Ta nazwa konta jest już zajęta")
      } else {
        setMessageText(responseData.response.data.messages[0])
      }
    } else {
      setMessageText('Login lub hasło niepoprawne!')
    }
    clearInputs();
    setShouldShowMessage(true);
    setIsMessageError(true);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(isRegistering) {
      if(password === repeatedPassword) {
        register(username, password, () => {
          setIsRegistering(false);
          clearInputs();
          setShouldShowMessage(true);
          setIsMessageError(false);
          setMessageText('Konto utworzone. Zaloguj się')
        }, onFailedLoginOrRegister);
      } else {
        clearInputs();
        setShouldShowMessage(true);
        setIsMessageError(true);
        setMessageText('Hasła muszą być takie same!')
      }      
    } else {
      login(username, password, onSuccessfulLogin, onFailedLoginOrRegister);
    }    
  };

  return (
    <div className='login-container'>
      <h2>{isRegistering ? 'Rejestracja' : 'Logowanie'}</h2>
      <form onSubmit={handleSubmit} className='form'>
        <input
          type="text"
          placeholder="Login"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='input'
          maxLength={32}
        />
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
          <div className={`messageClass${isMessageError ? 'Error' : ''}`}>{meesageText}</div>
        )}

        <button type="submit" className='button'>
          {isRegistering ? 'Zarejestruj' : 'Zaloguj'}
        </button>
      </form>
      <p className='toggleText'>
        {isRegistering ? 'Masz już konto?' : 'Nie masz jeszcze konta?'}
        <span
          className='toggleLink'
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Zaloguj' : 'Zarejestruj'}
        </span>
      </p>
    </div>
  );
};

export default Login;
