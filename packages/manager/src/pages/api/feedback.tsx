import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authToken: string = process.env.SPASHIP_BACKSTAGE_FEEDBACK_SECRET || '';
    const feedbackUrl: string = process.env.SPASHIP_BACKSTAGE_FEEDBACK_URL || '';

    const response = await axios.post(feedbackUrl, req.body, {
      headers: {
        'X-API-Key': authToken
      }
    });

    res.status(200).json({ message: 'success', data: response.data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
