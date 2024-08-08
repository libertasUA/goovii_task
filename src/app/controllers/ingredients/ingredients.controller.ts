import { NextFunction, Request, Response, Router } from "express";
import {
  createIngredient,
  updateIngredient,
  getIngredients,
  deleteIngredient,
} from "../../services/ingredients/ingredients.service";

import authMidleware from "../../middlewares/authMidleware";

import { createIngredientSchema, updateIngredientSchema } from "./validation";

const router = Router();

router.post(
  "/ingredients",
  authMidleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ingredientDTO = await createIngredientSchema.validate(req.body, {
        stripUnknown: true,
      });

      const ingredient = await createIngredient(ingredientDTO);

      res.json({ data: ingredient });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/ingredients",
  authMidleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ingredients = await getIngredients();

      res.json({ data: ingredients });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/ingredients/:id",
  authMidleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateIngredientDTO = await updateIngredientSchema.validate(
        req.body,
        {
          stripUnknown: true,
        }
      );

      const ingredient = await updateIngredient(
        req.params.id,
        updateIngredientDTO
      );

      res.json({ data: ingredient });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/ingredients/:id",
  authMidleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ingredient = await deleteIngredient(req.params.id);

      res.json({ data: ingredient });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
