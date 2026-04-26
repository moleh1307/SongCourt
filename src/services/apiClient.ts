export type ApiMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

export type ApiRequestOptions<Body = unknown> = {
  method?: ApiMethod;
  body?: Body;
  token?: string;
};

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: unknown,
  ) {
    super(message);
  }
}

export const apiClient = {
  async request<Response, Body = unknown>(path: string, options: ApiRequestOptions<Body> = {}): Promise<Response> {
    if (!API_BASE_URL) {
      throw new ApiClientError('SongCourt API is not configured for this build.');
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      let details: unknown;
      try {
        details = await response.json();
      } catch {
        try {
          details = await response.text();
        } catch {
          details = undefined;
        }
      }
      throw new ApiClientError('SongCourt API request failed.', response.status, details);
    }

    return response.json() as Promise<Response>;
  },
};

export const futureApiEndpoints = {
  spotifyStart: '/auth/spotify/start',
  spotifySession: '/auth/spotify/session',
  spotifyDisconnect: '/auth/spotify/disconnect',
  spotifySnapshot: '/spotify/snapshot',
  spotifyCallback: '/auth/spotify/callback',
  me: '/me',
  generateTrial: '/trial/generate',
  verdicts: '/verdicts',
  verdictById: (id: string) => `/verdicts/${id}`,
  renderShareCard: '/share-card/render',
};
