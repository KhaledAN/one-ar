import { MethodType } from "./common";

const UsersEndpoints = {
  get: { path: "/users", methodType: MethodType.GET },
  getDetails: { path: "/users/:userId", methodType: MethodType.GET },
  create: { path: "/users", methodType: MethodType.POST },
};

export default UsersEndpoints;
