import { plainToInstance } from "class-transformer";
import Ingredient, { IIngredient } from "../../models/Ingredient";
import { CreateIngredientDTO, IngredientDTO, UpdateIngredientDTO } from "./dto";

export const getIngredients = async (): Promise<IIngredient[]> => {
  const recipes = await Ingredient.find();
  return recipes;
};

export const createIngredient = async (
  createIngredientDTO: CreateIngredientDTO
): Promise<IngredientDTO> => {
  const ingredient = await Ingredient.create(createIngredientDTO);

  const ingredientDTO = plainToInstance(IngredientDTO, ingredient, {
    excludeExtraneousValues: true,
  });

  return ingredientDTO;
};

export const updateIngredient = async (
  id: string,
  updateIngredientDTO: UpdateIngredientDTO
): Promise<IngredientDTO> => {
  const ingredient = await Ingredient.findByIdAndUpdate(
    id,
    updateIngredientDTO,
    {
      new: true,
    }
  );
  const ingredientDTO = plainToInstance(IngredientDTO, ingredient, {
    excludeExtraneousValues: true,
  });
  return ingredientDTO;
};

export const deleteIngredient = async (id: string): Promise<IngredientDTO> => {
  const ingredient = await Ingredient.delete({ _id: id });
  const ingredientDTO = plainToInstance(IngredientDTO, ingredient, {
    excludeExtraneousValues: true,
  });
  return ingredientDTO;
};
