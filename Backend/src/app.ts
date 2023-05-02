import express from "express";
import cors from "cors";
import appConfig from "./2-utils/app-config";
import catchAll from "./3-middleware/catch-all";
import routeNotFound from "./3-middleware/route-not-found";
import productRoutes from "./6-routes/product-routes";
import adminRoutes from "./6-routes/admin-routes";
import dal from "./2-utils/dal";
import authRoutes from "./6-routes/auth-routes";
import cartRoutes from "./6-routes/cart-routes";
import imageHandler from "./2-utils/image-handler";

const server = express();

server.use(cors());
server.use(express.json());
server.use(imageHandler.upload.single('image'));
server.use("/api", productRoutes);
server.use("/api", authRoutes);
server.use("/api", adminRoutes);
server.use("/api", cartRoutes);
server.use(routeNotFound);
server.use(catchAll);

server.listen(appConfig.port, async () => {
   await dal.connect();
   console.log(`Listening on http://localhost:${appConfig.port}`)
});
