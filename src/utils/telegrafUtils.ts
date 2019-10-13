import { Message } from "telegram-typings";

export function messageEntityExists(message: Message, entityType: string) {
    if (!message || !message.entities) {
        return false;
    }
    const result = message.entities.find(e => e.type === entityType);
    return result ? true : false;
}

export function getMessageEntity(message: Message, entityType: string) {
    if (!message || !message.entities) {
        return undefined;
    }
    const result = message.entities.find(e => e.type === entityType);
    return result || undefined;
}

export function isBotCommand(message: Message) {
    return messageEntityExists(message, "bot_command");
}

export function isUserMentioned(message: Message, username: string) {
    if (!message || !message.entities || !message.text) {
        return false;
    }

    const entity = getMessageEntity(message, "mention");
    if (!entity) {
        return false;
    }

    const mentionedUser = message.text.substr(entity.offset, entity.length);
    if (mentionedUser === `@${username}`) {
        return true;
    }
    return false;
}
