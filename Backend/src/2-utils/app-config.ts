class AppConfig {
    // port backend
    public port = 4000;
    //connection string
    public mongodbConnectionString = "mongodb://127.0.0.1:27017/online-shopdb";
    public productImagesAddress = "http://localhost:4000/api/products/images/";
}


const appConfig = new AppConfig();
export default appConfig;
