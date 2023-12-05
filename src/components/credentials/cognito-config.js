const AWS = require('aws-sdk');
AWS.config.update({ 
  region: 'eu-central-1',
  apiVersion: 'latest'
});
const secretsManager = new AWS.SecretsManager();
const secretName = 'prod/cognito/data';


const getSecretValue = async () => {
  try {
    const params = {
      SecretId: secretName,
    };
    const data = await secretsManager.getSecretValue(params).promise();
    const secretValue = JSON.parse(data.SecretString);
    return secretValue;
  } catch (error) {
    console.error('Error getting secrets value:', error);
    throw error;
  }
};

const getCognitoData = async () => {
  const secretValue = await getSecretValue();
  const poolData = {
    UserPoolId: secretValue.UserPoolId,
    ClientId: secretValue.ClientId,
  };
  return poolData;
}

export default getCognitoData;