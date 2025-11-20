// lib/apiClient.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in the environment variables.');
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}

export async function apiClient<T>(
  endpoint: string,
  {
    method = 'GET',
    headers = {},
    body,
    params
  }: RequestOptions = {}
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  // Attach query parameters for GET requests
  if (params && method === 'GET') {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, value)
    );
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(method !== 'GET' && body ? { body: JSON.stringify(body) } : {}),
  };

  try {
    const response = await fetch(url.toString(), fetchOptions);

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      console.log(`[API] ${method} request to: ${url.toString()}`);

      const errorBody = isJson ? await response.json() : await response.text();
      const errorMessage =
        typeof errorBody === 'string'
          ? errorBody
          : errorBody?.message || 'API request failed';

      throw new Error(errorMessage);
    }

    return isJson ? response.json() : ({} as T);
  } catch (error: any) {
    console.error(`[apiClient] ${method} ${url.toString()} failed:`, error);
    throw new Error(error.message || 'Unexpected API error');
  }
}
