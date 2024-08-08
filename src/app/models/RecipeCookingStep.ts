import mongoose, { Schema } from "mongoose";
import MongooseDelete from "mongoose-delete";
import type { SoftDeleteDocument, SoftDeleteModel } from "mongoose-delete";

export interface IRecipeCookingStep extends SoftDeleteDocument {
  order: number;
  description: string;
}

const RecipeCookingStepSchema: Schema = new Schema({
  recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  orderNumber: { type: Number, required: true },
  description: { type: String, required: true },
});

RecipeCookingStepSchema.plugin(MongooseDelete, {
  deletedAt: true,
  deletedByType: String,
  overrideMethods: "all",
});

const model = mongoose.model<IRecipeCookingStep>(
  "RecipeCookingStep",
  RecipeCookingStepSchema
) as SoftDeleteModel<IRecipeCookingStep>;

export default model;
