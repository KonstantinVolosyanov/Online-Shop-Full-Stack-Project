import { useEffect, useState } from "react";
import "./Statistic.css";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import { useNavigate } from "react-router-dom";
import CartModel from "../../../Models/CartModel";
import cartServices from "../../../Services/CartServices";
import notify from "../../../Utils/Notify";
import OrderModel from "../../../Models/OrderModel";
import ProductModel from "../../../Models/ProductModel";
import productServices from "../../../Services/ProductServices";

function Statistic(): JSX.Element {

    const navigate = useNavigate();

    //User useState: =================================================
    const [user, setUser] = useState<UserModel>();

    //User useEffect:
    useEffect(() => {
        //If not user: navigate to login:
        if (!authStore.getState().user) {
            navigate("/home");
        }
        setUser(authStore.getState().user);
        //Listen to  AuthState changes + unsubscribe:
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    //Orders useState: ================================================
    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [lastOrder, setLastOrder] = useState<OrderModel>();

    //Orders useEffect:
    useEffect(() => {
        cartServices.getAllOrders()
            .then((dbOrders) => setOrders(dbOrders))
            .catch((err) => notify.error(err))
    }, []);

    function getLastOrder(user: UserModel) {
        return orders.reduce((acc, order) => {
            if (order.userId === user.idNumber && (!acc || order.orderDateTime > acc.orderDateTime)) {
                const lastOrder = order;
                return lastOrder;
            } else {
                return acc;
            }
        }, null);
    }

    //Products useState: ===============================================
    const [products, setProducts] = useState<ProductModel[]>([]);

    //Products useEffect:
    useEffect(() => {
        productServices.getAllProducts()
            .then((dbProducts) => setProducts(dbProducts))
            .catch((err) => notify.error(err))
    }, [])

    //Cart State: ======================================================
    const [cart, setCart] = useState<CartModel>();
    const [hasCart, setHasCart] = useState<Boolean>(false);

    //Cart useEffect:
    useEffect(() => {
        if (user) {
            cartServices.getCartByUser()
                .then(dbCart => {
                    setCart(dbCart);
                    setHasCart(Boolean(true))
                })
                .catch(err => notify.error(err))
        }
    }, [user]);

    //Format date & Time: ================================================
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
        <div className="Statistic">
            <h1>Statistic</h1>
            <h3>In our online shop:</h3>

            {!user && <>
                <div>
                    <p>Number of orders completed: {orders.length}</p>
                    <p>Number of products available: {products.length}</p>
                </div>
            </>}


            {user && user.role === "User" && (
                <>
                    <div>
                        <p>Number of orders completed: {orders.length}</p>
                        <p>Number of products available: {products.length}</p>
                    </div>

                    <h2>Hello {user.firstName} {user.lastName}</h2>
                    {cart ? (
                        <>
                            <h3>You have an open cart:</h3>
                            <p>Date created: {formatDateTime(cart.dateTime)}</p>
                            <p>Total price: {cart.totalPrice}</p>
                        </>
                    ) : (
                        <div>
                            {getLastOrder(user)?.orderDateTime ? (
                                <>
                                    <p>User has no active cart</p>
                                    <p>Last order: {formatDateTime(getLastOrder(user)?.orderDateTime)}</p>
                                </>
                            ) : (
                                <p>Welcome to your first purchase!</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div >
    );
}

export default Statistic;
