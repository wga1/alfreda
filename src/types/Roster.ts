import { RosterType } from "RosterType";

export type Roster = {
    type: RosterType;
    createdAt: Date;
    finishedAt: Date;
};
