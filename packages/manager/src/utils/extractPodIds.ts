// Extract pod IDs not starting with "router" based on isStatic flag
export const extractPodIds = (jsonData: any, isStatic: boolean) => {
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
// Extract pod IDs for static pods 
export const extractPodIdsForStatic = (
  jsonData: any,
  isStatic: boolean,
  propertyIdentifier: string,
  env: string
) => {
  const podIds: string[] = [];
  jsonData?.forEach((item: any) => {
    item?.pods?.forEach((podId: string) => {
      if (
        !isStatic ||
        (isStatic &&
          podId.startsWith(`${propertyIdentifier}-${env}`) &&
          !podId.startsWith('router-'))
      ) {
        podIds.push(podId);
      }
    });
  });

  return podIds;
};
