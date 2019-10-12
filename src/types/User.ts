import { Roster } from "Roster";

export type User = {
    username: string;
    name: string;
    rosters: Roster[];
};
