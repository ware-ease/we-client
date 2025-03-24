import { Permission, samplePermissions } from '../types/permission';

export const getPermissions = (): Promise<Permission[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(samplePermissions);
    }, 500); // Simulating a 500ms network delay
  });
};
