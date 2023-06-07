import { useEffect, useState } from "react";
import ProductModel from "../../../Models/ProductModel";
import { UserModel } from "../../../Models/UserModel";
import "./FilterProducts.css";

interface Props {
    products: ProductModel[];
    user: UserModel;
    setTotalFilteredProducts: (products: ProductModel[]) => void;
    setCurrentPage: (n: number) => void;
}

const FilterProducts: React.FC<Props> = ({ products, setTotalFilteredProducts, user, setCurrentPage }) => {

    //Set filter to "all" by default:
    const [filter, setFilter] = useState<string>("All");


    const [searchQuery, setSearchQuery] = useState<string>("");

    //Handle filter change:
    const onFilterChange = (filter: string) => {
        //Setting Filter:
        setFilter(filter);
        //Setting current page to 1:
        setCurrentPage(1);
    }

    //useEffect for filter:
    useEffect(() => {
        const filtered = products.filter(p => {
            //If searching:
            if (searchQuery && p.name.toLowerCase().includes(searchQuery.toLowerCase())) return true;
            //All
            if (filter === "All" && searchQuery === "") return true;
            //If Milk & Eggs:
            if (filter === "Milk & Eggs" && p.category.name === "Milk & Eggs" && searchQuery === "") return true;
            //If Vegetables & Fruits:
            if (filter === "Vegetables & Fruits" && p.category.name === "Vegetables & Fruits" && searchQuery === "") return true;
            //If Meat & Fish:
            if (filter === "Meat & Fish" && p.category.name === "Meat & Fish" && searchQuery === "") return true;
            //If Wine & Drinks:
            if (filter === "Wine & Drinks" && p.category.name === "Wine & Drinks" && searchQuery === "") return true;
            //If Pastry & Bakery:
            if (filter === "Pastry & Bakery" && p.category.name === "Pastry & Bakery" && searchQuery === "") return true;

        });
        setTotalFilteredProducts(filtered);
        // Rerender if: filter, products array or searchQuery changes:
    }, [filter, products, searchQuery])

    return (
        <div className="FilterProducts">
            {user && <>
                <div className="FilterContainer">
                    <br />

                    <button className={`FilterButton ${filter === "All" ? "ChosenButton" : ""}`} onClick={() => onFilterChange("All")}>All</button>
                    <span>&nbsp; | &nbsp;</span>

                    <button className={`FilterButton ${filter === "Milk & Eggs" ? "ChosenButton" : ""}`} onClick={() => onFilterChange("Milk & Eggs")}>Milk & Eggs</button>
                    <span>&nbsp; | &nbsp;</span>

                    <button className={`FilterButton ${filter === "Vegetables & Fruits" ? "ChosenButton" : ""}`} onClick={() => onFilterChange("Vegetables & Fruits")}>Vegetables & Fruits</button>
                    <span>&nbsp; | &nbsp;</span>

                    <button className={`FilterButton ${filter === "Meat & Fish" ? "ChosenButton" : ""}`} onClick={() => onFilterChange("Meat & Fish")}>Meat & Fish</button>
                    <span>&nbsp; | &nbsp;</span>

                    <button className={`FilterButton ${filter === "Wine & Drinks" ? "ChosenButton" : ""}`} onClick={() => onFilterChange("Wine & Drinks")}>Wine & Drinks</button>
                    <span>&nbsp; | &nbsp;</span>

                    <button className={`FilterButton ${filter === "Pastry & Bakery" ? "ChosenButton" : ""}`} onClick={() => onFilterChange("Pastry & Bakery")}>Pastry & Bakery</button>
                    <span>&nbsp; | &nbsp;</span>

                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name..." />

                </div>
            </>}
        </div>
    );
}

export default FilterProducts;
