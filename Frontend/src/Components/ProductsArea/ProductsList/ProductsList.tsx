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

function ProductsList(): JSX.Element {


    //useState for user:
    const [user, setUser] = useState<UserModel>();

    const navigate = useNavigate();

    //useEffect and subscribe for user:
    useEffect(() => {
        setUser(authStore.getState().user);
        //Listen to authState changes:
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    const [products, setProducts] = useState<ProductModel[]>([])

    useEffect(() => {
        productServices.getAllProducts()
            .then(products => setProducts(products))
            .catch(err => notify.error(err))
    }, []);

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

    return (
        <div className="ProductsList">
            <div>
                {products.map(p => <ProductCard key={p._id} product={p} deleteProduct={deleteClickedProduct} />)}
            </div>
        </div>
    );
}

export default ProductsList;
