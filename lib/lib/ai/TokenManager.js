"use strict";
/**
 * Secure Token Management for AI Assistant Integrations
 *
 * Provides secure storage, retrieval, and management of authentication tokens
 * for various AI assistant services. Uses encrypted storage and follows
 * security best practices.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenManager = exports.TokenManager = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const crypto = __importStar(require("crypto"));
/**
 * Encrypted token storage and management
 */
class TokenManager {
    constructor() {
        // Use user-specific directory for token storage
        const userDir = os.homedir();
        this.tokenFile = path.join(userDir, '.vibespec', 'tokens.enc');
        // Generate a consistent encryption key based on user/machine
        this.storeKey = this.generateStoreKey();
    }
    static getInstance() {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    }
    /**
     * Store a token securely
     */
    async storeToken(provider, token, metadata) {
        const allTokens = await this.loadTokens();
        // Generate unique ID
        const id = crypto.randomUUID();
        // Encrypt the token
        const { encrypted, iv } = this.encryptToken(token);
        const storedToken = {
            id,
            provider,
            encryptedToken: encrypted,
            iv,
            metadata: {
                ...metadata,
                provider,
                createdAt: new Date(),
                usageCount: 0
            }
        };
        allTokens.push(storedToken);
        await this.saveTokens(allTokens);
        return id;
    }
    /**
     * Retrieve a token and update usage metadata
     */
    async retrieveToken(tokenId) {
        const allTokens = await this.loadTokens();
        const tokenIndex = allTokens.findIndex(t => t.id === tokenId);
        if (tokenIndex === -1) {
            return null;
        }
        const storedToken = allTokens[tokenIndex];
        // Update usage metadata
        storedToken.metadata.lastUsed = new Date();
        storedToken.metadata.usageCount = (storedToken.metadata.usageCount || 0) + 1;
        await this.saveTokens(allTokens);
        // Decrypt and return token
        return this.decryptToken(storedToken.encryptedToken, storedToken.iv);
    }
    /**
     * Get token by provider (returns most recently used)
     */
    async getTokenByProvider(provider) {
        const allTokens = await this.loadTokens();
        const providerTokens = allTokens.filter(t => t.provider === provider);
        if (providerTokens.length === 0) {
            return null;
        }
        // Return most recently used token
        const recentToken = providerTokens.sort((a, b) => {
            const aTime = a.metadata.lastUsed?.getTime() || 0;
            const bTime = b.metadata.lastUsed?.getTime() || 0;
            return bTime - aTime;
        })[0];
        return this.retrieveToken(recentToken.id);
    }
    /**
     * Revoke/remove a token
     */
    async revokeToken(tokenId) {
        const allTokens = await this.loadTokens();
        const filteredTokens = allTokens.filter(t => t.id !== tokenId);
        if (filteredTokens.length < allTokens.length) {
            await this.saveTokens(filteredTokens);
            return true;
        }
        return false;
    }
    /**
     * Revoke all tokens for a provider
     */
    async revokeProviderTokens(provider) {
        const allTokens = await this.loadTokens();
        const remainingTokens = allTokens.filter(t => t.provider !== provider);
        const revokedCount = allTokens.length - remainingTokens.length;
        if (revokedCount > 0) {
            await this.saveTokens(remainingTokens);
        }
        return revokedCount;
    }
    /**
     * List all stored tokens (metadata only, no sensitive data)
     */
    async listTokens() {
        const allTokens = await this.loadTokens();
        return allTokens.map(token => ({
            id: token.id,
            provider: token.provider,
            label: token.metadata.label,
            createdAt: token.metadata.createdAt,
            lastUsed: token.metadata.lastUsed,
            usageCount: token.metadata.usageCount || 0,
            expiresAt: token.metadata.expiresAt,
            scopes: token.metadata.scopes
        }));
    }
    /**
     * List providers that have stored tokens
     */
    async getProviders() {
        const allTokens = await this.loadTokens();
        const providers = new Set(allTokens.map(t => t.provider));
        return Array.from(providers);
    }
    /**
     * Clear all tokens (destructive operation)
     */
    async clearAllTokens() {
        try {
            await fs.remove(this.tokenFile);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Check token expiration and validity
     */
    async validateToken(tokenId) {
        const allTokens = await this.loadTokens();
        const token = allTokens.find(t => t.id === tokenId);
        if (!token) {
            return 'not_found';
        }
        if (token.metadata.expiresAt && token.metadata.expiresAt < new Date()) {
            return 'expired';
        }
        return 'valid';
    }
    /**
     * Export tokens for backup (encrypted)
     */
    async exportTokens() {
        const allTokens = await this.loadTokens();
        const exportData = {
            exportDate: new Date().toISOString(),
            version: "1.0",
            tokens: allTokens
        };
        return JSON.stringify(exportData, null, 2);
    }
    /**
     * Import tokens from backup
     */
    async importTokens(exportData) {
        try {
            const data = JSON.parse(exportData);
            if (!data.tokens || !Array.isArray(data.tokens)) {
                throw new Error('Invalid export format');
            }
            const allTokens = await this.loadTokens();
            const importedTokens = data.tokens.map((token) => ({
                ...token,
                // Generate new ID to avoid conflicts
                id: crypto.randomUUID()
            }));
            allTokens.push(...importedTokens);
            await this.saveTokens(allTokens);
            return importedTokens.length;
        }
        catch (error) {
            throw new Error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Cleanup expired tokens
     */
    async cleanupExpiredTokens() {
        const allTokens = await this.loadTokens();
        const now = new Date();
        const validTokens = allTokens.filter(token => !token.metadata.expiresAt || token.metadata.expiresAt > now);
        const expiredCount = allTokens.length - validTokens.length;
        if (expiredCount > 0) {
            await this.saveTokens(validTokens);
        }
        return expiredCount;
    }
    // Private methods
    generateStoreKey() {
        // Create a stable key based on system properties
        // This ensures the same key is used across sessions for the same user
        const userId = os.userInfo().username;
        const hostname = os.hostname();
        const input = `${userId}:${hostname}:vibespec-tokens`;
        // Use PBKDF2 to derive a strong key
        return crypto.pbkdf2Sync(input, 'vibespec-salt', 10000, 32, 'sha256').toString('hex');
    }
    encryptToken(token) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipher('aes-256-cbc', this.storeKey);
        let encrypted = cipher.update(token, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return {
            encrypted,
            iv: iv.toString('hex')
        };
    }
    decryptToken(encryptedToken, iv) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', this.storeKey, Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    async loadTokens() {
        try {
            await fs.ensureDir(path.dirname(this.tokenFile));
            const data = await fs.readFile(this.tokenFile, 'utf8');
            const parsed = JSON.parse(data);
            // Validate structure
            if (!Array.isArray(parsed)) {
                throw new Error('Invalid token store format');
            }
            // Type check and clean up data
            return parsed.map(token => ({
                ...token,
                metadata: {
                    ...token.metadata,
                    createdAt: new Date(token.metadata.createdAt),
                    lastUsed: token.metadata.lastUsed ? new Date(token.metadata.lastUsed) : undefined,
                    expiresAt: token.metadata.expiresAt ? new Date(token.metadata.expiresAt) : undefined
                }
            }));
        }
        catch (error) {
            // If file doesn't exist or is corrupted, return empty array
            return [];
        }
    }
    async saveTokens(tokens) {
        await fs.ensureDir(path.dirname(this.tokenFile));
        await fs.writeFile(this.tokenFile, JSON.stringify(tokens, null, 2));
    }
}
exports.TokenManager = TokenManager;
// Export singleton instance
exports.tokenManager = TokenManager.getInstance();
