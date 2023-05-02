import jwtDecode from "jwt-decode";
import { createStore } from "redux";
import  {UserModel}  from "../Models/UserModel";

// 1. Global State
export class AuthState {
    
    public token: string = null;
    public user: UserModel = null;

    // Load back the token from storage if exists:
    public constructor() {
        this.token = localStorage.getItem("token");
        if(this.token) {
            const userContainer = jwtDecode<{ user: UserModel }>(this.token);
            this.user = userContainer.user;
        }
    }
}

// 2. Action Type
export enum AuthActionType {
    Register = "Register",
    Login = "Login",
    Logout = "Logout"
}

// 3. Action
export interface AuthAction {
    type: AuthActionType;
    payload?: string; // the string is because we're getting a token, the ? is because logout sends nothing.
}

// 4. Reducer
export function authReducer(currentState = new AuthState(), action: AuthAction): AuthState {

    const newState = { ...currentState };

    switch (action.type) {

        case AuthActionType.Register: // Here the payload is the token (string)
        case AuthActionType.Login:
            newState.token = action.payload;
            const userContainer = jwtDecode<{ user: UserModel }>(newState.token);
            newState.user = userContainer.user;
            localStorage.setItem("token", newState.token); // Save token to storage for persisting token after refresh
            break;

        case AuthActionType.Logout:
            newState.token = null;
            newState.user = null;
            localStorage.removeItem("token"); // Remove token when logged out
            break;

    }

    return newState;
}

// 5. Store
export const authStore = createStore(authReducer);
