import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import CategoryModel from "../../../Models/CategoryModel";
import ProductModel from "../../../Models/ProductModel";
import adminServices from "../../../Services/AdminServices";
import productServices from "../../../Services/ProductServices";
import notify from "../../../Utils/Notify";
import "./EditProduct.css";

function EditProduct(): JSX.Element {
    //Product useState
    const [product, setProduct] = useState<ProductModel>();

    //useEffect for get one product to edit
    useEffect(() => {
        //get one product by params id
        adminServices.getOneProduct(params._id)
            .then((product) => {
                //set previous values
                setValue("_id", product._id);
                setValue("name", product.name);
                setValue("price", product.price);
                setValue("categoryId", product.categoryId);
                setProduct(product);
            })
            .catch(err => notify.error(err))
    }, []);

    //Categories useState
    const [categories, setCategories] = useState<CategoryModel[]>([]);

    //useEffect for get all categories
    useEffect(() => {
        productServices.getAllCategories()
            .then((dbCategories) => setCategories(dbCategories))
            .catch((err) => notify.error(err))
    }, []);

    //useNavigate
    const navigate = useNavigate();
    //useParams
    const params = useParams();
    //useForm
    const { register, handleSubmit, formState, setValue } = useForm<ProductModel>();

    //Send updated product to the admin services
    async function send(product: ProductModel) {
        try {
            product.image = (product.image as unknown as FileList)[0];
            await adminServices.updateProduct(product);
            notify.success("Product has been updated");
            navigate("/list");
        } catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="EditProduct">
            <h2>Edit Product</h2>
            <form onSubmit={handleSubmit(send)}>
                {/* Hiding the id on the form in a Hidden input: */}
                <input type="hidden" {...register("_id")} />

                <label>Name: </label>
                <br />
                <input type="text" {...register("name", ProductModel.nameValidation)} />
                <span className="Err">{formState.errors.name?.message}</span>
                <br />

                <label>Category: </label>
                <br />
                <select defaultValue={""} {...register("categoryId")}>
                    <option disabled value="">Select category: </option>
                    {/* selected option if: category id === products category id */}
                    {categories.map((c) => <option selected={c._id === product.categoryId} key={c._id} value={c._id}>{c.name}</option>)}

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
                <input type="file" accept="image/*" {...register("image", ProductModel.imagePutValidation)} />
                <span className="Err">{formState.errors.image?.message}</span>

                <button>Edit</button>

                {/* Back button */}
                <button onClick={() => navigate("/list")}>Back</button>

            </form >
        </div>
    );
}

export default EditProduct;
