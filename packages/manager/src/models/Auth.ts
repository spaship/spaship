/**
 * Interface for an AuthService class instance.
 */
export interface IAuthService {
  name: string;
  init(...args: any[]): Promise<IAuthService>;
  login(...args: any[]): Promise<IAuthService>;
  logout(...args: any[]): Promise<IAuthService>;
  isAuthenticated(): boolean;
  hasRole(role: string): boolean;
  getUserData(...args: any[]): boolean;
}

/**
 * Interface for an AuthService's constructor.
 */
export interface IAuthServiceConstructor {
  new (constructorOptions: IAuthServiceConstructorOptions): IAuthService;
}

/**
 * Interface for options object passed into an AuthService's constructor.
 */
export interface IAuthServiceConstructorOptions {
  url: string;
  realm: string;
  appName: string;
}
