import mongoose, { Schema } from "mongoose";
import MongooseDelete from "mongoose-delete";
import type { SoftDeleteDocument, SoftDeleteModel } from "mongoose-delete";

export interface IIngredient extends SoftDeleteDocument {
  name: string;
}

const IngredientSchema: Schema = new Schema<IIngredient>({
  name: { type: String, required: true },
});

IngredientSchema.plugin(MongooseDelete, {
  deletedAt: true,
  deletedByType: String,
  overrideMethods: "all",
});

const model = mongoose.model<IIngredient>(
  "Ingredient",
  IngredientSchema
) as SoftDeleteModel<IIngredient>;

export default model;
