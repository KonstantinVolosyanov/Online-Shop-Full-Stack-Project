import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserModel, City } from "../../../Models/UserModel";
import authServices from "../../../Services/AuthServices";
import notify from "../../../Utils/Notify";
import Login from "../Login/Login";
import "./Register.css";

type RegisterProps = {
    toggleShowRegister: () => void;
};

function Register(props: RegisterProps): JSX.Element {
    // Confirm password state:
    const [confirmPassword, setConfirmPassword] = useState("");
    // useState for step
    const [step, setStep] = useState(1);
    // useState for showing the Login component
    const [showLogin, setShowLogin] = useState(false)
    // useForm:
    const { register, handleSubmit, formState, watch, setError, clearErrors, setValue } = useForm<UserModel>();
    //useNavigate:
    const navigate = useNavigate();

    // Function to toggle the showRegisterStep1 state
    function toggleShowLogin() {
        setShowLogin(!showLogin);
    }

    // Send function for handle register:
    async function send(user: UserModel) {
        try {
            await authServices.register(user);
            notify.success("Welcome" + user.firstName);
            navigate('/home');
        } catch (err: any) {
            notify.error(err);
        }
    }

    // Check password function
    function checkPassword() {
        const password = watch("password");
        const email = watch("email");
        // Regex for email check:
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        // If not valid:
        if (!emailRegex.test(email)) {
            setError("email", {
                type: "manual",
                message: "Invalid email address",
            })
            return;     
        }
        // If valid - go to step 2: 
        else {
        setStep(2);
        }
    }


    return (
        <div className="Register">
            {!showLogin ? (
                <form className="AuthForm" onSubmit={handleSubmit(send)}>
                    {step === 1 && (
                        <>
                            <h1>Register</h1>
                            <h3>Step 1</h3>

                            <label>Email: </label>
                            <input name="email" type="email" onChange={checkPassword} {...register("email")} />
                            <span className="Err">{formState.errors.email?.message}</span>

                            <label>Password: </label>
                            <input name="password" type="password" onChange={(e) => setValue("password", e.target.value)} {...register("password", UserModel.passwordValidation)} />
                            <span className="Err">{formState.errors.password?.message}</span>

                            <label>Confirm Password: </label>
                            <input name="confirmPassword" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                            <span className="Err">{formState.errors.password?.message}</span>

                            <label>ID: </label>
                            <input type="text" {...register("idNumber", UserModel.idNumberValidation)} />
                            <span className="Err">{formState.errors.idNumber?.message}</span>

                            <button type="button" onClick={checkPassword} >Continue</button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h1>Register</h1>
                            <h3>Step 2</h3>

                            <label>City: </label>
                            <select defaultValue="" {...register("city")}>
                                <option disabled value="">Select city: </option>
                                {Object.values(City).map((city) => (<option key={city} value={city}>{city}</option>))}
                            </select>
                            <span className="Err">{formState.errors.city?.message}</span>

                            <label>Street: </label>
                            <input type="street" {...register("street", UserModel.streetValidation)} />
                            <span className="Err">{formState.errors.street?.message}</span>

                            <label>Name: </label>
                            <input type="text" {...register("firstName", UserModel.firstNameValidation)} />
                            <span className="Err">{formState.errors.firstName?.message}</span>

                            <label>Last Name: </label>
                            <input type="text" {...register("lastName", UserModel.lastNameValidation)} />
                            <span className="Err">{formState.errors.lastName?.message}</span>

                            <button>Register</button>
                            <button onClick={() => setStep(1)}>Back</button>
                        </>
                    )}

                    <p>
                        If already registered, please:
                        <button type="button" onClick={toggleShowLogin}>
                            Login
                        </button>
                    </p>

                </form>
            ) : (
                <Login toggleShowLogin={toggleShowLogin} />
            )}
        </div>
    );
}

export default Register;
