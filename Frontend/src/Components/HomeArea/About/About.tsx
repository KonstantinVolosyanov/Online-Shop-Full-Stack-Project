import { useNavigate } from "react-router-dom";
import "./About.css";
import { useEffect, useState } from "react";
import cartServices from "../../../Services/CartServices";
import notify from "../../../Utils/Notify";
import { UserModel } from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";

function About(): JSX.Element {

   

    return (
        <div className="About">
            <p>Welcome to our brand new online shop! We offer low prices on high-quality products, a fast and user-friendly website with a
                comfortable design, lightning-fast and secure shipping, top-notch security measures, and the best customer service in the
                industry. Shop with confidence knowing that you're getting the best deal and the best experience possible.</p>
        </div >
    );
}

export default About;
