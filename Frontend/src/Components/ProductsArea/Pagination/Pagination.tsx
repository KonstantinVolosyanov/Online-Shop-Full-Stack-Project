import { useEffect, useState } from "react";
import ProductModel from "../../../Models/ProductModel";
import { UserModel } from "../../../Models/UserModel";
import "./Pagination.css";
import Spinner from "../../SharedArea/Spinner";
import ProductCard from "../ProductCard/ProductCard";
import notify from "../../../Utils/Notify";
import adminServices from "../../../Services/AdminServices";
import FilterProducts from "../FilterProducts/FilterProducts";
import cartServices from "../../../Services/CartServices";
import CartModel from "../../../Models/CartModel";

interface PaginationProps {
    products: ProductModel[];
    setProducts: (products: ProductModel[]) => void;
    user: UserModel;
}

const Pagination: React.FC<PaginationProps> = ({ setProducts, products, user }) => {

    // Cart useState:
    const [cart, setCart] = useState<CartModel>();

    // Cart useEffect:
    useEffect(() => {
        cartServices.getCartByUser()
            .then(dbCart => {
                setCart(dbCart);
            })
            .catch(err => notify.error(err))
    }, []);

    //Total products after filtering:
    const [totalFilteredProducts, setTotalFilteredProducts] = useState<ProductModel[]>([]);
    //Number products per page:
    const [productsPerPage] = useState(20);
    //Set current page:
    const [currentPage, setCurrentPage] = useState(1);
    //Find index of last product on page:
    const lastProductIndex = currentPage * productsPerPage;
    //Find index of first product on page:
    const firstProductIndex = lastProductIndex - productsPerPage;
    //Current product:
    const currentProduct = totalFilteredProducts.slice(firstProductIndex, lastProductIndex);

    //Total Pages count:
    const totalPages = Math.ceil(totalFilteredProducts.length / productsPerPage);
    // Create empty array for page numbers 
    const pageNumbers = [];
    //For loop for numbers of pages:
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    //Handle next page button:
    const nextPage = () => {
        if (currentPage !== totalPages) {
            paginate(currentPage + 1);
        }
    };
    //Handle prev page button:
    const prevPage = () => {
        if (currentPage !== 1) {
            paginate(currentPage - 1)
        }
    }

    //Paginate (# of pages):
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    // Delete product function:
    async function deleteClickedProduct(_id: string) {
        try {
            // Delete product by id:
            await adminServices.deleteProduct(_id);
            //Duplicate products list:
            const duplicatedProducts = [...products];
            // Find deleted product index in products list:
            const index = duplicatedProducts.findIndex(p => p._id === _id);
            // Splice deleted product from list:
            duplicatedProducts.splice(index, 1);
            // Set products = duplicated products:
            setProducts(duplicatedProducts);
        } catch (err: any) {
            notify.error(err)
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
        <div className="Pagination">

            {/* if no products */}
            {products.length === 0 && <Spinner />}
            <FilterProducts setCurrentPage={setCurrentPage} setTotalFilteredProducts={setTotalFilteredProducts} products={products} user={user} />

            {/* Products Map */}
            <br />
            {currentProduct.map(p => (<ProductCard key={p._id} product={p} deleteProduct={deleteClickedProduct} addProductToCart={addClickedProduct} user={user} />))}

            {/* If more that one page */}
            {totalPages > 1 && (
                <div>
                    {/* Prev button */}
                    <button onClick={prevPage} className="Prev" disabled={currentPage === 1}>◀</button>
                    {/* Page numbers */}
                    {pageNumbers.map((number) => (<button key={number} onClick={() => paginate(number)} className={number === currentPage ? "active" : "notActive"}></button>))}
                    {/* Next button */}
                    <button onClick={nextPage} className="Prev" disabled={currentPage === totalPages}>▶</button>
                </div>
            )}
        </div>
    );
}

export default Pagination;
