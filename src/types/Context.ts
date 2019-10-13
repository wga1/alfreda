import { ContextMessageUpdate } from "telegraf";

export type Context = {
    telegrafCtx: ContextMessageUpdate;
    text?: string;
    callbackData?: string;
    answerCallback?: (text?: string) => void;
};
