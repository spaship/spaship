// Extract pod IDs not starting with "router" based on isStatic flag
export const extractPodIds = (jsonData: any, isStatic: boolean) => {
  console.log('jsondata', jsonData);
  const podIds: string[] = [];
  jsonData?.forEach((item: any) => {
    item?.pods?.forEach((podId: string) => {
      if (!isStatic || (isStatic && !podId.startsWith('router-'))) {
        podIds.push(podId);
      }
    });
  });
  return podIds;
};
