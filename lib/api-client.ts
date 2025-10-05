/**
 * Generated API Client SDK
 * HTTP REST API endpoints with full TypeScript types
 * 
 * Generated at: 2025-10-05T11:51:06.291Z
 */

// ═══════════════════════════════════════════════════════════════
// BASE TYPES
// ═══════════════════════════════════════════════════════════════

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
  requestId?: string;
}

// ═══════════════════════════════════════════════════════════════
// ENDPOINT-SPECIFIC TYPES
// ═══════════════════════════════════════════════════════════════

// System health check
export type HealthRequest = void;
export type HealthResponse = {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  version: string;
  uptime: number;
  services: {
  tarobase: {
  status: 'connected' | 'disconnected' | 'error';
  latency?: number | undefined;
};
  partyserver: {
  status: 'running' | 'starting' | 'error';
  activeConnections: number;
};
};
};

// Start a trading bot instance for the specified agent
export type StartAgentRequest = void;
export type StartAgentResponse = any;

// Stop a running trading bot instance
export type StopAgentRequest = void;
export type StopAgentResponse = any;

// Get real-time execution status for a trading bot
export type GetAgentStatusRequest = void;
export type GetAgentStatusResponse = any;

// Fetch trade history for a specific agent
export type GetAgentTradesRequest = void;
export type GetAgentTradesResponse = any;

// Validate agent configuration before saving
export type ValidateAgentRequest = void;
export type ValidateAgentResponse = any;

export interface ApiClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
  adminAuth?: {
    token: string;
    walletAddress: string;
  };
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ═══════════════════════════════════════════════════════════════
// HTTP API CLIENT
// ═══════════════════════════════════════════════════════════════

export class ApiClient {
  constructor(private config: ApiClientConfig) {}

  private async request<T>(
    method: string,
    path: string,
    body?: any,
    isAdminRoute?: boolean
  ): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.headers
    };

    // Add admin headers if this is an admin route and we have admin auth
    if (isAdminRoute && this.config.adminAuth) {
      headers['Authorization'] = `Bearer ${this.config.adminAuth.token}`;
      headers['X-Wallet-Address'] = this.config.adminAuth.walletAddress;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(this.config.timeout || 300000)
    });

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new ApiError(
        data.error?.code || 'UNKNOWN_ERROR',
        data.error?.message || 'An unknown error occurred',
        data.error?.details,
        response
      );
    }

    return data.data!;
  }

  /**
   * System health check
   * 
   * Retrieves comprehensive system health information including service status, uptime, and connectivity to external services like Tarobase. Use this endpoint to monitor system availability and diagnose potential issues before they affect users.
   * 
   * @auth Not required - No authentication required - publicly accessible for monitoring tools
   * @rateLimit 100 requests per 60 seconds
   * @usage Call this endpoint regularly (every 30-60 seconds) to monitor system health. A healthy system returns status="healthy" with all services showing positive status. Use this for health checks in load balancers and monitoring systems.
   * 
   * @tags system, monitoring
   * 
   */
  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>('GET', `/health`, false);
  }

  /**
   * Start a trading bot instance for the specified agent
   * 
   * Start a trading bot instance for the specified agent
   * 
   * @auth Required - Authentication needed
   * @rateLimit 10 requests per 60 seconds
   * 
   * 
   * @tags agents, trading
   * 
   */
  async startAgent(request?: any): Promise<any> {
    return this.request<any>('POST', `/agents/start`, request, false);
  }

  /**
   * Stop a running trading bot instance
   * 
   * Stop a running trading bot instance
   * 
   * @auth Required - Authentication needed
   * @rateLimit 10 requests per 60 seconds
   * 
   * 
   * @tags agents, trading
   * 
   */
  async stopAgent(request?: any): Promise<any> {
    return this.request<any>('POST', `/agents/stop`, request, false);
  }

  /**
   * Get real-time execution status for a trading bot
   * 
   * Get real-time execution status for a trading bot
   * 
   * @auth Required - Authentication needed
   * @rateLimit 60 requests per 60 seconds
   * 
   * 
   * @tags agents, monitoring
   * 
   */
  async getAgentStatus(id: string): Promise<any> {
    return this.request<any>('GET', `/agents/${id}/status`, false);
  }

  /**
   * Fetch trade history for a specific agent
   * 
   * Fetch trade history for a specific agent
   * 
   * @auth Required - Authentication needed
   * @rateLimit 30 requests per 60 seconds
   * 
   * 
   * @tags agents, history
   * 
   */
  async getAgentTrades(id: string): Promise<any> {
    return this.request<any>('GET', `/agents/${id}/trades`, false);
  }

  /**
   * Validate agent configuration before saving
   * 
   * Validate agent configuration before saving
   * 
   * @auth Required - Authentication needed
   * @rateLimit 30 requests per 60 seconds
   * 
   * 
   * @tags agents, validation
   * 
   */
  async validateAgent(request?: any): Promise<any> {
    return this.request<any>('POST', `/agents/validate`, request, false);
  }
}

// ═══════════════════════════════════════════════════════════════
// FACTORY AND EXPORTS
// ═══════════════════════════════════════════════════════════════

export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}

import { PARTYSERVER_URL } from '@/lib/config';

/**
 * Default API client instance
 */
export const api = createApiClient({
  baseUrl: `https://${PARTYSERVER_URL}`
});

/**
 * Create API client with admin authentication
 * This client automatically detects admin routes and adds auth headers
 * 
 * @example
 * ```typescript
 * import { useAuth } from '@tarobase/js-sdk';
 * 
 * const { user } = useAuth();
 * const authenticatedApi = createAuthenticatedApiClient({
 *   token: user?.idToken,
 *   walletAddress: user?.address
 * });
 * 
 * // Public routes work normally
 * const health = await authenticatedApi.health();
 * 
 * // Admin routes automatically include auth headers
 * const adminResult = await authenticatedApi.adminRoute();
 * ```
 */
export function createAuthenticatedApiClient(auth: { token: string; walletAddress: string }) {
  return createApiClient({
    baseUrl: `https://${PARTYSERVER_URL}`,
    adminAuth: {
      token: auth.token,
      walletAddress: auth.walletAddress
    }
  });
  }

// Named exports
export { createAuthenticatedApiClient as createAdminApiClient };

// Default export
export default api;
