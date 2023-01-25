export class Role {
  name: string;

  actions: string[];

  isActive: boolean;
}

export enum ROLE {
  OWNER = 'OWNER',
  USER = 'USER'
}
