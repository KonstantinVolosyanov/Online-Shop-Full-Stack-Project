import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CredentialsModel from "../../../Models/CredentialsModel";
import authServices from "../../../Services/AuthServices";
import notify from "../../../Utils/Notify";
import Register from "../Register/Register";
import "./Login.css";

type LoginProps = {
    toggleShowLogin: () => void;
};


function Login(props: LoginProps): JSX.Element {
    //Use Form:
    const { register, handleSubmit, formState } = useForm<CredentialsModel>();
    //Use Navigate:
    const navigate = useNavigate();
    // State for showing the RegisterStep1 component
    const [showRegister, setShowRegister] = useState(false);
    //Send function to handle login:
    async function send(credentials: CredentialsModel) {
        try {
            await authServices.login(credentials);
            notify.success("Welcome back!");
            // navigate("/products-list");
        } catch (err: any) {
            notify.error(err);
        }
    }

    // Function to toggle the showRegisterStep1 state
    function toggleShowRegister() {
        setShowRegister(!showRegister);
    }

    return (
        <div className="Login">
            {!showRegister ? (

                <form className="AuthForm" onSubmit={handleSubmit(send)}>
                    <h1>Welcome</h1>

                    <label>Email:</label>
                    <input type="email" {...register("email", CredentialsModel.emailValidation)} />
                    <span className="Err">{formState.errors.email?.message}</span>

                    <label>Password:</label>
                    <input type="password" {...register("password", CredentialsModel.passwordValidation)} />
                    <span className="Err">{formState.errors.email?.message}</span>

                    <button>Login</button>

                    <p>
                        If not a user, please:
                        <button type="button" onClick={toggleShowRegister}>
                            Register
                        </button>
                    </p>
                </form>
            ) : (
                <Register toggleShowRegister={toggleShowRegister} />
            )}
        </div>
    );
}

export default Login;
