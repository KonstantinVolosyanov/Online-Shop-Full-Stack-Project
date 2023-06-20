import { City, UserModel } from "../../../Models/UserModel";
import OrderModel from "../../../Models/OrderModel";
import { useForm } from "react-hook-form";
import "./OrderForm.css";
import { ChangeEvent, useEffect, useState } from "react";
import { authStore } from "../../../Redux/AuthState";
import { useNavigate } from "react-router-dom";
import Spinner from "../../SharedArea/Spinner";

function OrderForm(): JSX.Element {

    // useForm:
    const { register, handleSubmit, formState, setValue } = useForm<OrderModel, UserModel>();
    //useNavigate
    const navigate = useNavigate()
    //User useState:
    const [user, setUser] = useState<UserModel>();
    // Start date State for past date validation:
    const [deliveryDateTime, setDeliveryDateTime] = useState(new Date());
    // Input double click focus useState
    const [isCityInputDoubleClicked, setIsCityInputDoubleClicked] = useState<boolean>(false);

    // User UseEffect ==========================================================================
    useEffect(() => {
        // If not user - navigate to login:
        if (!authStore.getState().user) {
            navigate("/home")
        }
        setUser(authStore.getState().user);
        // Listen to AuthState changes + unsubscribe:
        const unsubscribe = authStore.subscribe(() => {
            const updatedUser = authStore.getState().user;
            setUser(updatedUser);
        });
        return unsubscribe;
    }, []);


    // Past date validation handler:
    const handleDeliveryDateTimeChange = (args: ChangeEvent<HTMLInputElement>) => {
        const inputDeliveryDateTime = new Date(args.target.value);
        inputDeliveryDateTime.setUTCHours(0, 0, 0, 0); // Set to midnight in UTC
        setDeliveryDateTime(inputDeliveryDateTime);
    };

    // Use Effect fill form bu default vacation values
    useEffect(() => {
        if (user && isCityInputDoubleClicked === true) {
            setValue("city", user.city);
            setValue("street", user.street);
        }
        // Get Time locale zone start date
        const deliveryDateTime = new Date();
        deliveryDateTime.setDate(deliveryDateTime.getDate())
        const formattedDeliveryDateTime = new Date(deliveryDateTime.getTime() - deliveryDateTime.getTimezoneOffset() * 60000).toISOString().substring(0, 10);
        setValue("deliveryDateTime", formattedDeliveryDateTime);
        setDeliveryDateTime(deliveryDateTime);
    }, [user, isCityInputDoubleClicked]);


    return (
        <div className="OrderForm">
            {user ? (
                <>
                    <h1>Order</h1>
                    <h3>Shipping Details</h3>
                    <label>City: </label>
                    <select defaultValue="" {...register("city")} onFocus={() => setIsCityInputDoubleClicked(true)}>
                        <option disabled value="">Select city or double-click for users default data: </option>
                        {Object.values(City).map((city) => (<option key={city} value={city}>{city}</option>))}
                    </select>
                    <span className="Err">{formState.errors.city?.message}</span>

                    <label>Street: </label>
                    <input type="text" {...register("street", UserModel.streetValidation)}
                        onFocus={() => setIsCityInputDoubleClicked(true)} placeholder="Enter Street or double-click for users default data: " />
                    <span className="Err">{formState.errors.street?.message}</span>

                    <label>Shipping Date: </label>
                    <input type="date" {...register("deliveryDateTime", OrderModel.deliveryValidation)}
                        onChange={handleDeliveryDateTimeChange}
                        min={new Date().toISOString().split("T")[0]} />
                    <span className="Err">{formState.errors.deliveryDateTime?.message}</span>

                    <label>Credit Card: </label>
                    <input type="number" {...register("creditCard", OrderModel.creditValidation)} />
                    <span className="Err">{formState.errors.creditCard?.message}</span>

                    <button>ORDER</button>
                </>
            ) : (
                <Spinner />
            )}
        </div>
    );
}

export default OrderForm;
