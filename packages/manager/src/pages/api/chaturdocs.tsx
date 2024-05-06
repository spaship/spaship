import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const API_ENDPOINT: string = (process.env.SPASHIP_CHATURDOCS_URL as string) || '';

    const response = await axios.post(API_ENDPOINT, req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    res.send({ data: response.data.answer });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
