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

    // Delete product for Admin:
    async function deleteMe() {
        try {
            // Confirm:
            if (!window.confirm("Are you sure?")) return;
            await props.deleteProduct(props.product._id);
            notify.success("Product has been deleted")
        } catch (err: any) {
            notify.error(err)
        }
    }

    // Add to cart for User:
    async function addToCart() {
        try {
            await props.addProductToCart(props.product._id);
        } catch (err: any) {
            notify.error(err)
        }
    }

    return (
        <div className="ProductCard">
            {/* User Card */}
            {props.user && props.user.role === "User" &&
                <>
                    <div className="CardDiv">
                        <img src={props.product.imageUrl} />
                        <button className="AddToCartButton" onClick={addToCart}>
                            <span className="CategorySpan">{props.product.category.name}</span>
                            <br />
                            <span className="NameSpan">{props.product.name}</span>
                            <br />
                            <span className="PriceSpan">{props.product.price + " ₪"}</span>
                            <br />
                        </button>
                    </div>
                </>}

            {/* Admin Card */}
            {props.user && props.user.role === "Admin" &&
                <>
                    <div>
                        <img src={props.product.imageUrl} />
                        <span className="CategorySpan">{props.product.category.name}</span>
                        <br />
                        <span>{props.product.name}</span>
                        <br />
                        <span>{props.product.price + " ₪"}</span>
                        <br />
                        <button className="DeleteButton" onClick={deleteMe}>Delete</button>
                        <NavLink className="EditButton" to={"/admin/edit/" + props.product._id}>Edit</NavLink>
                    </div>
                </>}
        </div>
    );
}

export default ProductCard;
