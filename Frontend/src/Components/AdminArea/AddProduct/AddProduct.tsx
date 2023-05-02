import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ProductModel from "../../../Models/ProductModel";
import adminServices from "../../../Services/AdminServices";
import "./AddProduct.css";
import productServices from "../../../Services/ProductServices";
import CategoryModel from "../../../Models/CategoryModel";
import { useEffect, useState } from "react";
import notify from "../../../Utils/Notify";

function AddProduct(): JSX.Element {

    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const { register, handleSubmit, formState } = useForm<ProductModel>();
    const navigate = useNavigate();

    useEffect(() => {
        productServices.getAllCategories()
            .then(dbCategories => setCategories(dbCategories))
            .catch(err => notify.error(err))
    }, [])

    async function send(formData: ProductModel) {
        try {
            formData.image = (formData.image as unknown as FileList)[0];
            const image = formData.image;
            await adminServices.addProduct(formData, image);
            notify.success("Product has been added.");
            navigate("/list");
        }
        catch (err: any) {
            alert(err.message);
        }
    }

    return (
        <div className="AddProduct">
            <h2>Add Product</h2>

            <form onSubmit={handleSubmit((formData) => send(formData))}>

                <label>Name: </label>
                <br />
                <input type="text" {...register("name", ProductModel.nameValidation)} />
                <span className="Err">{formState.errors.name?.message}</span>
                <br />

                <label>Category: </label>
                <br />
                <select defaultValue="" {...register("categoryId")}>
                    <option disabled value="">Select category: </option>
                    {categories.map(c => (<option key={c._id} value={c._id}>{c.name}</option>))}
                </select>
                <span className="Err">{formState.errors.category?.message}</span>
                <br />

                <label>Price: </label>
                <br />
                <input type="number" step="0.01" {...register("price", ProductModel.priceValidation)} />
                <span className="Err">{formState.errors.price?.message}</span>
                <br />

                <label>Image: </label>
                <br />
                <input type="file" accept="image/*" {...register("image", ProductModel.imagePostValidation)} />
                <span className="Err">{formState.errors.image?.message}</span>

                <button>Add</button>

            </form >

        </div>
    );
}

export default AddProduct;
