import { Request, Response } from "express";

export const signUp = async (req: Request, res: Response) => {
    res.status(200).send({ body: "SignUp", access_token: "test" });
};

export const login = async (req: Request, res: Response) => {
    res.status(200).send({ body: "Login", access_token: "test" });
};

export const loginCas = async (req: Request, res: Response) => {
    res.status(200).send({ body: "Login CAS", access_token: "test" });
};

export const loginSocial = async (req: Request, res: Response) => {
    res.status(200).send({ body: "Login Social", access_token: "test" });
};
