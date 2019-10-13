//
// Copyright (c) 2017 Vitus Lehner. All rights reserved.
// Licensed under the MIT License. See LICENSE file in
// the project root for full license information.
//

import { config } from "dotenv";
import Telegraf from "telegraf";
import { BotService } from "./services/BotService";
import { CallbackOption } from "CallbackOption";
import { parseQuery } from "./utils/queryUtils";
import { RosterType } from "./types/RosterType";

config();
const TELEGRAM_API_TOKEN = process.env.TELEGRAM_BOT_API_TOKEN;
console.log(TELEGRAM_API_TOKEN);

const botService = new BotService(TELEGRAM_API_TOKEN);

botService.onMention({
    handle: context => {
        const options: CallbackOption[] = [
            { text: "I completed a duty.", data: "cmd=done" },
            { text: "I payed sth.", data: "cmd=payed" }
        ];
        botService.replyToWithCallbackOptions(context, "Hey, what's up?", options);
    }
});

botService.onCallback({
    handle: context => {
        if (!context.callbackData || !context.answerCallback) {
            console.warn("Invalid callback context.");
            return;
        }
        context.answerCallback();

        const params = parseQuery(context.callbackData);

        if (!params.cmd) {
            console.warn("No callback command given.");
            return;
        }

        if (params.cmd === "done" && !params.item) {
            const options: CallbackOption[] = Object.values(RosterType).map(t => ({
                text: t,
                data: `cmd=done&item=${t}`
            }));
            botService.replyToWithCallbackOptions(context, "What have you done?", options);
        }

        if (params.cmd === "done" && params.item) {
            botService.reply(context, `Great! Next up with ${params.item} is ...`);
        }
    }
});

botService.initialize();
