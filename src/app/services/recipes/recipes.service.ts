import { plainToInstance } from "class-transformer";
import Recipe, { IRecipe } from "../../models/Recipe";
import RecipeCookingStep from "../../models/RecipeCookingStep";
import RecipeIngredient from "../../models/RecipeIngredient";
import Ingredient from "../../models/Ingredient";
import { RecipeDTO, CreateRecipeDTO } from "./dto";
import mongoose from "mongoose";

import sendEmail from "../emailService";

interface GetOptions {
  searchTerm?: string;
  pagination?: { limit: number; page: number };
}

export const getRecipes = async (
  options?: GetOptions
): Promise<RecipeDTO[]> => {
  const { limit = 10, page = 1 } = options?.pagination || {};
  const skip = (page - 1) * limit;

  const recipes = await Recipe.find().skip(skip).limit(limit).lean();

  const recipesDTO = recipes.map((r) =>
    plainToInstance(
      RecipeDTO,
      {
        ...r,
        id: (r._id as mongoose.Types.ObjectId).toString(),
      },
      {
        excludeExtraneousValues: true,
      }
    )
  );

  return recipesDTO;
};

export const getRecipesBySearch = async (
  options?: GetOptions
): Promise<RecipeDTO[]> => {
  const { searchTerm } = options || {};
  const { limit = 10, page = 1 } = options?.pagination || {};
  const skip = (page - 1) * limit;

  const recipesByName = await Recipe.find({
    name: { $regex: searchTerm, $options: "i" },
  })
    .skip(skip)
    .limit(limit)
    .lean();

  const ingredientIds = await Ingredient.find({
    name: { $regex: searchTerm, $options: "i" },
  })
    .distinct("_id")
    .lean();

  const recipesByIngredient = await RecipeIngredient.find({
    ingredientId: { $in: ingredientIds },
  })
    .distinct("recipeId")
    .lean();

  const recipesByIngredientResult = await Recipe.find({
    _id: { $in: recipesByIngredient },
  })
    .skip(skip)
    .limit(limit)
    .lean();

  const uniqueRecipes = new Map<string, IRecipe>();
  recipesByName.forEach((recipe) =>
    uniqueRecipes.set(
      (recipe._id as mongoose.Types.ObjectId).toString(),
      recipe
    )
  );
  recipesByIngredientResult.forEach((recipe) =>
    uniqueRecipes.set(
      (recipe._id as mongoose.Types.ObjectId).toString(),
      recipe
    )
  );

  const recipesDTO = Array.from(uniqueRecipes.values())
    .slice(0, limit)
    .map((recipe) =>
      plainToInstance(
        RecipeDTO,
        { ...recipe, id: (recipe._id as mongoose.Types.ObjectId).toString() },
        {
          excludeExtraneousValues: true,
        }
      )
    );

  return recipesDTO;
};

export const getRecipe = async (id: string): Promise<RecipeDTO> => {
  const recipe = await Recipe.findById(id);

  if (!recipe) throw new Error("Recipe not found");

  const recipeCookingStep = await RecipeCookingStep.find({
    recipeId: recipe,
  }).lean();
  const recipeIngredients = await RecipeIngredient.find({
    recipeId: recipe,
  }).lean();

  const ingredients = await Promise.all(
    recipeIngredients.map(async (ri) => {
      const ingredient = await Ingredient.findById(ri.ingredientId.toString());
      return ingredient;
    })
  );

  const recipeDTO = plainToInstance(
    RecipeDTO,
    {
      ...recipe,
      id: (recipe._id as mongoose.Types.ObjectId).toString(),
      cookingSteps: recipeCookingStep,
      ingredients,
    },
    {
      excludeExtraneousValues: true,
    }
  );

  return recipeDTO;
};

export const createRecipe = async (
  createRecipeDTO: CreateRecipeDTO
): Promise<RecipeDTO> => {
  const recipe = await Recipe.create({
    name: createRecipeDTO.name,
  });

  await Promise.all(
    createRecipeDTO.cookingSteps.map(async (step: any) => {
      const recipeCookingStep = new RecipeCookingStep({
        recipeId: recipe._id,
        orderNumber: step.orderNumber,
        description: step.description,
      });
      await recipeCookingStep.save();
    })
  );

  await Promise.all(
    createRecipeDTO.ingredientsIds.map(async (ingredient: any) => {
      const recipeIngredient = new RecipeIngredient({
        recipeId: recipe._id,
        ingredientId: ingredient,
      });
      await recipeIngredient.save();
    })
  );

  sendEmail("Recipe created", `Recipe ${recipe.name} created`);

  const recipeDTO = plainToInstance(RecipeDTO, recipe, {
    excludeExtraneousValues: true,
  });

  return recipeDTO;
};

export const updateRecipe = async (
  id: string,
  createRecipeDTO: CreateRecipeDTO
): Promise<RecipeDTO> => {
  const recipe = await Recipe.findByIdAndUpdate(
    id,
    {
      name: createRecipeDTO.name,
    },
    {
      new: true,
    }
  );

  if (!recipe) throw new Error("Recipe not found");

  await RecipeCookingStep.deleteMany({ recipeId: id });
  await RecipeIngredient.deleteMany({ recipeId: id });

  await Promise.all(
    createRecipeDTO.cookingSteps.map(async (step: any) => {
      const recipeCookingStep = new RecipeCookingStep({
        recipeId: recipe._id,
        orderNumber: step.orderNumber,
        description: step.description,
      });
      await recipeCookingStep.save();
    })
  );

  sendEmail("Recipe updated", `Recipe ${recipe.name} updated`);

  const recipeDTO = plainToInstance(RecipeDTO, recipe, {
    excludeExtraneousValues: true,
  });
  return recipeDTO;
};

export const deleteRecepe = async (id: string): Promise<RecipeDTO> => {
  const recipe = await Recipe.delete({ _id: id });

  if (!recipe) throw new Error("Recipe not found");

  await RecipeCookingStep.deleteMany({ recipeId: id });
  await RecipeIngredient.deleteMany({ recipeId: id });

  const recipeDTO = plainToInstance(RecipeDTO, recipe, {
    excludeExtraneousValues: true,
  });
  return recipeDTO;
};
