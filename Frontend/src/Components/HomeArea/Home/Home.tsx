import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import Login from "../../AuthArea/Login/Login";
import "./Home.css";
import Statistic from "../Statistic/Statistic";
import About from "../About/About";
import StartShopping from "../../ShoppingArea/MainMenu/MainMenu";
import ProductsList from "../../ProductsArea/ProductsList/ProductsList";
import MainMenu from "../../ShoppingArea/MainMenu/MainMenu";

function Home(): JSX.Element {

    // User UseState:
    const [user, setUser] = useState<UserModel>();

    //useNavigate:
    const navigate = useNavigate();

    //Set user and subscribe for changes:
    useEffect(() => {
        setUser(authStore.getState().user);
        //Listen to AuthState changes:
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
            if (!authStore.getState().user) {
                navigate("/login")
            }
        });
        return unsubscribe;
    }, []);

    return (
        <div className="Home">
            <About />
            <Statistic />
        </div>
    );
}

export default Home;
