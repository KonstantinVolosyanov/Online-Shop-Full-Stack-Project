import { RegisterOptions } from "react-hook-form";

class CartProductModel {
  public _id: string;
  public productId: string;
  public amountInCart: number;
  public price: number;
  public amountPrice: number;
  public cartId: string;

  public static productIdValidation: RegisterOptions = {
    required: { value: true, message: "Missing id" },
 };
  public static cartIdValidation: RegisterOptions = {
    required: { value: true, message: "Missing cart id" },
 };

 public static priceValidation: RegisterOptions = {
    required: { value: true, message: "Missing price" },
    min: { value: 0, message: "Price can't be negative" },
    max: { value: 1000, message: "Price can't exceeds 1000" }
 };
 
 public static amountValidation: RegisterOptions = {
   required: { value: true, message: "Missing amount" },
   min: { value: 1, message: "Amount can't be negative" },
   max: { value: 50, message: "Amount can't exceeds 50" }
  };
  
  public static amountPriceValidation: RegisterOptions = {
     required: { value: true, message: "Missing amount price" },
     min: { value: 0, message: "Amount price can't be negative" },
     max: { value: 1000, message: "Amount price can't exceeds 1000" }
  };
}

export default CartProductModel;