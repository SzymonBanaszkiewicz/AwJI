
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.DB_CONN_STRING;
  const dbName = process.env.DB_NAME;

  if (!mongoUri) {
    throw new Error('DB_CONN_STRING is not set');
  }

  if (!dbName) {
    throw new Error('DB_NAME is not set');
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName,
    });

    console.log(`Połączono pomyślnie z MongoDB: ${dbName}`);
  } catch (error) {
    console.error('Błąd połączenia z MongoDB:', error);
    throw error;
  }
};
