import { env } from './env';

/**
 * Type-safe API client for backend communication.
 * Handles JSON serialization, error handling, and response parsing.
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = env.NEXT_PUBLIC_API_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Perform a GET request
   */
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${path}`
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * Perform a POST request
   */
  async post<T>(path: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${path}`
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * Perform a PUT request
   */
  async put<T>(path: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${path}`
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * Perform a DELETE request
   */
  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${path}`
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * Check backend health status
   */
  async checkHealth(): Promise<{ status: string }> {
    return this.get<{ status: string }>('/health');
  }
}

/**
 * Singleton API client instance
 */
export const api = new ApiClient();
