import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartModel from "../../../Models/CartModel";
import ProductModel from "../../../Models/ProductModel";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import { productsStore } from "../../../Redux/ProductsState";
import cartServices from "../../../Services/CartServices";
import productServices from "../../../Services/ProductServices";
import notify from "../../../Utils/Notify";
import Spinner from "../../SharedArea/Spinner";
import Pagination from "../Pagination/Pagination";
import "./ProductsList.css";

function ProductsList(): JSX.Element {
    //Users------------------------------------------------------------------
    const navigate = useNavigate();
    const [user, setUser] = useState<UserModel>();

    useEffect(() => {
        if (!authStore.getState().user) {
            navigate("/home")
        }
        setUser(authStore.getState().user);
        //Listen to authState changes:
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    //Products---------------------------------------------------------------
    const [products, setProducts] = useState<ProductModel[]>([])
    //Loading state:
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        productServices.getAllProducts()
            .then(products => {
                setProducts(products);
                setLoading(false);
            })
            .catch(err => {
                notify.error(err);
                setLoading(false);
            });

        const unsubscribe = productsStore.subscribe(() => {
            setProducts(p => productsStore.getState().products)
        })
        return unsubscribe;
    }, []);

    return (
        <div className="ProductsList">
            {/* If loading... */}
            {loading && <Spinner />}

            {!loading && <>
                {/* Pagination UI */}
                <Pagination user={user} products={products} setProducts={setProducts} />
            </>
            }
        </div>
    );
}

export default ProductsList;
