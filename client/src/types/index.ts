/**
 * ==============================================================================
 * Core Domain Type Definitions for PrimeEstate Application
 * ==============================================================================
 */

// User & Authentication Entities
export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  currentUser: User | null;
  error: string | null;
  loading: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

// Property Listing Entities
export type PropertyType = 'sale' | 'rent';

export interface Listing {
  _id: string;
  name: string;
  description: string;
  address: string;
  regularPrice: number;
  discountPrice: number;
  bathrooms: number;
  bedrooms: number;
  furnished: boolean;
  parking: boolean;
  type: PropertyType;
  offer: boolean;
  imageUrls: string[];
  userRef: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateListingInput = Omit<Listing, '_id' | 'createdAt' | 'updatedAt' | 'userRef'>;
export type UpdateListingInput = Partial<CreateListingInput>;

export interface SearchFilterParams {
  searchTerm?: string;
  type?: PropertyType | 'all';
  parking?: boolean;
  furnished?: boolean;
  offer?: boolean;
  sort?: 'createdAt' | 'regularPrice' | 'updatedAt';
  order?: 'asc' | 'desc';
  startIndex?: number;
  limit?: number;
}

// Messaging & Real-Time Chat Entities
export interface Message {
  _id: string;
  conversationId: string;
  sender: string;
  text: string;
  seen: boolean;
  img?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationParticipant {
  _id: string;
  username: string;
  avatar: string;
}

export interface Conversation {
  _id: string;
  participants: ConversationParticipant[];
  lastMessage: {
    text: string;
    sender: string;
    seen: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SendMessagePayload {
  recipientId: string;
  message: string;
}

// AI Chatbot Entities
export interface ChatbotMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isFallback?: boolean;
}

export interface ChatbotRequest {
  message: string;
}

export interface ChatbotResponse {
  text: string;
  isFallback?: boolean;
}

// System & Operational Responses
export interface ApiResponse<T = unknown> {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded';
  service: string;
  environment: string;
  uptime: string;
  database: {
    state: 'connected' | 'connecting' | 'disconnected' | 'disconnecting' | 'unknown';
    isConnected: boolean;
  };
  system: {
    memoryRssMB: number;
    heapUsedMB: number;
    nodeVersion: string;
  };
  timestamp: string;
}
