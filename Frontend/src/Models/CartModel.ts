import { RegisterOptions } from "react-hook-form";
import { UserModel } from "./UserModel";

class CartModel {
  public _id: string;
  public totalPrice: number;
  public userId: string;
  public dateTime: string;
  public user: UserModel;

  public static totalPriceValidation: RegisterOptions = {
    required: { value: true, message: "Missing total price" },
    min: { value: 0, message: "Price can't be negative" },
    max: { value: 10000, message: "Price can't exceeds 10000" }
  };

  public static userIdValidation: RegisterOptions = {
    required: { value: true, message: "Missing user id" },
  };

  public static dateTimeValidation: RegisterOptions = {
    required: { value: true, message: "Missing date and time" }
  };

  public static userValidation: RegisterOptions = {
    required: { value: true, message: "Missing user" }
  };
}
export default CartModel;