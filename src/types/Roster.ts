import { RosterTypes } from "RosterTypes";

export type Roster = {
    type: RosterTypes;
    createdAt: Date;
    finishedAt: Date;
};
