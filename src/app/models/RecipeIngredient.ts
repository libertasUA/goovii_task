import mongoose, { Schema } from "mongoose";
import MongooseDelete from "mongoose-delete";
import type { SoftDeleteDocument, SoftDeleteModel } from "mongoose-delete";

export interface IRecipeIngredient extends SoftDeleteDocument {
  recipeId: string;
  ingredientId: string;
}

const RecipeIngredientSchema: Schema = new Schema({
  recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  ingredientId: {
    type: Schema.Types.ObjectId,
    ref: "Ingredient",
    required: true,
  },
});

RecipeIngredientSchema.plugin(MongooseDelete, {
  deletedAt: true,
  deletedByType: String,
  overrideMethods: "all",
});

const model = mongoose.model<IRecipeIngredient>(
  "RecipeIngredient",
  RecipeIngredientSchema
) as SoftDeleteModel<IRecipeIngredient>;

export default model;
