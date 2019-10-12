import lowDb from "lowdb";
import LowDbFileSyncAdapter from "lowdb/adapters/FileSync";

class StorageService {
    private storageFile: string;
    private lowDbAdapter;
    private lowDb;

    constructor(storageFile: string) {
        this.storageFile = storageFile;
        this.lowDbAdapter = new LowDbFileSyncAdapter(this.storageFile);
        this.lowDb = lowDb(this.lowDbAdapter);
    }
}
