import "reflect-metadata";
import { Expose, Type } from "class-transformer";
import { IngredientDTO } from "../ingredients/dto";

export type CreateRecipeDTO = {
  name: string;
  cookingSteps: {
    description: string;
    orderNumber: number;
  }[];
  ingredientsIds: string[];
};

export class RecipeCookingStepDTO {
  @Expose()
  description!: string;

  @Expose()
  orderNumber!: number;
}

export class RecipeDTO {
  @Expose()
  name!: string;

  @Expose()
  id!: string;

  @Expose({ name: "cookingSteps" })
  @Type(() => RecipeCookingStepDTO)
  cookingSteps!: RecipeCookingStepDTO[];

  @Expose({ name: "ingredients" })
  @Type(() => IngredientDTO)
  ingredients!: IngredientDTO[];
}
