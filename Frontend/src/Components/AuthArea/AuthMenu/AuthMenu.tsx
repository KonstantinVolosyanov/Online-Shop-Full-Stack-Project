import { useEffect, useState } from "react";
import { UserModel } from "../../../Models/UserModel";
import "./AuthMenu.css";
import authServices from "../../../Services/AuthServices";
import { authStore } from "../../../Redux/AuthState";
import { NavLink } from "react-router-dom";

function AuthMenu(): JSX.Element {

    //useState for user:
    const [user, setUser] = useState<UserModel>();

    //useEffect and subscribe for user:
    useEffect(() => {
        setUser(authStore.getState().user);
        //Listen to authState changes:
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    //Logout function:
    function logout(): void {
        authServices.logout();
    }

    return (
        <div className="AuthMenu">
            {/* If not user */}
            {!user && <>
                <span className="UserName">Hello Guest</span>
            </>}

            {/* If user: */}
            {user && <>
                <span>Hello {user.firstName} {user.lastName}<span className="Pipe"> | </span></span>
                <NavLink to={"/home"} onClick={logout}>Logout</NavLink>
            </>}
        </div>
    );
}

export default AuthMenu;
