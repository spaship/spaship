import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('before try', req, res);
  try {
    const authToken: string = process.env.SPASHIP_BACKSTAGE_FEEDBACK_SECRET || '';
    const feedbackUrl: string = process.env.SPASHIP_BACKSTAGE_FEEDBACK_URL || '';

    const response = await axios.post(feedbackUrl, req.body, {
      headers: {
        'X-API-Key': authToken
      }
    });

    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
