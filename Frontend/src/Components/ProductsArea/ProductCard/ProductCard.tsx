import { NavLink } from "react-router-dom";
import ProductModel from "../../../Models/ProductModel";
import { UserModel } from "../../../Models/UserModel";
import notify from "../../../Utils/Notify";
import "./ProductCard.css";

interface ProductCardProps {
    product: ProductModel;
    deleteProduct: (_id: string) => Promise<void>;
    user: UserModel;
    addProductToCart: (_id: string) => Promise<void>;
}

function ProductCard(props: ProductCardProps): JSX.Element {


    async function deleteMe() {
        try {
            if (!window.confirm("Are you sure?")) return;
            await props.deleteProduct(props.product._id);
            notify.success("Product has been deleted")
        } catch (err: any) {
            notify.error(err)
        }
    }

    async function addToCart() {
        try {
            await props.addProductToCart(props.product._id);
        } catch (err: any) {
            notify.error(err)
        }
    }

    return (
        <div className="ProductCard">
            {/* if User */}
            {props.user && props.user.role === "User" &&
                <>
                    <div>
                        <img src={props.product.imageUrl} />
                        {props.product.name}
                        <br />
                        {props.product.category.name}
                        <br />
                        {props.product.price + " ₪"}
                        <br />
                        <br />
                        <button onClick={addToCart}>➕</button>
                    </div>
                </>}

            {/* if Admin */}
            {props.user && props.user.role === "Admin" &&
                <>
                    <div>
                        <img src={props.product.imageUrl} />
                        {props.product.name}
                        <br />
                        {props.product.category?.name}
                        <br />
                        {props.product.price + " ₪"}
                        <br />
                        <button onClick={deleteMe}>❌</button>
                        <NavLink to={"/admin/edit/" + props.product._id}>Edit</NavLink>
                    </div>
                </>}
        </div>
    );
}

export default ProductCard;
