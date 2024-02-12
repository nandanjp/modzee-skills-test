import { Router } from "express";

export default interface IController
{
    extendPath: string;
    router: Router;
}