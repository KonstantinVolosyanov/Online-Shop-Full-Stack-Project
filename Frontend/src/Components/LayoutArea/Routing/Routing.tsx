import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AddProduct from "../../AdminArea/AddProduct/AddProduct";
import EditProduct from "../../AdminArea/EditProduct/EditProduct";
import Home from "../../HomeArea/Home/Home";
import ProductsList from "../../ProductsArea/ProductsList/ProductsList";
import OrderForm from "../../ShoppingArea/OrderForm/OrderForm";
import PageNotFound from "../PageNotFound/PageNotFound";
import { useEffect, useState } from "react";
import { authStore } from "../../../Redux/AuthState";
import { UserModel } from "../../../Models/UserModel";

function Routing(): JSX.Element {

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

    return (
        <Routes>
            {/* Home Page */}
            <Route path="/home" element={<Home />} />
            {/* Product List Component */}
            <Route path="/list" element={<ProductsList />} />
            {/* Edit Product */}
            <Route path="/" element={<Navigate to="/home" />} />
            {/* Page Not Found */}
            <Route path="*" element={<PageNotFound />} />
            {/* Order Page */}
            <Route path="/order/form" element={<OrderForm />} />
            {user && user.role === "Admin" && <>
                <Route path="/admin/edit/:_id" element={<EditProduct />} />
                {/* Add Product */}
                <Route path="/admin/add/" element={<AddProduct />} />
                {/* Default Page */}
            </>
            }
        </Routes>
    );
}

export default Routing;
