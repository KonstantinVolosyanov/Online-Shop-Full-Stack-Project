import crypto from "crypto";
import { Request } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { AuthenticationError } from "../4-models/client-errors";
import { IUserModel, UserModel } from "../4-models/user-model";


// Create secret key:
const secretKey = "4578-86 Students Are Amazing!";

function createNewToken(user: IUserModel): string {
  // Remove password:
  user.password = undefined;
  // Create container for the user object:
  const container = { user };
  // Create options:
  const options = { expiresIn: "3h" };
  // Create the token:
  const token = jwt.sign(container, secretKey, options);
  // Return token:
  return token;
}

async function verifyToken(request: Request): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      // Extract authorization header:
      const header = request.header("authorization");
      // If header missing:
      if (!header) {
        reject(new AuthenticationError("Invalid token"));
        return;
      }
      // Extract token:
      const token = header.substring(7);
      // If token missing:
      if (!token) {
        reject(new AuthenticationError("Invalid token"));
        return;
      }
      // Verify:
      jwt.verify(token, secretKey, async (err: JsonWebTokenError, decoded: any) => {
        if (err) {
          reject(new AuthenticationError("Invalid token"));
          return;
        }
        // Here the token must be valid:
        const user = await UserModel.findById(decoded.user._id);
        if (!user) {
          reject(new AuthenticationError("User not found"));
          return;
        }
        resolve(true);
      });
    } catch (err: any) {
      reject(err);
    }
  });
}

function getUserFromToken(request: Request): IUserModel {
  // Extract authorization header:
  const header = request.header("authorization");
  // Extract token
  const token = header.substring(7);
  // Decode user data
  const user: IUserModel = (jwt.decode(token) as any).user;
  // Return user
  return user;
}

async function verifyAdmin(request: Request): Promise<boolean> {
  await verifyToken(request);
  const user = getUserFromToken(request);
  const admin = await UserModel.findOne({ _id: user._id, role: "Admin" });
  return admin != null;
}

function hashPassword(plainText: string): string {
  if (!plainText) return null;
  const salt = "MakeThingsGoRight";
  const hashedPassword = crypto.createHmac("sha512", salt).update(plainText).digest("hex");
  return hashedPassword;
}

export default {
  createNewToken,
  verifyToken,
  hashPassword,
  getUserFromToken,
  verifyAdmin
};
