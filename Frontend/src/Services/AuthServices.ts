import axios from "axios";
import appConfig from "../Utils/AppConfig";
import CredentialsModel from "../Models/CredentialsModel";
import {UserModel} from "../Models/UserModel";
import { AuthActionType, authStore } from "../Redux/AuthState";
// import { VacationsActionType, vacationsStore } from "../Redux/VacationsState";

class AuthServices {
    // Register:
    public async register(user: UserModel): Promise<void> {
        // Send user to backend:
        const response = await axios.post<string>(appConfig.registerUrl, user);
        // Get the returned token:
        const token = response.data;
        // console.log(token);
        // let products = productsStore.getState().vacations;
        // Send token to global state:
        authStore.dispatch({ type: AuthActionType.Register, payload: token });
    }

    // Login:
    public async login(credentials: CredentialsModel): Promise<void> {
        // Send credentials to backend:
        const response = await axios.post<string>(appConfig.loginUrl, credentials);
        // Get the returned token:
        const token = response.data;
        // Send token to global state:
        authStore.dispatch({ type: AuthActionType.Login, payload: token });
    }

    // Logout:
    public logout(): void {
        authStore.dispatch({ type: AuthActionType.Logout });
        // Empty vacationStore on logout:
        // productsStore.dispatch({ type: ProductsActionType.FetchVacations, payload: [] })
    }

    // Is user logged in:
    public isLoggedIn(): boolean {
        return authStore.getState().token !== null;
    }
}

const authServices = new AuthServices();
export default authServices;
