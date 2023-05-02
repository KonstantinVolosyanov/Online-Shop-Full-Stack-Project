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

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    console.log(password, confirmPassword);

    // useState for step
    const [step, setStep] = useState(1);

    //useForm:
    const { register, handleSubmit, formState, watch } = useForm<UserModel>();

    // State for showing the Login component
    const [showLogin, setShowLogin] = useState(false)

    //useNavigate:
    const navigate = useNavigate();

    // Function to toggle the showRegisterStep1 state
    function toggleShowLogin() {
        setShowLogin(!showLogin);
    }

    //Send function for handle register:
    async function send(user: UserModel) {
        try {
            await authServices.register(user);
            notify.success("Welcome" + user.firstName);
            navigate('/home');
        } catch (err: any) {
            notify.error(err);
        }
    }

    function checkPassword() {
        console.log("Enter function");
        console.log(confirmPassword, password);
        if (password === confirmPassword) {
            setStep(2);
        } else {
            notify.error("Passwords did not match");
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
                            <input type="email" {...register("email", UserModel.emailValidation)} />
                            <span className="Err">{formState.errors.email?.message}</span>

                            <label>Password: </label>
                            <input name="password" type="password" onChange={(e) => setPassword(e.target.value)} {...register("password", UserModel.passwordValidation)} />
                            <span className="Err">{formState.errors.password?.message}</span>

                            <label>Confirm Password: </label>
                            <input name="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} type="password" />
                            <span className="Err">{formState.errors.password?.message}</span>

                            <label>ID: </label>
                            <input type="text" {...register("idNumber", UserModel.idNumberValidation)} />
                            <span className="Err">{formState.errors.password?.message}</span>

                            <button type="submit" onClick={() => setStep(2)} >Continue</button>
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
                            <span className="Err">{formState.errors.password?.message}</span>

                            <label>Street: </label>
                            <input type="street" {...register("street", UserModel.streetValidation)} />
                            <span className="Err">{formState.errors.email?.message}</span>

                            <label>Name: </label>
                            <input type="text" {...register("firstName", UserModel.firstNameValidation)} />
                            <span className="Err">{formState.errors.password?.message}</span>

                            <label>Last Name: </label>
                            <input type="text" {...register("lastName", UserModel.lastNameValidation)} />
                            <span className="Err">{formState.errors.password?.message}</span>

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
