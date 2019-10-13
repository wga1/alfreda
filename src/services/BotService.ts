import { InlineOption } from "../models/InlineOption";
import { Context } from "../models/Context";
import { isBotCommand, isUserMentioned, findBotCommand } from "../utils/telegrafUtils";
import Telegraf, { ContextMessageUpdate } from "telegraf";
import { ExtraReplyMessage, InlineKeyboardButton, MessageSubTypes, UpdateType } from "telegraf/typings/telegram-types";
import { UpdateHandler } from "../models/UpdateHandler";

const defaultHandler: UpdateHandler = { handle: () => {} };

export class BotService {
    private telegramApiToken: string;
    private telegrafBot: Telegraf<ContextMessageUpdate>;

    private mentionHandler: UpdateHandler = defaultHandler;
    private commandHandler: UpdateHandler = defaultHandler;
    private callbackHandler: UpdateHandler = defaultHandler;

    private commands: string[] = [];

    constructor(telegramApiToken: string) {
        this.telegramApiToken = telegramApiToken;
        this.telegrafBot = new Telegraf(this.telegramApiToken);
    }

    initialize(commands: string[]) {
        this.commands = commands;
        const updateTypes: (UpdateType | MessageSubTypes)[] = ["text", "callback_query"];
        updateTypes.forEach(e => {
            const handler = this.getBaseHandler(e);
            this.telegrafBot.on(e, handler);
        });
        this.telegrafBot.launch();
    }

    onMention(handler: UpdateHandler) {
        this.mentionHandler = handler;
    }

    onCommand(handler: UpdateHandler) {
        this.commandHandler = handler;
    }

    onCallback(handler: UpdateHandler) {
        this.callbackHandler = handler;
    }

    reply(context: Context, text: string) {
        const { telegrafCtx: ctx } = context;

        ctx.reply(text);
    }

    replyTo(context: Context, text: string) {
        const { telegrafCtx: ctx } = context;
        const { message } = ctx;
        const { username } = ctx.from;

        const replyOptions: ExtraReplyMessage = {
            reply_to_message_id: message.message_id
        };

        ctx.reply(`${text}`, replyOptions);
    }

    replyToWithInlineOptions(context: Context, text: string, options: InlineOption[]) {
        const { telegrafCtx: ctx } = context;
        const { message } = ctx;

        const replyOptions: ExtraReplyMessage = {
            reply_markup: this.getInlineReplyMarkup(options),
            reply_to_message_id: message.message_id
        };

        ctx.reply(`${text}`, replyOptions);
    }

    editMessageWithInlineOptions(context: Context, text: string, options: InlineOption[]) {
        const { telegrafCtx: ctx } = context;

        const replyOptions: ExtraReplyMessage = {
            reply_markup: this.getInlineReplyMarkup(options)
        };

        ctx.editMessageText(text, replyOptions);
    }

    private async baseHandler(updateType: string, ctx: ContextMessageUpdate, next: Function) {
        if (!ctx.from || !ctx.chat) {
            console.error("Unexpected error: ctx not sufficiently set.");
            return;
        }

        const { chat } = ctx;

        if (chat.type !== "group") {
            console.warn("Chat is not a group chat.", { chat_id: chat.id, chat_type: chat.type });
            ctx.reply("Sorry sis*bro, I only work in group chats. Go and add me to your flat mate group!");
        }

        console.log("Received update of type", updateType, "in chat", { chat_id: chat.id, chat_title: chat.title });

        switch (updateType) {
            case "text":
                await this.handleText(ctx);
                break;
            case "callback_query":
                await this.handleCallback(ctx);
                break;
        }
        next(ctx);
    }

    private async handleText(ctx: ContextMessageUpdate) {
        const { message, me } = ctx;
        const { text = "" } = message;

        const isBotCommandMentioned = isBotCommand(message);
        const isMeMentioned = isUserMentioned(message, me);
        if (isMeMentioned && !isBotCommandMentioned) {
            await this.mentionHandler.handle(this.createContext(ctx));
        } else if (isBotCommandMentioned) {
            await this.commandHandler.handle(this.createContext(ctx));
        }
    }

    private async handleCallback(ctx: ContextMessageUpdate) {
        const { callbackQuery } = ctx;
        const { data } = callbackQuery;

        if (data) {
            await this.callbackHandler.handle(this.createContext(ctx));
        }
    }

    private getBaseHandler(updateType: string) {
        return this.baseHandler.bind(this, updateType);
    }

    private createContext(ctx: ContextMessageUpdate): Context {
        const text = (ctx.message && ctx.message.text) || undefined;
        const callbackData = (ctx.callbackQuery && ctx.callbackQuery.data) || undefined;
        const callbackAnswer =
            (ctx.callbackQuery && ctx.callbackQuery.id && ((text?: string) => ctx.answerCbQuery(text))) || undefined;
        const command = findBotCommand(ctx.message);

        return { telegrafCtx: ctx, text, callbackData, answerCallback: callbackAnswer, command };
    }

    private getInlineReplyMarkup(options: InlineOption[]) {
        const optionRows: InlineKeyboardButton[][] = options.map(o => [
            {
                text: o.text,
                callback_data: o.callbackData || undefined,
                switch_inline_query_current_chat: o.command || undefined
            }
        ]);
        return { inline_keyboard: optionRows, selective: true, one_time_keyboard: true };
    }
}
