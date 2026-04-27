/* eslint-disable @typescript-eslint/no-explicit-any */

import { getCookieValue } from "@/app/actions/cookies";

interface FetchOptions extends Omit<RequestInit, "method"> {
  params?: Record<string, string | number | boolean>;
  useCache?: boolean;
  token?: string;
}

interface ApiClientConfig {
  baseUrl?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api/v1";

// Core request function
const request = async <T = any>(
  endpoint: string,
  method: string,
  config: ApiClientConfig = {},
  options: FetchOptions = { useCache: false },
): Promise<T> => {
  const baseUrl = config.baseUrl || API_BASE_URL;

  const { params, headers = {}, body, token, ...fetchOptions } = options;

  // Build URL with query parameters
  let url = `${baseUrl}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  const requestHeaders: Record<string, string> = {};

  // Convert headers to Record<string, string> if it's a Headers object
  if (headers) {
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        requestHeaders[key] = value;
      });
    } else {
      Object.assign(requestHeaders, headers);
    }
  }

  // Get token from explicit option or secure cookie
  let authToken = token;
  if (!authToken) {
    authToken = (await getCookieValue("token")) || undefined;
  }

  if (authToken) {
    requestHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  // Check if body is FormData to avoid setting Content-Type
  const isFormData = body instanceof FormData;

  // Only set Content-Type for JSON bodies
  if (body && !isFormData && typeof body === "object") {
    requestHeaders["Content-Type"] = "application/json";
  }

  const requestConfig: RequestInit = {
    method,
    headers: requestHeaders,
    ...fetchOptions,
  };

  // Add body for non-GET requests
  if (body !== undefined && method !== "GET") {
    if (isFormData) {
      requestConfig.body = body as BodyInit;
    } else if (typeof body === "string") {
      requestConfig.body = body;
    } else {
      requestConfig.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(url, requestConfig);

    // Handle different response types
    const contentType = response.headers.get("content-type");
    let data: any;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else if (contentType?.includes("text/")) {
      data = await response.text();
    } else {
      data = response;
    }

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        data?.error ||
        `HTTP error! status: ${response.status}`;

      if (response.status === 401) {
        console.warn("Authentication required");
        // Optional: redirect to login if unauthorized
        // if (typeof window !== "undefined") {
        //   window.location.href = "/auth/login";
        // }
      }

      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${method} ${url}):`, error);
    throw error;
  }
};

// Create API client factory
export const createApiClient = (config: ApiClientConfig = {}) => {
  const clientConfig = {
    baseUrl: config.baseUrl || API_BASE_URL,
  };

  return {
    get: <T = any>(endpoint: string, options?: FetchOptions): Promise<T> =>
      request<T>(endpoint, "GET", clientConfig, options),

    post: <T = any>(
      endpoint: string,
      body?: any,
      options?: FetchOptions,
    ): Promise<T> =>
      request<T>(endpoint, "POST", clientConfig, { ...options, body }),

    put: <T = any>(
      endpoint: string,
      body?: any,
      options?: FetchOptions,
    ): Promise<T> =>
      request<T>(endpoint, "PUT", clientConfig, { ...options, body }),

    patch: <T = any>(
      endpoint: string,
      body?: any,
      options?: FetchOptions,
    ): Promise<T> =>
      request<T>(endpoint, "PATCH", clientConfig, { ...options, body }),

    delete: <T = any>(endpoint: string, options?: FetchOptions): Promise<T> =>
      request<T>(endpoint, "DELETE", clientConfig, options),
  };
};

// Default API client instance
export const api = createApiClient();
