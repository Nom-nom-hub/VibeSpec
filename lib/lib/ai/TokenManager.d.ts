/**
 * Secure Token Management for AI Assistant Integrations
 *
 * Provides secure storage, retrieval, and management of authentication tokens
 * for various AI assistant services. Uses encrypted storage and follows
 * security best practices.
 */
import { AIProvider } from './adapters/AdapterInterface';
export interface TokenMetadata {
    provider: AIProvider;
    scopes?: string[];
    expiresAt?: Date;
    createdAt: Date;
    label?: string;
    lastUsed?: Date;
    usageCount?: number;
}
export interface StoredToken {
    id: string;
    provider: AIProvider;
    encryptedToken: string;
    metadata: TokenMetadata;
    iv: string;
}
/**
 * Encrypted token storage and management
 */
export declare class TokenManager {
    private static instance;
    private tokenFile;
    private storeKey;
    private constructor();
    static getInstance(): TokenManager;
    /**
     * Store a token securely
     */
    storeToken(provider: AIProvider, token: string, metadata: Omit<TokenMetadata, 'provider' | 'createdAt'>): Promise<string>;
    /**
     * Retrieve a token and update usage metadata
     */
    retrieveToken(tokenId: string): Promise<string | null>;
    /**
     * Get token by provider (returns most recently used)
     */
    getTokenByProvider(provider: AIProvider): Promise<string | null>;
    /**
     * Revoke/remove a token
     */
    revokeToken(tokenId: string): Promise<boolean>;
    /**
     * Revoke all tokens for a provider
     */
    revokeProviderTokens(provider: AIProvider): Promise<number>;
    /**
     * List all stored tokens (metadata only, no sensitive data)
     */
    listTokens(): Promise<Array<{
        id: string;
        provider: AIProvider;
        label?: string;
        createdAt: Date;
        lastUsed?: Date;
        usageCount: number;
        expiresAt?: Date;
        scopes?: string[];
    }>>;
    /**
     * List providers that have stored tokens
     */
    getProviders(): Promise<AIProvider[]>;
    /**
     * Clear all tokens (destructive operation)
     */
    clearAllTokens(): Promise<boolean>;
    /**
     * Check token expiration and validity
     */
    validateToken(tokenId: string): Promise<'valid' | 'expired' | 'not_found'>;
    /**
     * Export tokens for backup (encrypted)
     */
    exportTokens(): Promise<string>;
    /**
     * Import tokens from backup
     */
    importTokens(exportData: string): Promise<number>;
    /**
     * Cleanup expired tokens
     */
    cleanupExpiredTokens(): Promise<number>;
    private generateStoreKey;
    private encryptToken;
    private decryptToken;
    private loadTokens;
    private saveTokens;
}
export declare const tokenManager: TokenManager;
