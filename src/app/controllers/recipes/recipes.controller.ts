import { NextFunction, Request, Response, Router } from "express";
import {
  getRecipes,
  getRecipesBySearch,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecepe,
} from "../../services/recipes/recipes.service";

import { createRecipeSchema, getRecipePataramsSchema } from "./validation";
import authMidleware from "../../middlewares/authMidleware";

const router = Router();

router.post(
  "/recipes",
  authMidleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createRecipeDTO = await createRecipeSchema.validate(req.body, {
        stripUnknown: true,
      });

      const recipe = await createRecipe(createRecipeDTO);

      res.json({ data: recipe });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/recipes",
  authMidleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const param = await getRecipePataramsSchema.validate(req.query, {
        stripUnknown: true,
      });

      const recipes = await getRecipes(param);

      res.json({ data: recipes });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/recipes/search",
  authMidleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const param = await getRecipePataramsSchema.validate(req.query, {
        stripUnknown: true,
      });

      const recipes = await getRecipesBySearch(param);

      res.json({ data: recipes });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/recipes/:id",
  authMidleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipe = await getRecipe(req.params.id);

      res.json({ data: recipe });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/recipes/:id",
  authMidleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createRecipeDTO = await createRecipeSchema.validate(req.body, {
        stripUnknown: true,
      });

      const ingredient = await updateRecipe(req.params.id, createRecipeDTO);

      res.json({ data: ingredient });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/recipes/:id",
  authMidleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ingredient = await deleteRecepe(req.params.id);

      res.json({ data: ingredient });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
