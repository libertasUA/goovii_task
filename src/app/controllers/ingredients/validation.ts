import * as yup from "yup";

export const createIngredientSchema = yup.object().shape({
  name: yup.string().required(),
});

export const updateIngredientSchema = yup.object().shape({
  name: yup.string().required(),
});
