import { Profile } from '../profile';
import { MasteredYou } from '../profile.types';
import { DecodeVersion } from './version.base';

export class Version3 implements DecodeVersion {
    constructor(private readonly game: Game, private readonly profile: Profile) {}

    public decode(reader: SaveWriter) {
        const version = reader.getUint32();

        if (version !== 3) {
            throw new Error(`Did not read correct version number: ${version} - trying version 3`);
        }

        if (reader.getBoolean()) {
            const single_species = reader.getNamespacedObject(this.profile.actions);
            if (typeof single_species === 'string' || single_species.level > this.profile.level) {
                // this.profile.shouldResetAction = true;
            } else {
                this.profile.activeSingle_Species = single_species;
            }
        }

        reader.getComplexMap(reader => {
            const single_species = reader.getNamespacedObject(this.profile.actions);
            const slot = reader.getUint32();
            let socket: string | Item;

            if (reader.getBoolean()) {
                socket = reader.getNamespacedObject(this.game.items);
            }

            let utility: string | Item;

            if (reader.getBoolean()) {
                utility = reader.getNamespacedObject(this.game.items);
            }

            let masteredYou: MasteredYou;

            if (typeof single_species !== 'string') {
                masteredYou = {
                    single_species,
                    slot,
                    socket: typeof socket !== 'string' ? socket : undefined,
                    utility: typeof utility !== 'string' ? utility : undefined
                };

                this.profile.yous.set(single_species, masteredYou);
            }

            const you1 = this.profile.yous.get(1);
            const you2 = this.profile.yous.get(2);

            this.profile.userInterface.you1.setYou(you1);
            this.profile.userInterface.you2.setYou(you2);

            return {
                key: single_species,
                value: masteredYou
            };
        });

        // Migrate legacy data to new unlocked state.
        for (const action of this.profile.actions.allObjects) {
            const masteryLevel = this.profile.getMasteryLevel(action);
            const isUnlocked = action
                .modifiers(this.profile.settings.modifierType)
                .filter(modifier => modifier.level <= 100)
                .map(modifier => modifier.level <= masteryLevel);

            this.profile.masteriesUnlocked.set(action, isUnlocked);
        }
    }
}
