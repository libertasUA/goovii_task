import { Router } from "express";
import recipeController from "../controllers/recipes/recipes.controller";
import ingredientController from "../controllers/ingredients/ingredients.controller";

const api = Router().use(recipeController).use(ingredientController);

export default Router().use("/api/v1/", api);
