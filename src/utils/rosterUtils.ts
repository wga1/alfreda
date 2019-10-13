import { RosterDefinition } from "../models/RosterDefinition";
import { RosterType } from "../models/RosterType";
import { ROSTER_DEFINITIONS, CMD_DONE } from "../constants";

export function findRosterDefinition(key: RosterType, definitions: RosterDefinition[] = ROSTER_DEFINITIONS) {
    if (!key || !definitions) {
        return undefined;
    }
    return definitions.find(d => d.key === key) || undefined;
}

export function getRosterInlineOptions(definitions: RosterDefinition[] = ROSTER_DEFINITIONS) {
    if (!definitions) {
        return [];
    }

    return definitions.map(r => ({
        text: r.name,
        command: `/${CMD_DONE} ${r.key}`
    }));
}
