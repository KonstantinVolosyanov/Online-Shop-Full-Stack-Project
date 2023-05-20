import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import About from "../About/About";
import Statistic from "../Statistic/Statistic";
import "./Home.css";

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
                navigate("/home")
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
