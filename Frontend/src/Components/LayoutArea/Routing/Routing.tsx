import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../../HomeArea/Home/Home";
import ProductsList from "../../ProductsArea/ProductsList/ProductsList";
import PageNotFound from "../PageNotFound/PageNotFound";
import EditProduct from "../../AdminArea/EditProduct/EditProduct";
import AddProduct from "../../AdminArea/AddProduct/AddProduct";

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
        </Routes>
    );
}

export default Routing;
