import { MethodType } from "./common";

const MarkersEndpoints = {
  get: { path: "/markers", methodType: MethodType.GET },
  getDetails: { path: "/markers/:markerId", methodType: MethodType.GET },
  create: { path: "/markers", methodType: MethodType.POST },
  delete: { path: "/markers/:id", methodType: MethodType.DELETE },
};

export default MarkersEndpoints;
