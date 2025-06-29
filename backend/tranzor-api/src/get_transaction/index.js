const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');

const dynamo = new DynamoDBClient();
const TABLE_NAME = process.env.TRANSACTIONS_TABLE_NAME;

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
  const transactionId = event.pathParameters && event.pathParameters.transactionId;
  // Accept accountId as a query string parameter
  const accountId = event.queryStringParameters && event.queryStringParameters.accountId;
  if (!transactionId || !accountId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing transactionId or accountId' })
    };
  }
  try {
    const res = await dynamo.send(new GetItemCommand({
      TableName: TABLE_NAME,
      Key: { transactionId: { S: transactionId }, accountId: { S: accountId } }
    }));
    if (!res.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Transaction not found' })
      };
    }
    // Convert DynamoDB item to plain JS object
    const item = {};
    for (const [k, v] of Object.entries(res.Item)) {
      item[k] = fromDynamoDB(v);
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    };
  } catch (err) {
    console.error('Error fetching transaction:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};