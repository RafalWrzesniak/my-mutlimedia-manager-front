const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const secretsManager = new AWS.SecretsManager();
const secretName = 'prod/cognito/data';

const params = {
  SecretId: secretName,
};

const getCognitoData = async () => {
  let secretValue = await secretsManager.getSecretValue(params, (err, data) => {
    if (err) {
      console.error('Błąd pobierania sekretu:', err);
    } else {
      const secretValue = JSON.parse(data.SecretString);
      console.log('Wartość sekretu:', secretValue);
      return secretValue;
    }
  });

  const poolData = {
    UserPoolId: secretValue.UserPoolId,
    ClientId: secretValue.ClientId,
  };
  return poolData;
}

export default getCognitoData;