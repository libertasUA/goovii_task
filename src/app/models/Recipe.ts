import mongoose, { Schema } from "mongoose";
import MongooseDelete from "mongoose-delete";
import type { SoftDeleteDocument, SoftDeleteModel } from "mongoose-delete";

export interface IRecipe extends SoftDeleteDocument {
  id: string;
  name: string;
}

const RecipeSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
});

RecipeSchema.plugin(MongooseDelete, {
  deletedAt: true,
  deletedByType: String,
  overrideMethods: "all",
});

const model = mongoose.model<IRecipe>(
  "Recipe",
  RecipeSchema
) as SoftDeleteModel<IRecipe>;

export default model;
