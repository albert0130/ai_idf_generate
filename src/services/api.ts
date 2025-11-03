import axios from 'axios';
import { IDFData, Invention } from '@/types/idf';

// Client-side API functions that call our server-side routes
export async function generateIDFData(title: string): Promise<IDFData> {
  try {
    const response = await axios.post('/api/generate-idf', { title });
    return response.data;
  } catch (error: any) {
    console.error('Failed to generate IDF data:', error.response?.data || error.message);
    throw error;
  }
}

export default async function generateusingperplexity(title: string, type: string, basic: string, urls: any = null): Promise<string> {
  try {
    const response = await axios.post('/api/generate-perplexity', {
      title,
      type,
      basic,
      urls
    });
    return response.data.result;
  } catch (error: any) {
    console.error('Failed to generate with Perplexity:', error.response?.data || error.message);
    throw error;
  }
} 