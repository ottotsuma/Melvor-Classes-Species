import { Profile } from '../profile';
import { MasteredYou } from '../profile.types';
import { DecodeVersion } from './version.base';

export class Version2 implements DecodeVersion {
    constructor(private readonly profile: Profile) {}

    public decode(reader: SaveWriter) {
        const version = reader.getUint32();

        if (version !== 2) {
            throw new Error(`Did not read correct version number: ${version} - trying version 2`);
        }

        if (reader.getBoolean()) {
            const single_species = reader.getNamespacedObject(this.profile.actions);
            if (typeof single_species === 'string' || single_species.level > this.profile.level) {
                // this.profile.shouldResetAction = true;
            } else {
                this.profile.activeSingle_Species = single_species;
            }
        }

        if (reader.getBoolean()) {
            const single_species = reader.getNamespacedObject(this.profile.actions);

            if (typeof single_species === 'string' || single_species.level > this.profile.level) {
                // this.profile.shouldResetAction = true;
            } else {
                const masteredYou: MasteredYou = {
                    single_species,
                    slot: 1,
                    socket: undefined,
                    utility: undefined
                };

                this.profile.yous.set(single_species, masteredYou);

                this.profile.userInterface.you1.setYou(masteredYou);
            }
        }

        if (reader.getBoolean()) {
            const single_species = reader.getNamespacedObject(this.profile.actions);

            if (typeof single_species === 'string' || single_species.level > this.profile.level) {
                // this.profile.shouldResetAction = true;
            } else {
                const masteredYou: MasteredYou = {
                    single_species,
                    slot: 2,
                    socket: undefined,
                    utility: undefined
                };

                this.profile.yous.set(single_species, masteredYou);

            }
        }

        // if (this.profile.shouldResetAction) {
        //     this.profile.resetActionState();
        // }
    }
}
