/**
 * Authentication configuration
 */
export interface AuthEnabledComponentConfig {
    authenticationEnabled: boolean;
}

/**
 * A component with authentication configuration
 */
export type ComponentWithAuth<PropsType = any> = React.FC<PropsType> & AuthEnabledComponentConfig;