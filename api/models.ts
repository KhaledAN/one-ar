import { MethodType } from "./common";

const ModelsEndpoints = {
  get: { path: "/models", methodType: MethodType.GET },
  getDetails: { path: "/models/:modelId", methodType: MethodType.GET },
  create: { path: "/models", methodType: MethodType.POST },
  delete: { path: "/models/:id", methodType: MethodType.DELETE },
};

export default ModelsEndpoints;
