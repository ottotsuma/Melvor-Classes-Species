import { Profile } from '../profile';
import { MasteredShout } from '../profile.types';
import { DecodeVersion } from './version.base';

/**
 * Legacy save version, didn't realise saves were this finicky and should have saved version number initially.
 * Had to do save version as string so I could read it properly.
 */
export class Version1 implements DecodeVersion {
    constructor(private readonly profile: Profile) {}

    public decode(reader: SaveWriter) {
        const skillVersionString = reader.getString();

        // Try parsing the version - this is painful because I didn't save a version number initially, needed this gimicky
        // work around as there is no way to tell data is legacy other then failing.
        const version = parseInt(skillVersionString.split('namespace_profileVersion:')[1].split(':')[0]);

        if (version !== 1) {
            throw new Error(`Did not read correct version number: ${version} - trying version 1`);
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
            }
        }

        // if (this.profile.shouldResetAction) {
        //     this.profile.resetActionState();
        // }
    }
}
