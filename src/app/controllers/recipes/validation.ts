import * as yup from "yup";

export const createRecipeSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    cookingSteps: yup
      .array()
      .of(
        yup.object().shape({
          description: yup.string().required(),
          orderNumber: yup.number().required(),
        })
      )
      .required()
      .min(1)
      .default([]),
    ingredientsIds: yup
      .array()
      .of(yup.string().required())
      .required()
      .min(1)
      .default([]),
  })
  .required();

export const getRecipePataramsSchema = yup.object().shape({
  pagination: yup.object().shape({
    page: yup.number().default(1),
    limit: yup.number().default(10),
  }),
  searchTerm: yup.string(),
});
