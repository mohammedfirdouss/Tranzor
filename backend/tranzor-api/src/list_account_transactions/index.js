const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb');
const { verifyJwt } = require('./auth');

const dynamo = new DynamoDBClient();
const TABLE_NAME = process.env.TRANSACTIONS_TABLE_NAME;
const GSI_NAME = 'AccountId-ReceivedTimestamp-index';

// Helper to recursively convert DynamoDB attribute values to JS values
function fromDynamoDB(item) {
  if (item.S !== undefined) return item.S;
  if (item.N !== undefined) return Number(item.N);
  if (item.BOOL !== undefined) return item.BOOL;
  if (item.NULL !== undefined) return null;
  if (item.M !== undefined) {
    const obj = {};
    for (const [k, v] of Object.entries(item.M)) {
      obj[k] = fromDynamoDB(v);
    }
    return obj;
  }
  if (item.L !== undefined) {
    return item.L.map(fromDynamoDB);
  }
  return item;
}

exports.handler = async (event) => {
  try {
    verifyJwt(event);
  } catch (err) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' })
    };
  }

  const accountId = event.pathParameters && event.pathParameters.accountId;
  if (!accountId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing accountId in path' })
    };
  }
  // Query params
  const qp = event.queryStringParameters || {};
  const status = qp.status;
  const transactionType = qp.type;
  const startDate = qp.startDate;
  const endDate = qp.endDate;
  const limit = qp.limit ? parseInt(qp.limit, 10) : 20;
  const nextToken = qp.nextToken ? JSON.parse(Buffer.from(qp.nextToken, 'base64').toString('utf-8')) : undefined;

  // Build KeyConditionExpression
  let KeyConditionExpression = '#accountId = :accountId';
  let ExpressionAttributeNames = { '#accountId': 'accountId' };
  let ExpressionAttributeValues = { ':accountId': { S: accountId } };
  if (startDate && endDate) {
    KeyConditionExpression += ' AND #receivedTimestamp BETWEEN :start AND :end';
    ExpressionAttributeNames['#receivedTimestamp'] = 'receivedTimestamp';
    ExpressionAttributeValues[':start'] = { S: startDate };
    ExpressionAttributeValues[':end'] = { S: endDate };
  } else if (startDate) {
    KeyConditionExpression += ' AND #receivedTimestamp >= :start';
    ExpressionAttributeNames['#receivedTimestamp'] = 'receivedTimestamp';
    ExpressionAttributeValues[':start'] = { S: startDate };
  } else if (endDate) {
    KeyConditionExpression += ' AND #receivedTimestamp <= :end';
    ExpressionAttributeNames['#receivedTimestamp'] = 'receivedTimestamp';
    ExpressionAttributeValues[':end'] = { S: endDate };
  }

  // Build FilterExpression
  let FilterExpression = '';
  if (status) {
    FilterExpression += '#status = :status';
    ExpressionAttributeNames['#status'] = 'status';
    ExpressionAttributeValues[':status'] = { S: status };
  }
  if (transactionType) {
    if (FilterExpression) FilterExpression += ' AND ';
    FilterExpression += '#transactionType = :type';
    ExpressionAttributeNames['#transactionType'] = 'transactionType';
    ExpressionAttributeValues[':type'] = { S: transactionType };
  }

  try {
    const params = {
      TableName: TABLE_NAME,
      IndexName: GSI_NAME,
      KeyConditionExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      Limit: limit,
      ExclusiveStartKey: nextToken,
    };
    if (FilterExpression) params.FilterExpression = FilterExpression;
    const res = await dynamo.send(new QueryCommand(params));
    const txns = (res.Items || []).map(item => {
      const obj = {};
      for (const [k, v] of Object.entries(item)) {
        obj[k] = fromDynamoDB(v);
      }
      return obj;
    });
    let encodedNextToken = undefined;
    if (res.LastEvaluatedKey) {
      encodedNextToken = Buffer.from(JSON.stringify(res.LastEvaluatedKey)).toString('base64');
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions: txns, nextToken: encodedNextToken })
    };
  } catch (err) {
    console.error('Error listing account transactions:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};