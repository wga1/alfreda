//
// Copyright (c) 2017 Vitus Lehner. All rights reserved.
// Licensed under the MIT License. See LICENSE file in
// the project root for full license information.
//

import { InlineOption } from "./models/InlineOption";
import { config } from "dotenv";
import { BotService } from "./services/BotService";
import { RosterType } from "./models/RosterType";
import { parseQuery } from "./utils/queryUtils";
import { ROSTER_DEFINITIONS, CMD_DONE, CMD_PAY } from "./constants";
import { findRosterDefinition, getRosterInlineOptions } from "./utils/rosterUtils";
import { Context } from "./models/Context";
import { getBaseCommand, getParams } from "./utils/commandUtils";

config();
const TELEGRAM_API_TOKEN = process.env.TELEGRAM_BOT_API_TOKEN;
console.log("TOKEN", TELEGRAM_API_TOKEN);

const botService = new BotService(TELEGRAM_API_TOKEN);
const botCommands = [CMD_DONE, CMD_PAY];

function onDone(context: Context, params?: string) {
    const options = getRosterInlineOptions();

    if (!params) {
        const text = "What have you done?";

        if (context.callbackData) {
            botService.editMessageWithInlineOptions(context, text, options);
        }
        if (context.command) {
            botService.replyToWithInlineOptions(context, text, options);
        }
    } else {
        const roster = findRosterDefinition(params as RosterType);

        if (roster) {
            const text = "Great! You did: " + roster.name;
            botService.replyTo(context, text);
        } else {
            const text = `Hmm, not sure what you mean. Try one of these...`;
            botService.replyToWithInlineOptions(context, text, options);
        }
    }
}

function onPay(context: Context, params?: string) {
    botService.replyTo(context, "Sorry sis*bro, I can't do that (yet).");
}

botService.onMention({
    handle: context => {
        const options: InlineOption[] = [
            { text: "I completed a duty.", callbackData: `cmd=${CMD_DONE}` },
            { text: "I payed sth.", callbackData: `cmd=${CMD_PAY}` }
        ];
        botService.replyToWithInlineOptions(context, "Hey, what's up?", options);
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

        const { cmd } = params;

        if (cmd === CMD_DONE) {
            onDone(context);
        }

        if (cmd === CMD_PAY) {
            onPay(context);
        }
    }
});

botService.onCommand({
    handle: context => {
        console.log("cmd", context.command);
        const { command, text } = context;

        if (!command || !text) {
            console.warn("Invalid command context.");
            return;
        }

        const cmd = getBaseCommand(command);

        if (cmd === CMD_DONE) {
            const params = getParams(command, text);
            onDone(context, params);
        }
    }
});

botService.initialize(botCommands);
