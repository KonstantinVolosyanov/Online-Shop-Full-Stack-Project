import cyber from '../2-utils/cyber';
import { AuthenticationError, ValidationError } from '../4-models/client-errors';
import { ICredentialsModel, CredentialsModel } from '../4-models/credentials-model';
import { IUserModel, UserModel } from "../4-models/user-model";

// Register:
async function register(user: IUserModel): Promise<string> {
    // Validation
    user.validateSync();
    // If email taken:
    if (await isEmailTaken(user.email)) throw new ValidationError(`Email ${user.email} already taken`);
    // If id number taken:
    if (await isIdNumberTaken(user.idNumber)) throw new ValidationError(`Id number ${user.idNumber} already taken`);
    // New user is a user role:
    user.role = "User";
    // Hash password
    user.password = cyber.hashPassword(user.password);
    // Add to database:
    const result = user.save();
    // Set back id:
    user._id = (await result)._id
    // Create token
    const token = cyber.createNewToken(user);
    // Return token
    return token;
}

// Login:
async function login(credentials: ICredentialsModel): Promise<string> {
    // Validation:
    credentials.validateSync();
    // Hash password:
    credentials.password = cyber.hashPassword(credentials.password);
    // Execute query:
    const user = UserModel.findOne({ email: credentials.email, password: credentials.password });
    // If credentials are wrong:
    if (!user) throw new AuthenticationError("Incorrect email or password");
    // Create token: 
    const token = cyber.createNewToken(await user);
    // Return token:
    return token;
}

//---------------------------------------------------------------------------------------------------------------------------

// Check if Email taken:
async function isEmailTaken(email: string): Promise<boolean> {
    // Create query:
    const emailQuery = { email };
    // Execute query:
    const emailCount = UserModel.countDocuments(emailQuery)
    // Return if found:
    return await emailCount > 0;
}

//Check if Id number taken:
async function isIdNumberTaken(idNumber: string): Promise<boolean> {
    // Create query:
    const idNumberQuery = { idNumber }
    // Execute query:
    const idNumberCount = UserModel.countDocuments(idNumberQuery);
    // Return if found:
    return await idNumberCount > 0;
}

export default {
    register,
    login
};