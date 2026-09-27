import {
  User,
  Listing,
  CreateListingInput,
  UpdateListingInput,
  SearchFilterParams,
  Conversation,
  Message,
  SendMessagePayload,
  ChatbotResponse,
  HealthCheckResponse,
  SignInCredentials,
  SignUpCredentials,
} from '../types';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include', // Includes HttpOnly JWT cookie automatically
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data as T;
  }

  // ---------------------------------------------------------------------------
  // Authentication API
  // ---------------------------------------------------------------------------
  public auth = {
    signIn: (credentials: SignInCredentials) =>
      this.request<User>('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    signUp: (credentials: SignUpCredentials) =>
      this.request<{ success: boolean; message: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    googleAuth: (payload: { name: string; email: string; photo: string }) =>
      this.request<User>('/auth/google', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    signOut: () =>
      this.request<{ success: boolean; message: string }>('/auth/signout', {
        method: 'GET',
      }),
  };

  // ---------------------------------------------------------------------------
  // Property Listings API
  // ---------------------------------------------------------------------------
  public listings = {
    getListings: (params: SearchFilterParams = {}) => {
      const query = new URLSearchParams();
      if (params.searchTerm) query.set('searchTerm', params.searchTerm);
      if (params.type && params.type !== 'all') query.set('type', params.type);
      if (params.parking !== undefined) query.set('parking', String(params.parking));
      if (params.furnished !== undefined) query.set('furnished', String(params.furnished));
      if (params.offer !== undefined) query.set('offer', String(params.offer));
      if (params.sort) query.set('sort', params.sort);
      if (params.order) query.set('order', params.order);
      if (params.startIndex !== undefined) query.set('startIndex', String(params.startIndex));
      if (params.limit !== undefined) query.set('limit', String(params.limit));

      const queryString = query.toString();
      return this.request<Listing[]>(`/listing/get${queryString ? `?${queryString}` : ''}`);
    },

    getById: (id: string) => this.request<Listing>(`/listing/get/${id}`),

    create: (listing: CreateListingInput) =>
      this.request<Listing>('/listing/create', {
        method: 'POST',
        body: JSON.stringify(listing),
      }),

    update: (id: string, listing: UpdateListingInput) =>
      this.request<Listing>(`/listing/update/${id}`, {
        method: 'POST',
        body: JSON.stringify(listing),
      }),

    delete: (id: string) =>
      this.request<{ success: boolean; message: string }>(`/listing/delete/${id}`, {
        method: 'DELETE',
      }),
  };

  // ---------------------------------------------------------------------------
  // Messaging & Real-Time Chat API
  // ---------------------------------------------------------------------------
  public messages = {
    getConversations: () => this.request<Conversation[]>('/messages/conversations'),

    getThread: (otherUserId: string) => this.request<Message[]>(`/messages/${otherUserId}`),

    send: (payload: SendMessagePayload) =>
      this.request<Message>('/messages', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  };

  // ---------------------------------------------------------------------------
  // AI Chatbot Assistant API
  // ---------------------------------------------------------------------------
  public chatbot = {
    ask: (message: string) =>
      this.request<ChatbotResponse>('/chatbot/ask', {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),
  };

  // ---------------------------------------------------------------------------
  // Health & Monitoring API
  // ---------------------------------------------------------------------------
  public health = {
    check: () => this.request<HealthCheckResponse>('/health'),
  };
}

export const api = new ApiClient();
export default api;
