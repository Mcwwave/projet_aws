import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import dotenv from 'dotenv';

dotenv.config();

// Configuration du client DynamoDB
const client = new DynamoDBClient({
  region: process.env.region,
  credentials: {
    accessKeyId: process.env.accessKeyId!,
    secretAccessKey: process.env.secretAccessKey!,
  },
});

// Utilisation du DocumentClient pour faciliter les opérations avec DynamoDB
const db = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,  // Supprimer les valeurs indéfinies
  },
});

// Fonction pour scanner et récupérer tous les produits de la table
export const scanProductsFromDatabase = async () => {
  const params = {
    TableName: 'Products',
  };

  try {
    const command = new ScanCommand(params);
    const data = await db.send(command);
    return data.Items; // Retourne les produits trouvés
  } catch (error) {
    console.error('Error scanning DynamoDB:', error);
    throw new Error('Could not scan products');
  }
};

export default db;
