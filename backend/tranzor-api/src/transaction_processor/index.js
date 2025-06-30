const { DynamoDBClient, GetItemCommand, UpdateItemCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');
const { verifyJwt } = require('./auth');

const dynamo = new DynamoDBClient();
const TABLE_NAME = process.env.TRANSACTIONS_TABLE_NAME;
const AUDIT_LOGS_TABLE = process.env.AUDIT_LOGS_TABLE_NAME;
const FRAUD_CHECKS_TABLE = process.env.FRAUD_CHECKS_TABLE_NAME;

exports.handler = async (event) => {
  try {
    verifyJwt(event);

    for (const record of event.Records || []) {
      try {
        const msg = JSON.parse(record.body);
        const { transactionId } = msg;
        console.log('Processing transaction:', transactionId);

        // 1. Fetch transaction from DynamoDB
        const txnRes = await dynamo.send(new GetItemCommand({
          TableName: TABLE_NAME,
          Key: { transactionId: { S: transactionId } }
        }));
        if (!txnRes.Item) {
          console.warn('Transaction not found:', transactionId);
          continue;
        }
        const status = txnRes.Item.status.S;
        if (status !== 'Pending') {
          console.log('Transaction already processed:', transactionId, 'status:', status);
          continue;
        }

        // 2. Simulate fraud check (random approve/decline)
        const fraudScore = Math.random();
        const approved = fraudScore > 0.1; // 90% approve, 10% decline
        const newStatus = approved ? 'Approved' : 'Declined';
        const statusReason = approved ? undefined : 'Fraud Detected (simulated)';
        const fraudCheckId = uuidv4();
        const fraudCheckTimestamp = new Date().toISOString();

        // 2a. Write fraud check result to FraudChecks table
        await dynamo.send(new PutItemCommand({
          TableName: FRAUD_CHECKS_TABLE,
          Item: {
            fraudCheckId: { S: fraudCheckId },
            transactionId: { S: transactionId },
            score: { N: fraudScore.toFixed(4) },
            status: { S: approved ? 'Approved' : 'Declined' },
            details: { S: approved ? 'Auto-approved (simulated)' : 'Auto-declined (simulated)' },
            timestamp: { S: fraudCheckTimestamp }
          }
        }));

        // 3. Update transaction status in DynamoDB
        const updateParams = {
          TableName: TABLE_NAME,
          Key: { transactionId: { S: transactionId } },
          UpdateExpression: approved
            ? 'SET #status = :s, processedTimestamp = :ts, fraudCheckId = :fcid'
            : 'SET #status = :s, statusReason = :r, processedTimestamp = :ts, fraudCheckId = :fcid',
          ExpressionAttributeNames: { '#status': 'status' },
          ExpressionAttributeValues: approved
            ? {
                ':s': { S: newStatus },
                ':ts': { S: fraudCheckTimestamp },
                ':fcid': { S: fraudCheckId },
                ':pending': { S: 'Pending' }
              }
            : {
                ':s': { S: newStatus },
                ':r': { S: statusReason },
                ':ts': { S: fraudCheckTimestamp },
                ':fcid': { S: fraudCheckId },
                ':pending': { S: 'Pending' }
              },
          ConditionExpression: '#status = :pending'
        };
        await dynamo.send(new UpdateItemCommand(updateParams));
        console.log(`Transaction ${transactionId} processed: ${newStatus}`);

        // 4. Write audit log entry to AuditLogs table
        const auditLogId = uuidv4();
        const auditTimestamp = new Date().toISOString();
        await dynamo.send(new PutItemCommand({
          TableName: AUDIT_LOGS_TABLE,
          Item: {
            logId: { S: auditLogId },
            timestamp: { S: auditTimestamp },
            eventType: { S: 'TransactionStatusUpdated' },
            entityId: { S: transactionId },
            details: { S: JSON.stringify({
              newStatus,
              statusReason,
              fraudCheckId,
              fraudScore: fraudScore.toFixed(4),
              processedBy: 'TransactionProcessor',
            }) }
          }
        }));
      } catch (err) {
        console.error('Error processing SQS message:', err);
      }
    }
  } catch (err) {
    console.error('JWT verification failed:', err);
  }
  return {};
};