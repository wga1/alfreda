import Telegraf, { ContextMessageUpdate } from "telegraf";

class BotService {
    private telegramApiToken: string;
    private telegrafBot: Telegraf<ContextMessageUpdate>;

    constructor(telegramApiToken: string) {
        this.telegramApiToken = telegramApiToken;
        this.telegrafBot = new Telegraf(this.telegramApiToken);
    }
}
