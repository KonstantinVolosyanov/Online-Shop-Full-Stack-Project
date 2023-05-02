import { useEffect, useState } from "react";
import ProductModel from "../../../Models/ProductModel";
import "./EditProduct.css";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import adminServices from "../../../Services/AdminServices";
import notify from "../../../Utils/Notify";
import CategoryModel from "../../../Models/CategoryModel";
import productServices from "../../../Services/ProductServices";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";




function EditProduct(): JSX.Element {

    const [product, setProduct] = useState<ProductModel>();
    useEffect(() => {
        adminServices.getOneProduct(params._id)
            .then(product => {
                setValue("_id", product._id);
                setValue("name", product.name);
                setValue("price", product.price);
                setValue("categoryId", product.categoryId);
                setProduct(product);

            })
            .catch(err => notify.error(err))
    }, []);

    const [user, setUser] = useState<UserModel>();
    // User UseEffect
    useEffect(() => {
        // If not user - navigate to login:
        if (!authStore.getState().user) {
            navigate("/login")
        }
        setUser(authStore.getState().user);
        // Listen to AuthState changes + unsubscribe:
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
        return unsubscribe;
    }, []);


    function redirect() {
        navigate("/list");
    }

    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const { register, handleSubmit, formState, setValue } = useForm<ProductModel>();
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        productServices.getAllCategories()
            .then(dbCategories => setCategories(dbCategories))
            .catch(err => notify.error(err))
    }, [])

    async function send(product: ProductModel) {
        try {
            product.image = (product.image as unknown as FileList)[0];
            const image = product.image;
            await adminServices.updateProduct(product, image);
            notify.success("Product has been updated");
            navigate(-1);
        } catch (err: any) {
            notify.error(err);
        }
    }

    return (

        <div className="EditProduct">
            {user && user.role === "User" && <>
                {redirect()}
            </>}

            <h2>Edit Product</h2>

            <form onSubmit={handleSubmit((formData) => send(formData))}>

                {/* Hiding the id on the form in a Hidden input: */}
                <input type="hidden" {...register("_id")} />

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
                <input type="file" accept="image/*" {...register("image", ProductModel.imagePutValidation)} />
                <span className="Err">{formState.errors.image?.message}</span>

                <button>Edit</button>

            </form >

        </div>
    );
}

export default EditProduct;
