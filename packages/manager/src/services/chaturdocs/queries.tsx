// queries.tsx
import { useMutation, useQuery } from '@tanstack/react-query';

const API_ENDPOINT = 'https://chaturdocs-api.usersys.redhat.com/chaturdocs/rest/search';

export const usePostQuestion = (newQuestion: string) => {
  return useMutation((newQuestion: string) =>
    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question: newQuestion })
    }).then((response) => response.json())
  );
};

// export const useGetSomeData = () => {
//   return useQuery('chaturdocs', async () => {
//     const response = await fetch('https://example.com/api/someData');
//     return response.json();
//   });
// };
