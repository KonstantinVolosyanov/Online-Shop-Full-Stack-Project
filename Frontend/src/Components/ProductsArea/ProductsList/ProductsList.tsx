import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductModel from "../../../Models/ProductModel";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import productServices from "../../../Services/ProductServices";
import notify from "../../../Utils/Notify";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductsList.css";
import adminServices from "../../../Services/AdminServices";
import { productsStore } from "../../../Redux/ProductsState";
import Spinner from "../../SharedArea/Spinner";
import cartServices from "../../../Services/CartServices";
import CartModel from "../../../Models/CartModel";

function ProductsList(): JSX.Element {
    //Users------------------------------------------------------------------
    const [user, setUser] = useState<UserModel>();
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartModel>();

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

    //Cart useEffect:
    useEffect(() => {
        cartServices.getCartByUser()
            .then(dbCart => {
                setCart(dbCart);
            })
            .catch(err => notify.error(err))
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
                console.log(products);
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

    //Delete product:
    async function deleteClickedProduct(_id: string) {
        try {
            await adminServices.deleteProduct(_id);
            const duplicatedProducts = [...products];
            const index = duplicatedProducts.findIndex(p => p._id === _id);
            duplicatedProducts.splice(index, 1);
            setProducts(duplicatedProducts);
        } catch (err: any) {
            notify.error(err);
        }
    }

    //Add product to cart:
    async function addClickedProduct(_id: string) {
        try {
            await cartServices.addProductToCart(_id, cart);
        } catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="ProductsList">
            {/* If loading... */}
            {loading && <Spinner />}

            {/* If not loading */}
            {!loading && (
                <div>
                    {products.map(p => <ProductCard addProductToCart={addClickedProduct} key={p._id} product={p} deleteProduct={deleteClickedProduct} user={user} />)}
                </div>
            )}
        </div>
    );
}

export default ProductsList;
