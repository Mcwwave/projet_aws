import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  PutCommand, 
  GetCommand, 
  ScanCommand, 
  UpdateCommand, 
  DeleteCommand 
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.region });
const TableName = 'Products';

export const createProduct = async (product: any) => {
  const command = new PutCommand({
    TableName,
    Item: product,
  });
  return client.send(command);
};

export const getProductById = async (id: string) => {
  const command = new GetCommand({
    TableName,
    Key: { id },
  });
  return client.send(command);
};

// Fonction pour récupérer tous les produits
export const getAllProducts = async () => {
  const command = new ScanCommand({
    TableName,
  });

  try {
    const result = await client.send(command);
    return result.Items; // Retourne tous les produits trouvés
  } catch (error) {
    console.error('Error scanning DynamoDB:', error);
    throw new Error('Could not retrieve products');
  }
};

export const updateProduct = async (id: string, product: any) => {
  const command = new UpdateCommand({
    TableName,
    Key: { id },
    UpdateExpression: 'set productName = :name',
    ExpressionAttributeValues: {
      ':name': product.productName,
    },
    ReturnValues: 'UPDATED_NEW',
  });
  return client.send(command);
};

export const deleteProduct = async (id: string) => {
  const command = new DeleteCommand({
    TableName,
    Key: { id },
  });
  return client.send(command);
};
