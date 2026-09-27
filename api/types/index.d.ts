import { Request } from 'express';
import { Types, Document } from 'mongoose';

/**
 * Extended Express Request with Authenticated User Context
 */
export interface AuthenticatedUser {
  id: string;
  _id?: string;
  email?: string;
  username?: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

/**
 * Database Document Interfaces
 */
export interface IUserDocument extends Document {
  username: string;
  email: string;
  password: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IListingDocument extends Document {
  name: string;
  description: string;
  address: string;
  regularPrice: number;
  discountPrice: number;
  bathrooms: number;
  bedrooms: number;
  furnished: boolean;
  parking: boolean;
  type: 'sale' | 'rent';
  offer: boolean;
  imageUrls: string[];
  userRef: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversationDocument extends Document {
  participants: Types.ObjectId[];
  lastMessage: {
    text: string;
    sender: Types.ObjectId;
    seen: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessageDocument extends Document {
  conversationId: Types.ObjectId;
  sender: Types.ObjectId;
  text: string;
  seen: boolean;
  img?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Application Config Schema
 */
export interface AppConfig {
  env: string;
  isProduction: boolean;
  port: number;
  mongoUri: string;
  jwtSecret: string;
  geminiApiKey: string;
  clientOrigin: string[];
  cookie: {
    maxAge: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: boolean | 'lax' | 'strict' | 'none';
  };
}
