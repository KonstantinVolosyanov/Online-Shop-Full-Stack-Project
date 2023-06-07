import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import Login from "../../AuthArea/Login/Login";
import Register from "../../AuthArea/Register/Register";
import Cart from "../Cart/Cart";
import Order from "../Order/Order";
import "./MainMenu.css";

function MainMenu(): JSX.Element {
    //useState for user:
    const [user, setUser] = useState<UserModel>();
    // State for showing the RegisterStep1 component
    const [showRegister, setShowRegister] = useState(false);
    // State for showing the RegisterStep1 component
    const [showLogin, setShowLogin] = useState(false);
    //State for showing the Order
    const [showOrder, setShowOrder] = useState(false);
    //State for showing the Order
    const [showCart, setShowCart] = useState(true);

    //Define toggleShowRegisterStep1 function:
    const toggleShowRegister = () => {
        setShowRegister(!showRegister);
    }
    //Define toggleShowLogin function:
    const toggleShowLogin = () => {
        setShowLogin(!showLogin);
    }
    //Define toggleShowRegisterStep1 function:
    const toggleShowCart = () => {
        setShowCart(!showCart);
    }
    //Define toggleShowLogin function:
    const toggleShowOrder = () => {
        setShowOrder(!showOrder);
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
            {!user &&
                <>
                    {/* If not user: show Login or Register components */}
                    {!user ? <Login toggleShowLogin={toggleShowLogin} /> : <Register toggleShowRegister={toggleShowRegister} />}
                </>
            }

            {/* If user: show Cart or Order component */}
            {user && (
                <>
                    {user && user.role === "User" ? <Cart toggleShowCart={toggleShowCart} /> : <Order toggleShowOrder={toggleShowOrder} />}
                </>
            )}

            {/* If admin: Show Admin links in menu*/}
            {
                user && user.role === "Admin" && <>
                    {/* Product list */}
                    <NavLink to={"/list"}>List</NavLink>
                    {/* Add product */}
                    <NavLink to={"/admin/add"}>Add Product</NavLink>
                </>
            }

        </div >
    );
}

export default MainMenu;
