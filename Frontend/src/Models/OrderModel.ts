import { RegisterOptions } from "react-hook-form";
import CartModel from "./CartModel"
import ProductModel from "./ProductModel"
import { UserModel } from "./UserModel"

class OrderModel {
  public _id: string;
  public city: string;
  public street: string;
  public deliveryDateTime: string;
  public creditCard: number;
  public orderDateTime: string;
  public finalPrice: number;
  public cartId: string;
  public userId: string;
  public user: UserModel;
  public cart: CartModel;
  public products: ProductModel[];

  public static cityValidation: RegisterOptions = {
    required: { value: true, message: "Missing city name" }
  };

  public static streetValidation: RegisterOptions = {
    required: { value: true, message: "Missing street address" }
  };

  public static deliveryValidation: RegisterOptions = {
    required: { value: true, message: "Missing delivery date & time" }
  };

  public static creditValidation: RegisterOptions = {
    required: { value: true, message: "Credit card field is empty" },
    minLength: { value: 4, message: "Missing digits in credit card field" },
    maxLength: { value: 4, message: "Too much digits in credit card field" }
  };

  public static orderValidation: RegisterOptions = {
    required: { value: true, message: "Missing order date & time" },
  };

  public static finalPriceValidation: RegisterOptions = {
    required: { value: true, message: "Missing final price" },
    min: { value: 0, message: "Price can't be negative" },
    max: { value: 10000, message: "Price can't exceeds 10000" }
  };

  public static cartIdValidation: RegisterOptions = {
    required: { value: true, message: "Missing cart id" },
  };

  public static userIdValidation: RegisterOptions = {
    required: { value: true, message: "Missing user id" },
  };

  public static cartValidation: RegisterOptions = {
    required: { value: true, message: "Missing cart" },
  };

  public static userValidation: RegisterOptions = {
    required: { value: true, message: "Missing user" },
  };

  public static productsValidation: RegisterOptions = {
    required: { value: true, message: "Missing products in cart" },
    min: { value: 1, message: "Missing products in cart" },
  };

}

export default OrderModel;