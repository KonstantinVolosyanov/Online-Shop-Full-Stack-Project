import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ProductModel from "../../../Models/ProductModel";
import adminServices from "../../../Services/AdminServices";
import "./AddProduct.css";
import productServices from "../../../Services/ProductServices";
import CategoryModel from "../../../Models/CategoryModel";
import { useEffect, useState } from "react";
import notify from "../../../Utils/Notify";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";

function AddProduct(): JSX.Element {
    //user useState
    const [user, setUser] = useState<UserModel>();

    //useForm
    const { register, handleSubmit, formState } = useForm<ProductModel>();

    //useState for categories
    const [categories, setCategories] = useState<CategoryModel[]>([]);

    //useNavigate
    const navigate = useNavigate();

    //useEffect for categories
    useEffect(() => {
        productServices.getAllCategories()
            .then((dbCategories) => setCategories(dbCategories))
            .catch((err) => notify.error(err));
    }, [])

    useEffect(() => {
        if (!authStore.getState().user) {
            navigate("/home")
        }
        setUser(authStore.getState().user);
        //Listen to authState changes:
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    //Send added product
    async function send(product: ProductModel) {
        try {
            product.image = (product.image as unknown as FileList)[0];
            await adminServices.addProduct(product);
            notify.success("Product has been added.");
            navigate("/list");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="AddProduct">

            <h2>Add Product</h2>

            <form onSubmit={handleSubmit(send)}>

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
