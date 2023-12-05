import React, { useState } from 'react';
import '../../css/login.css';
import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import getCognitoData from './cognito-config';

const Login = ({ onSuccessfulLogin }) => {
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [shouldShowMessage, setShouldShowMessage] = useState(false);
  const [meesageText, setMessageText] = useState('');
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
      if(password === repeatedPassword) {   
        handleRegister();
      } else {
        setPassword('');
        setRepeatedPassword('');
        setShouldShowMessage(true);
        setIsMessageError(true);
        setMessageText('Hasła muszą być takie same!')
      }      
    } else {
      const authenticationData = {
        Username: username,
        Password: password,
      };  
      const authenticationDetails = new AuthenticationDetails(authenticationData);
      let cognitoPool = await getCognitoData();
      const userData = {
        Username: username,
        Pool: new CognitoUserPool(cognitoPool),
      };
  
      const cognitoUser = new CognitoUser(userData);
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          let usernameToDisplay = session.idToken.payload.preferred_username;
          console.log('Zalogowano pomyślnie: ', usernameToDisplay);
          localStorage.setItem('authorizationBearer', session.accessToken.jwtToken);
          onSuccessfulLogin(usernameToDisplay)
        },
        onFailure: (err) => {
          console.error('Błąd logowania:', err.message, username);
          let message = err.message;
          if(message === 'User does not exist.') {
            setMessageText('Nie znaleziono użytkownika z mailem: ' + username)
          } else if(message === 'Incorrect username or password.') {
            setMessageText('Niepoprawny login lub hasło dla użytkownika: ' + username)
          } else if(message === 'Missing required parameter USERNAME') {
            setMessageText('Podaj adres email do zalogowania')
          }
          clearInputs();
          setShouldShowMessage(true);
          setIsMessageError(true);
          
        },
      });
    }    
  };

  const handleRegister = async () => {
    let cognitoPool = await getCognitoData();
    const userPool = new CognitoUserPool(cognitoPool);
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'preferred_username', Value: username })
    ];
    if(!(new RegExp("^([\\w\\.@_\\- ]{4,32})$").test(username))) {
      setMessageText('Nazwa użytkownika musi mieć między 4-32 znaki i zawierać tylko litery, cyfry, spacje, podkreślenia i myślniki')
      setShouldShowMessage(true);
      setIsMessageError(true);
      return;
    }
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        let message = err.message;
        console.error('Błąd rejestracji:', message);
        if(message.includes('Password did not conform with policy')) {
          setMessageText('Hasło zbyt proste. Minimum 8 znaków, cyfra, mała i duża litera oraz znak specjalny są wymagane')
          setPassword('');
          setRepeatedPassword('');
        } else if(message === 'Invalid email address format.') {
          setMessageText('Nieprawidłowy adres email')
          setEmail('')
        } else if(message.includes('An account with the given email already exists')) {
          setMessageText('Ten adres email jest już zajęty')
          setEmail('')
        }
        setShouldShowMessage(true);
        setIsMessageError(true);
        return;
      }
      setIsRegistering(false);
      clearInputs();
      setShouldShowMessage(true);
      setIsMessageError(false);
      setMessageText('Konto utworzone. Zweryfikuj konto klikając link w wysłanym mailu.')
      console.log('Rejestracja powiodła się:', result);
    });
  };

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
