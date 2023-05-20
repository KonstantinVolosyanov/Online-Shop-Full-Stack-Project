import { useState } from "react";
import ProductModel from "../../../Models/ProductModel";
import { UserModel } from "../../../Models/UserModel";
import "./Pagination.css";
import Spinner from "../../SharedArea/Spinner";
import ProductCard from "../ProductCard/ProductCard";
import notify from "../../../Utils/Notify";
import adminServices from "../../../Services/AdminServices";

interface PaginationProps {
    products: ProductModel[];
    setProducts: (products: ProductModel[]) => void;
    user: UserModel;
}

const Pagination: React.FC<PaginationProps> = ({ setProducts, products, user }) => {

    //Total products after filtering:
    const [totalFilteredProducts, setTotalFilteredProducts] = useState<ProductModel[]>([]);
    //Number products per page:
    const [productsPerPage] = useState(8);
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

    async function deleteClickedProduct(_id: string) {
        try {
            await adminServices.deleteProduct(_id);
            //Refresh list:
            const duplicatedProducts = { ...products };
            const index = duplicatedProducts.findIndex(p => p._id === _id);
            duplicatedProducts.splice(index, 1);
            setProducts(duplicatedProducts);

        } catch (err: any) {
            notify.error(err)

        }
    }



    return (
        <div className="Pagination">

            {/* if no products */}
            {products.length === 0 && <Spinner />}
            {/* <FilterVacations setCurrentPage={setCurrentPage} setTotalFilteredProducts={setTotalFilteredProducts} products={products} user={user} /> */}

            {/* Products Map */}
            {/* {currentProduct.map(p => (<ProductCard key={p._id} product={p} deleteProduct={deleteClickedProduct} user={user} />))} */}

            {totalPages > 1 && (
                <div>
                    <button onClick={prevPage} className="Prev" disabled={currentPage === 1}>◀</button>
                    {pageNumbers.map((number) => (<button key={number} onClick={() => paginate(number)} className={number === currentPage ? "active" : "notActive"}></button>))}
                    <button onClick={nextPage} className="Prev" disabled={currentPage === totalPages}>▶</button>
                </div>
            )}
        </div>
    );
}

export default Pagination;
