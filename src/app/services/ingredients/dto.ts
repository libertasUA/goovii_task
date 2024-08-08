import "reflect-metadata";
import { Expose, Type } from "class-transformer";

export type CreateIngredientDTO = {
  name: string;
};

export type UpdateIngredientDTO = {
  name: string;
};

export class IngredientDTO {
  @Expose()
  name!: string;

  @Expose({ name: "_id" })
  id!: string;
}
