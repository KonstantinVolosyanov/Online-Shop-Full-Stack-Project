import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartModel from "../../../Models/CartModel";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import cartServices from "../../../Services/CartServices";
import "./Cart.css";
import notify from "../../../Utils/Notify";

function Cart(): JSX.Element {

    //User state:
    const [user, setUser] = useState<UserModel>();
    // User UseEffect
    useEffect(() => {
        // If not user - navigate to login:
        if (!authStore.getState().user) {
            navigate("/login")
        }
        setUser(authStore.getState().user);
        // Listen to AuthState changes + unsubscribe:
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    //Cart state:
    const [cart, setCart] = useState<CartModel>();
    const [hasCart, setHasCart] = useState(false);
    //Cart useEffect:
    useEffect(() => {
        cartServices.getCartByUser()
            .then(dbCart => {
                setCart(dbCart);
                setHasCart(Boolean(dbCart))
            })
            .catch(err => notify.error(err))
    }, []);

    const navigate = useNavigate()

    async function startShopping() {
        const existingCart = await cartServices.getCartByUser()
        setCart(existingCart);
        if (!cart) {
            const cart = await cartServices.createCart();
            setCart(cart);
        }
    }

    //Delete my cart function
    async function deleteMyCart() {
        try {
            if (!window.confirm("Are you sure?")) return;
            await cartServices.deleteCart(cart._id);
            setCart(null);
            notify.success("Your cart is deleted");
        } catch (err: any) {
            notify.error(err);
        }
    }

    //Format date & Time:
    function formatDateTime(dateTimeString: string): string {
        const dateTime = new Date(dateTimeString);
        const day = dateTime.getDate().toString().padStart(2, '0');
        const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
        const year = dateTime.getFullYear().toString();
        const hours = dateTime.getHours().toString().padStart(2, '0');
        const minutes = dateTime.getMinutes().toString().padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    return (
        <div className="Cart">
            <div>
                {user && user.role === "User" && (
                    <>
                        {hasCart ? (
                            <button onClick={() => { navigate("/list"); }}>Continue Shopping</button>
                        ) : (
                            <button onClick={() => { startShopping(); navigate("/list"); }}>Start Shopping</button>
                        )}
                        {hasCart &&
                            <button onClick={deleteMyCart}>❌</button>
                        }
                    </>
                )}

            </div>

            <div>
                {cart && (
                    <>
                        <h2>My Cart:</h2>
                        <p>User id: {cart.userId}</p>
                        <p>Date created: {formatDateTime(cart.dateTime)}</p>
                        <p>Total Price: {cart.totalPrice}</p>
                    </>
                )}
            </div>
        </div >
    );
}

export default Cart;
