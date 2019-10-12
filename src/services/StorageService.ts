import lowDb, { AdapterSync } from "lowdb";
import LowDbFileSyncAdapter from "lowdb/adapters/FileSync";
import { RootDb } from "RootDb";

class StorageService {
    private storageFile: string;
    private lowDbAdapter: AdapterSync;
    private lowDb: lowDb.LowdbSync<RootDb>;

    constructor(storageFile: string) {
        this.storageFile = storageFile;
        this.lowDbAdapter = new LowDbFileSyncAdapter(this.storageFile);
        this.lowDb = lowDb(this.lowDbAdapter);
    }
}
