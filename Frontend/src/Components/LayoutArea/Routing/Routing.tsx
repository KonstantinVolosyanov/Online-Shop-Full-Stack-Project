import { Navigate, Route, Routes } from "react-router-dom";
import AddProduct from "../../AdminArea/AddProduct/AddProduct";
import EditProduct from "../../AdminArea/EditProduct/EditProduct";
import Home from "../../HomeArea/Home/Home";
import ProductsList from "../../ProductsArea/ProductsList/ProductsList";
import OrderForm from "../../ShoppingArea/OrderForm/OrderForm";
import PageNotFound from "../PageNotFound/PageNotFound";

function Routing(): JSX.Element {
    return (
        <Routes>
            {/* Home Page */}
            <Route path="/home" element={<Home />} />
            {/* Product List Component */}
            <Route path="/list" element={<ProductsList />} />
            {/* Edit Product */}
            <Route path="/admin/edit/:_id" element={<EditProduct />} />
            {/* Add Product */}
            <Route path="/admin/add/" element={<AddProduct />} />
            {/* Default Page */}
            <Route path="/" element={<Navigate to="/home" />} />
            {/* Page Not Found */}
            <Route path="*" element={<PageNotFound />} />
            {/* Order Page */}
            <Route path="/order/form" element={<OrderForm />} />
        </Routes>
    );
}

export default Routing;
