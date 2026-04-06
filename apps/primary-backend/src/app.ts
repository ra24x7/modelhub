import { Elysia } from "elysia";
import { app as authApp } from "./modules/auth";

export const app = new Elysia()
  .use(authApp)
  
export type App = typeof app