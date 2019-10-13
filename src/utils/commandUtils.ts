export function getBaseCommand(command: string) {
    const cmd = command.split("@")[0];

    if (!cmd.startsWith("/")) {
        return "";
    }

    return cmd.length > 0 ? cmd.substr(1) : "";
}

export function getParams(command: string, text: string) {
    const commandParts = text.split(command);
    return commandParts[commandParts.length - 1].trim();
}
