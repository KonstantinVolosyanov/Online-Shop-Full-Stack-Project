import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CartModel from "../../../Models/CartModel";
import CartProductModel from "../../../Models/CartProductModel";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import cartServices from "../../../Services/CartServices";
import AppConfig from "../../../Utils/AppConfig";
import notify from "../../../Utils/Notify";
import "./Cart.css";
import Order from "../Order/Order";

type CartProps = {
    toggleShowCart: () => void;
}

function Cart(props: CartProps): JSX.Element {

    //Show order useState:
    const [showOrder, setShowOrder] = useState<boolean>(false);

    const location = useLocation();

    //Cart state:
    const [cart, setCart] = useState<CartModel>();

    //useNavigate
    const navigate = useNavigate()

    //User useState ================================================================================
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


    //CartProducts state ==========================================================================
    const [cartProducts, setCartProducts] = useState<CartProductModel[]>([]);

    //CartProducts useEffect:
    useEffect(() => {
        if (cart) {
            cartServices.getAllProductsInCart(cart._id)
                .then(dbCartProducts => setCartProducts(dbCartProducts))
                .catch(err => notify.error(err))
        }
    }, [cart]);

    //Has cart useState ==========================================================================
    const [hasCart, setHasCart] = useState<boolean>(false);

    //Cart useEffect:
    useEffect(() => {
        cartServices.getCartByUser()
            .then(dbCart => {
                setCart(dbCart);
                setHasCart(Boolean(dbCart))
            })
            .catch(err => notify.error(err))
    }, [cart]);

    //Start shopping function ======================================================================
    async function startShopping() {
        // Check if there's an existing cart for the user
        const existingCart = await cartServices.getCartByUser();
        // If there's an existing cart, set it as the actual cart and show it:
        if (existingCart) {
            setCart(existingCart);
            setHasCart(true);
        } else {
            // If there's no existing cart, create a new one, set it as the actual cart and show it:
            const newCart = await cartServices.createCart();
            setCart(newCart);
            setHasCart(true);
        }
    }

    //Delete my cart function ======================================================================
    async function deleteMyCart() {
        try {
            if (!window.confirm("Are you sure you want to delete your cart?")) return;
            await cartServices.deleteCart(cart._id);
            setCart(null);
            setHasCart(false);
            notify.success("Your cart is deleted");
            navigate("/")
        } catch (err: any) {
            notify.error(err);
        }
    }

    //Format date & Time =============================================================================
    function formatDateTime(dateTimeString: string): string {
        const dateTime = new Date(dateTimeString);
        const day = dateTime.getDate().toString().padStart(2, '0');
        const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
        const year = dateTime.getFullYear().toString();
        const hours = dateTime.getHours().toString().padStart(2, '0');
        const minutes = dateTime.getMinutes().toString().padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    // Handle +1/-1 to cart ==============================================================================
    async function handleAddOneToAmount(productId: string) {
        try {
            await cartServices.addProductToCart(productId, cart)
        } catch (err: any) {
            notify.error(err)
        }
    }

    async function handleRemoveOneFromAmount(productId: string) {
        try {
            await cartServices.subtractProductFromCart(productId, cart)
        } catch (err: any) {
            notify.error(err)
        }
    }

    // Show order 
    function toggleShowOrder() {
        setShowOrder((prevShowOrder) => !prevShowOrder);
        navigate("/order/form")

    }
    // Hide Continue shopping button:
    const [hideButton, setHideButton] = useState<boolean>(false);

    useEffect(() => {
        if (location.pathname === "/list" || location.pathname === "/order/form" && !showOrder) {
            setHideButton(true);
        } else {
            setHideButton(false);
        }
    }, [location.pathname, showOrder]);

    function handleContinueShopping() {
        navigate("/list");
    }

    // Disable Order Button:
    const disableOrderButton = cartProducts.length === 0;


    return (
        <div className="Cart">
            <div>
                {/* If user: show cart options */}
                {user && user.role === "User" && !hasCart && (
                    <>
                        <button className="CreateCartButton" onClick={() => { startShopping(); navigate("/list"); }}>Create a shopping cart</button>
                    </>)}

                {!hideButton && hasCart && !showOrder && (<button className="ContinueShoppingButton" onClick={handleContinueShopping}>Continue Shopping</button>)}
                {!showOrder ? (cart &&
                    <>
                        {/* <button className="DeleteCartButton" onClick={deleteMyCart}>X</button> */}
                        <p>Name: <span className="BoldText">{user.firstName} {user.lastName}</span></p>
                        <p>Id: <span className="BoldText">{cart.userId}</span></p>
                        <p>Date created: {formatDateTime(cart.dateTime)}</p>
                        <hr></hr>
                        <h3 className="HasCartGreen">You have an open cart:</h3>
                        <hr></hr>
                        <div className="CartProductsList">
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th className="SmallText">NAME </th>
                                        <th className="SmallText">PTS. </th>
                                        <th className="SmallText">PRICE </th>
                                        <th>+/-</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartProducts.map(c =>
                                        <tr key={c._id}>
                                            <td><img className="Thumbnail" src={AppConfig.imagesUrl + c.imageName} /></td>
                                            <td className="MediumText, TableName">{c.name}</td>
                                            <td className="MediumText, TableAmount">{c.amountInCart}</td>
                                            <td className="MediumText,">{c.amountPrice} ₪</td>
                                            <td>
                                                <button className="AddDelete" onClick={() => handleAddOneToAmount(c.productId)}>+</button>
                                                <button className="AddDelete" onClick={() => handleRemoveOneFromAmount(c._id)}>-</button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody >
                            </table>
                        </div>
                        <br />
                        <p className="TotalPrice">Total Price: {cart.totalPrice} ₪</p>

                        <button className="OrderButton" onClick={toggleShowOrder} disabled={disableOrderButton}>Order</button>
                        <button className="DeleteButton" onClick={deleteMyCart}>Delete</button>
                    </>
                ) : (
                    <Order toggleShowOrder={toggleShowOrder} />
                )}
            </div>
        </div >
    );
}

export default Cart;
