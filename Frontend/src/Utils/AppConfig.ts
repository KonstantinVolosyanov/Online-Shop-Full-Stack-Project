class AppConfig {
    //Auth links:
    public registerUrl = "http://localhost:4000/api/auth/register/"; // register
    public loginUrl = "http://localhost:4000/api/auth/login/"; // login

    //Cart links:
    public allCartsUrl = "http://localhost:4000/api/carts/"; // get all carts
    public cartUrl = "http://localhost:4000/api/cart/"; // create, delete, get one cart

    //Product to cart:
    public productCartUrl = "http://localhost:4000/api/cart/product/"; // add, delete product to/from cart
    public subtractProductUrl = "http://localhost:4000/api/cart/product/subtract/"; // subtract one from amount in cart
    public cartByUserUrl = "http://localhost:4000/api/cart-by-user/"; // cart by user
    public allProductsCartUrl = "http://localhost:4000/api/cart-products/"; // get all products in cart

    //Product links:
    public productsUrl = "http://localhost:4000/api/products/"; // get all products
    public adminProductsUrl = "http://localhost:4000/api/admin/products/"; // add, edit, delete product for admin,

    //Categories:
    public categoriesUrl = "http://localhost:4000/api/categories/"; // get all categories

    //Images:
    public imagesUrl = "http://localhost:4000/api/products/images/"; // get image
    
    //Order links:
    public createOrderUrl = "http://localhost:4000/api/order/"; // create order
    public ordersUrl = "http://localhost:4000/api/orders/"; // get all orders
}

const appConfig = new AppConfig();

export default appConfig;
