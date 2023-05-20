import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartModel from "../../../Models/CartModel";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import cartServices from "../../../Services/CartServices";
import "./Cart.css";
import notify from "../../../Utils/Notify";
import CartProductModel from "../../../Models/CartProductModel";
import ProductModel from "../../../Models/ProductModel";
import { log } from "console";
import AppConfig from "../../../Utils/AppConfig";



function Cart(): JSX.Element {

    //useNavigate
    const navigate = useNavigate()

    //User useState:
    const [user, setUser] = useState<UserModel>();

    // User UseEffect
    useEffect(() => {
        // If not user - navigate to login:
        if (!authStore.getState().user) {
            navigate("/home")
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

    //CartProducts state:
    const [cartProducts, setCartProducts] = useState<CartProductModel[]>([]);

    //CartProducts useEffect:
    useEffect(() => {
        if (cart) {
            cartServices.getAllProductsInCart(cart._id)
                .then(dbCartProducts => setCartProducts(dbCartProducts))
                .catch(err => notify.error(err))
        }
    }, [cart]);

    //Has cart useState:
    const [hasCart, setHasCart] = useState<boolean>(false);

    //Show Cart useState:
    const [showCart, setShowCart] = useState<boolean>(false);

    //Cart useEffect:
    useEffect(() => {
        cartServices.getCartByUser()
            .then(dbCart => {
                setCart(dbCart);
                setHasCart(Boolean(dbCart))
            })
            .catch(err => notify.error(err))
    }, [cart]);

    //Start shopping function: 
    async function startShopping() {
        // Check if there's an existing cart for the user
        const existingCart = await cartServices.getCartByUser();
        // If there's an existing cart, set it as the actual cart and show it:
        if (existingCart) {
            setCart(existingCart);
            setShowCart(true);
            setHasCart(true);
        } else {
            // If there's no existing cart, create a new one, set it as the actual cart and show it:
            const newCart = await cartServices.createCart();
            setCart(newCart);
            setShowCart(true);
            setHasCart(true);
        }
    }

    //Show cart function:
    function showCartFunction() {
        setShowCart(true);
    }

    //Delete my cart function
    async function deleteMyCart() {
        try {
            if (!window.confirm("Are you sure you want to delete your cart?")) return;
            await cartServices.deleteCart(cart._id);
            setCart(null);
            setHasCart(false);
            setShowCart(false);
            notify.success("Your cart is deleted");
            navigate("/")
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

    async function handleAddOneToAmount(productId: string) {
        try {
            await cartServices.addProductToCart(productId, cart)
        } catch (err: any) {
            notify.error(err)
        }
    }

    async function handleRemoveOneFromAmount(productId: string) {
        try {
            console.log(productId);

            await cartServices.subtractProductFromCart(productId, cart)

        } catch (err: any) {
            notify.error(err)
        }
    }

    return (
        <div className="Cart">
            <div>
                {/* If user: show cart options */}
                {user && user.role === "User" && (
                    <>
                        {/* If already have a cart: show "Continue shopping" button and "Delete cart" button */}
                        {hasCart && <>
                            <h3>You have an open cart</h3>
                            <button onClick={() => { showCartFunction(); navigate("/list"); }}>🛒 Continue Shopping</button>
                            <button onClick={deleteMyCart}>❌ Delete Cart</button>
                        </>
                        }
                        {!hasCart && <>
                            <h3>Create a shopping cart</h3>
                            <button onClick={() => { startShopping(); navigate("/list"); }}>🛒 Start Shopping</button></>}
                    </>
                )}
            </div>

            <div>
                {showCart &&
                    <>
                        <h2>My Cart:</h2>
                        <p>Your Id: {cart.userId}</p>
                        <p>Date created: {formatDateTime(cart.dateTime)}</p>
                        {cartProducts.map((c) => (
                            <div key={c._id}>
                                <img className="Thumbnail" src={AppConfig.imagesUrl + c.imageName} />
                                <p>
                                    {c.name} | {c.amountInCart} | {c.amountPrice} ₪
                                </p>
                                <button onClick={() => handleAddOneToAmount(c.productId)}>➕</button>
                                <button onClick={() => handleRemoveOneFromAmount(c._id)}>➖</button>
                            </div>
                        ))
                        }


                        <p>Total Price: {cart.totalPrice}</p>
                        <button>Order</button>
                    </>
                }
            </div>
        </div >
    );
}

export default Cart;
