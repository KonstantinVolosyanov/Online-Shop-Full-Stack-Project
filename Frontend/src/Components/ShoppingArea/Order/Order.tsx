import { useNavigate } from "react-router-dom";
import "./Order.css";
import { useEffect, useState } from "react";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import CartModel from "../../../Models/CartModel";
import CartProductModel from "../../../Models/CartProductModel";
import cartServices from "../../../Services/CartServices";
import notify from "../../../Utils/Notify";
import AppConfig from "../../../Utils/AppConfig";
import Cart from "../Cart/Cart";

type OrderProps = {
    toggleShowOrder: () => void;
}

function Order(props: OrderProps): JSX.Element {

    //useNavigate
    const navigate = useNavigate()
    //User useState:
    const [user, setUser] = useState<UserModel>();
    //Cart state:
    const [cart, setCart] = useState<CartModel>();
    //Show Cart state:
    const [showCart, setShowCart] = useState<boolean>(false);
    //CartProducts state:
    const [cartProducts, setCartProducts] = useState<CartProductModel[]>([]);
    //Has cart useState:
    const [hasCart, setHasCart] = useState<boolean>(false);


    // User UseEffect ==========================================================================
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

    //CartProducts useEffect:
    useEffect(() => {
        if (cart) {
            cartServices.getAllProductsInCart(cart._id)
                .then(dbCartProducts => setCartProducts(dbCartProducts))
                .catch(err => notify.error(err))
        }
    }, [cart]);

    //Cart useEffect:
    useEffect(() => {
        cartServices.getCartByUser()
            .then(dbCart => {
                setCart(dbCart);
                setHasCart(Boolean(dbCart))
            })
            .catch(err => notify.error(err))
    }, [cart]);

    //Format date & Time ======================================================================
    function formatDateTime(dateTimeString: string): string {
        const dateTime = new Date(dateTimeString);
        const day = dateTime.getDate().toString().padStart(2, '0');
        const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
        const year = dateTime.getFullYear().toString();
        const hours = dateTime.getHours().toString().padStart(2, '0');
        const minutes = dateTime.getMinutes().toString().padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    function toggleNavigateToList() {
        navigate("/list");
    }

    return (
        <div className="OrderDiv">
            {!showCart ? (cart &&
                <>
                    <h3>Order Summary:</h3>
                    <hr></hr>
                    <p>Name: {user.firstName} {user.lastName}</p>
                    <p>Id: {cart.userId}</p>
                    <p>Date created: {formatDateTime(cart.dateTime)}</p>
                    <hr></hr>
                    <h3>List of products</h3>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th className="SmallText">Name</th>
                                    <th className="SmallText">Pts</th>
                                    <th className="SmallText">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartProducts.map(c =>
                                    <tr key={c._id}>
                                        <td><img className="Thumbnail" src={AppConfig.imagesUrl + c.imageName} /></td>
                                        <td className="MediumText">{c.name}</td>
                                        <td className="MediumText">{c.amountInCart}</td>
                                        <td className="MediumText">{c.amountPrice} ₪</td>
                                        <td>
                                        </td>
                                    </tr>
                                )}
                            </tbody >
                        </table>
                    </div>
                    <p className="LargeText">Total Price: {cart.totalPrice} ₪</p>
                    <button className="BackToCartButton" onClick={() => { props.toggleShowOrder(); toggleNavigateToList(); }}>Back to Cart</button>
                </>
            ) : (
                <Cart toggleShowCart={props.toggleShowOrder} />
            )}
        </div>
    )
}

export default Order;
