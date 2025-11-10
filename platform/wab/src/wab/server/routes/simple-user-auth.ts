import { Request, Response } from "express";
import { ensureType } from "@/wab/shared/common";
import { superDbMgr } from "@/wab/server/routes/util";
import { User } from "@/wab/server/entities/Entities";
import { generateUserJwtToken } from "@/wab/server/auth/jwt-auth";
import {
  JwtPayload,
  generateUserJwtToken as originalGenerateUserJwtToken,
} from "@/wab/server/auth/jwt-auth";
import jwt from "jsonwebtoken";
import { getEncryptionKey } from "@/wab/server/secrets";
import { ApiUser } from "@/wab/shared/ApiSchema";
import { BadRequestError, NotFoundError } from "@/wab/shared/ApiErrors/errors";

// Request interface for creating a user with just an ID
interface CreateUserRequest {
  id: string;
}

// Response interface for user creation
interface CreateUserResponse {
  user: ApiUser;
  token: string;
}

// Request interface for getting user by ID
interface GetUserByIdRequest {
  id: string;
}

// Response interface for getting user by ID
interface GetUserByIdResponse {
  user: ApiUser;
}

/**
 * Creates a new user with just an ID (no email, password, first name, or last name required)
 */
export async function createUserWithIdOnly(req: Request, res: Response) {
  const { id } = req.body as CreateUserRequest;
  
  if (!id) {
    throw new BadRequestError("ID is required to create a user");
  }

  const mgr = superDbMgr(req);

  // Check if user already exists
  const existingUser = await mgr.tryGetUserById(id);
  if (existingUser) {
    // If user already exists, return existing user with a new token
    const token = generateUserJwtToken(id, existingUser.email || `${id}@example.com`, existingUser.firstName || "User", existingUser.lastName || "ID");
    res.json({
      user: existingUser,
      token: token,
    } as CreateUserResponse);
    return;
  }

  // Create a new user with just the ID, using placeholder values for required fields
  const email = `${id}@example.com`; // Generate a placeholder email
  const firstName = "User"; // Default first name
  const lastName = "ID"; // Default last name

  try {
    // Create user with the provided ID
    const user = await mgr.createUser({
      id: id as any, // Force the ID to be used
      email,
      firstName,
      lastName,
      needsTeamCreationPrompt: false, // Skip team creation prompt
      // Set default values for other required fields
    });

    // Generate a JWT token for the new user
    const token = generateUserJwtToken(user.id, user.email, user.firstName, user.lastName);

    res.json({
      user: user,
      token: token,
    } as CreateUserResponse);
  } catch (error) {
    console.error("Error creating user with ID:", error);
    throw error;
  }
}

/**
 * Retrieves a user by their ID
 */
export async function getUserById(req: Request, res: Response) {
  const { id } = req.params as unknown as GetUserByIdRequest;
  
  if (!id) {
    throw new BadRequestError("ID is required to get a user");
  }

  const mgr = superDbMgr(req);

  try {
    const user = await mgr.tryGetUserById(id);
    
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    res.json({
      user: user,
    } as GetUserByIdResponse);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
}

/**
 * Authenticates a user by their ID and returns a JWT token
 */
export async function authenticateUserById(req: Request, res: Response) {
  const { id } = req.body as GetUserByIdRequest;
  
  if (!id) {
    throw new BadRequestError("ID is required for authentication");
  }

  const mgr = superDbMgr(req);

  try {
    const user = await mgr.tryGetUserById(id);
    
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    // Generate a JWT token for the existing user
    const token = generateUserJwtToken(user.id, user.email, user.firstName, user.lastName);

    res.json({
      user: user,
      token: token,
    } as CreateUserResponse);
  } catch (error) {
    console.error("Error authenticating user by ID:", error);
    throw error;
  }
}