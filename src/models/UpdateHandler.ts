import { Context } from "./Context";

export type UpdateHandler = {
    handle: (ctx: Context) => void;
};
