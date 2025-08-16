import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const dbName = 'ai-meeting-summarizer';

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return { client: cachedClient, db: cachedClient.db(dbName) };
  }

  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  
  return { client, db: client.db(dbName) };
}

export interface SummaryDocument {
  userId: string;
  transcript: string;
  prompt: string;
  summary: string;
  createdAt: Date;
}

export interface SummaryWithId extends SummaryDocument {
  _id: string;
}

export async function saveSummary(summary: SummaryDocument): Promise<string> {
  const { db } = await connectToDatabase();
  const collection = db.collection('summaries');
  
  const result = await collection.insertOne({
    ...summary,
    createdAt: new Date()
  });
  
  return result.insertedId.toString();
}

export async function getUserSummaries(userId: string): Promise<SummaryWithId[]> {
  const { db } = await connectToDatabase();
  const collection = db.collection('summaries');
  
  const summaries = await collection
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
  
  return summaries.map(summary => ({
    ...summary,
    _id: summary._id.toString()
  } as SummaryWithId));
}

export async function getSummaryById(id: string): Promise<SummaryWithId | null> {
  const { db } = await connectToDatabase();
  const collection = db.collection('summaries');
  
  try {
    const summary = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!summary) return null;
    
    return {
      ...summary,
      _id: summary._id.toString()
    } as SummaryWithId;
  } catch (error) {
    console.error('Error retrieving summary:', error);
    return null;
  }
}
