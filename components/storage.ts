import AsyncStorageFactory from '@react-native-community/async-storage';
import LegacyStorage from '@react-native-community/async-storage-backend-legacy';

const legacyStorage = new LegacyStorage();

export type StorageModel = {
    handyToken: {
        name: string
    }
}

const storage = AsyncStorageFactory.create<StorageModel>(legacyStorage)

export default storage;