import { Profile } from '../profile';
import { Version4 } from './version-4';
import { Version5 } from './version-5';
export class Decoder {
    constructor(private readonly game: Game, private readonly profile: Profile, private readonly start: number) {}

    public decode(reader: SaveWriter) {
        const saveVersions = [
            this.loadSaveFactory(() => new Version4(this.game, this.profile).decode(reader)),
            this.loadSaveFactory(() => new Version5(this.game, this.profile).decode(reader)),
        ];

        for (const save of saveVersions) {
            const isLoaded = save();

            // Loaded the save successfully.
            if (isLoaded) {
                break;
            }

            // Reset the byte offset if we failed to load this version of the save.
            reader.byteOffset = this.start;
        }
    }

    private loadSaveFactory(callback: () => void) {
        return () => {
            let isLoaded = false;
            try {
                callback();
                isLoaded = true;
            } catch (e) {
                console.warn('Failed to load profile save', e);
            }
            return isLoaded;
        };
    }
}
