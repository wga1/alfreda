import { RosterType } from "./models/RosterType";
import { RosterDefinition } from "./models/RosterDefinition";

export const ROSTER_DEFINITIONS: RosterDefinition[] = [
    { key: RosterType.CleanBathroom, name: "Cleaning the bathroom" },
    { key: RosterType.CleanKitchen, name: "Cleaning the kitchen" },
    { key: RosterType.CleanHallway, name: "Cleaning the hallway" },
    { key: RosterType.DisposeGarbage, name: "Disposing the garbage" },
    { key: RosterType.DoLaundry, name: "Doing the laundry" },
    { key: RosterType.DoShopping, name: "Doing the shopping" }
];

export const CMD_DONE = "done";
export const CMD_PAY = "pay";
