const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

/**
 * Get user document from DynamoDB
 */
async function getUser(userId) {
  const response = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId },
    })
  );
  return response.Item;
}

/**
 * Update user attribute using UpdateCommand
 */
async function updateUserAttribute(userId, attributeName, attributeValue) {
  await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { userId },
      UpdateExpression: 'SET #attr = :val',
      ExpressionAttributeNames: { '#attr': attributeName },
      ExpressionAttributeValues: { ':val': attributeValue },
    })
  );
}

module.exports = {
  docClient,
  TABLE_NAME,
  getUser,
  updateUserAttribute,
};
