import { Roster } from "./Roster";

export type User = {
    id: string;
    username: string;
    name: string;
    rosters: Roster[];
};
