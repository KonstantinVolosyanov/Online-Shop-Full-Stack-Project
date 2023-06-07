import { useEffect, useState } from "react";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import MainMenu from "../../ShoppingArea/MainMenu/MainMenu";
import Header from "../Header/Header";
import Routing from "../Routing/Routing";
import "./Layout.css";

function Layout(): JSX.Element {
    //User setState:
    const [user, setUser] = useState<UserModel>();

    //useEffect for user and subscribe:
    useEffect(() => {
        setUser(authStore.getState().user);
        //Listen to autState changes and unsubscribe:
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        })
        return unsubscribe;
    }, [])

    return (
        <div className="Layout">

            <header>
                <Header />
                <AuthMenu />
            </header>

            <menu>
                <MainMenu />
            </menu>

            <main>
                <Routing />
            </main>
        </div>
    );
}

export default Layout;
