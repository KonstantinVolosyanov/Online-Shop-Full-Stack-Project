import { useEffect, useState } from "react";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import Login from "../../AuthArea/Login/Login";
import Register from "../../AuthArea/Register/Register";
import Home from "../../HomeArea/Home/Home";
import MainMenu from "../../ShoppingArea/MainMenu/MainMenu";
import Header from "../Header/Header";
import Routing from "../Routing/Routing";
import "./Layout.css";

function Layout(): JSX.Element {
    //User setState:
    const [user, setUser] = useState<UserModel>();

    // // State for showing the RegisterStep1 component
    // const [showRegister, setShowRegister] = useState(false);
    // // State for showing the RegisterStep1 component
    // const [showLogin, setShowLogin] = useState(false);

    // //Define toggleShowRegisterStep1 function:
    // const toggleShowRegister = () => {
    //     setShowRegister(!showRegister);
    // }
    // //Define toggleShowLogin function:
    // const toggleShowLogin = () => {
    //     setShowLogin(!showLogin);
    // }

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
                {/* {!user && <>
                    <MainMenu /> 
                    {!user ? <Login toggleShowLogin={toggleShowLogin} /> : <Register toggleShowRegister={toggleShowRegister} />}
                </>}
                {user && <MainMenu />} */}
                <MainMenu />
            </menu>

            <main>
                <Routing />
            </main>
        </div>
    );
}

export default Layout;
