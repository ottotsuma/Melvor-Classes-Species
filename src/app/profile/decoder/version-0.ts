import { Profile } from '../profile';
import { MasteredShout } from '../profile.types';
import { DecodeVersion } from './version.base';

export class Version0 implements DecodeVersion {
    constructor(private readonly profile: Profile) {}

    public decode(reader: SaveWriter) {
        if (reader.getBoolean()) {
            const single_species = reader.getNamespacedObject(this.profile.actions);

            if (typeof single_species === 'string' || single_species.level > this.profile.level) {
                // // this.profile.shouldResetAction = true;
            } else {
                this.profile.activeSingle_Species = single_species;
            }
        }

        if (reader.getBoolean()) {
            const single_species = reader.getNamespacedObject(this.profile.actions);

            if (typeof single_species === 'string' || single_species.level > this.profile.level) {
                // this.profile.shouldResetAction = true;
            } else {
                const masteredShout: MasteredShout = {
                    single_species,
                    slot: 1,
                    socket: undefined,
                    utility: undefined
                };

                this.profile.shouts.set(single_species, masteredShout);

                this.profile.userInterface.shout1.setShout(masteredShout);
            }
        }

        if (reader.getBoolean()) {
            const single_species = reader.getNamespacedObject(this.profile.actions);

            if (typeof single_species === 'string' || single_species.level > this.profile.level) {
                // this.profile.shouldResetAction = true;
            } else {
                const masteredShout: MasteredShout = {
                    single_species,
                    slot: 2,
                    socket: undefined,
                    utility: undefined
                };

                this.profile.shouts.set(single_species, masteredShout);

                this.profile.userInterface.shout2.setShout(masteredShout);
            }
        }

        // if (this.profile.shouldResetAction) {
        //     this.profile.resetActionState();
        // }
    }
}
