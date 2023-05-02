import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import "./MainMenu.css";
import { NavLink } from "react-router-dom";
import Login from "../../AuthArea/Login/Login";
import Register from "../../AuthArea/Register/Register";
import CartModel from "../../../Models/CartModel";
import cartServices from "../../../Services/CartServices";
import { request } from "http";
import Cart from "../Cart/Cart";




function MainMenu(): JSX.Element {

    //useState for user:
    const [user, setUser] = useState<UserModel>();
    const [cart, setCart] = useState<CartModel>()

    const navigate = useNavigate();

    // State for showing the RegisterStep1 component
    const [showRegister, setShowRegister] = useState(false);
    // State for showing the RegisterStep1 component
    const [showLogin, setShowLogin] = useState(false);

    //Define toggleShowRegisterStep1 function:
    const toggleShowRegister = () => {
        setShowRegister(!showRegister);
    }
    //Define toggleShowLogin function:
    const toggleShowLogin = () => {
        setShowLogin(!showLogin);
    }



    //useEffect and subscribe for user:
    useEffect(() => {
        setUser(authStore.getState().user);
        //Listen to authState changes:
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
        return unsubscribe;
    }, []);


    return (

        <div className="MainMenu" >
            {!user && <>
                {!user ? <Login toggleShowLogin={toggleShowLogin} /> : <Register toggleShowRegister={toggleShowRegister} />}
            </>
            }

            {user && user.role === "User" && <Cart />}

            {/* Show Admin links in menu if user.role = Admin */}
            {user && user.role === "Admin" && <>
                <NavLink to={"/list"}>List</NavLink>
                <NavLink to={"/admin/add"}>Add Product</NavLink>
            </>}

        </div>
    );
}

export default MainMenu;
