import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductModel from "../../../Models/ProductModel";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import "./ProductCard.css";
import { NavLink } from "react-router-dom";
import notify from "../../../Utils/Notify";

interface ProductCardProps {
    product: ProductModel;
    deleteProduct: (_id: string) => Promise<void>;
}

function ProductCard(props: ProductCardProps): JSX.Element {

    const [user, setUser] = useState<UserModel>();

    //useEffect and subscribe for user:
    useEffect(() => {
        setUser(authStore.getState().user);
        //Listen to authState changes:
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    async function deleteMe() {
        try {
            if (!window.confirm("Are you sure?")) return;
            await props.deleteProduct(props.product._id);
            notify.success("Product has been deleted")
        } catch (err: any) {
            notify.error(err)
        }
    }

    return (
        <div className="ProductCard">
            <div>
                <img src={props.product.imageUrl} />
                {props.product.name}
                <br />
                {props.product.category.name}
                <br />
                {props.product.price + " ₪"}
                <br />
                {user && user.role === "Admin" && <>
                    <button onClick={deleteMe}>❌</button>
                    <NavLink to={"/admin/edit/" + props.product._id}>Edit</NavLink>
                </>}
                {user && user.role === "User" && <>
                    <br />
                    <button >➕</button>
                    <span> | </span>
                    <button >➖</button>
                </>}
            </div>
        </div>
    );
}

export default ProductCard;
