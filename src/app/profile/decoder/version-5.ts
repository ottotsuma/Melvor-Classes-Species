import { Profile } from '../profile';
import { MasteredYou } from '../profile.types';
import { DecodeVersion } from './version.base';

export class Version5 implements DecodeVersion {
    constructor(private readonly game: Game, private readonly profile: Profile) { }

    public decode(reader: SaveWriter) {
        try {
            const version = reader.getUint32();

            if (version !== 5) {
                throw new Error(`Did not read correct version number: ${version} - trying version 4`);
            }
            // console.log(mod.manager.getLoadedModList().includes(reader.getNamespacedObject(this.profile.actions)?._namespace?.name))

            if (reader.getBoolean()) {
                try {
                    const single_species = reader.getNamespacedObject(this.profile.actions);
                    if (typeof single_species === 'string' || single_species.level > this.profile.level) {
                        // this.profile.shouldResetAction = true;
                    } else {
                        this.profile.activeSingle_Species = single_species;
                    }
                } catch (error) {
                    throw new Error(`ERROR - reader.getBoolean:  ${error}`);
                }
            }

            reader.getArray(reader => {
                try {
                    const single_species = reader.getNamespacedObject(this.profile.actions);
                    if (typeof single_species !== 'string') {
                        const masteriesUnlocked: boolean[] = [];
                        reader.getArray(reader => {
                            const isUnlocked = reader.getBoolean();
                            masteriesUnlocked.push(isUnlocked);
                        });
                        this.profile.masteriesUnlocked.set(single_species, masteriesUnlocked);
                    }
                } catch (error) {
                    throw new Error(`ERROR - reader.getArray:  ${error}`);
                }

            });

            reader.getComplexMap(reader => {
                try {
                    const single_species = reader.getNamespacedObject(this.profile.actions);
                    
                    const slot = reader.getUint32();

                    let masteredYou: MasteredYou;

                    if (typeof single_species !== 'string') {
                        masteredYou = {
                            single_species,
                            slot
                        };

                        this.profile.yous.set(single_species, masteredYou);
                    }
                    return {
                        key: single_species,
                        value: masteredYou
                    };
                } catch (error) {
                    throw new Error(`ERROR - reader.getComplexMap:  ${error}`);
                }
            });

            const you1 = this.profile.yous.get(1);
            const you2 = this.profile.yous.get(2);

            this.profile.userInterface.you1.setYou(you1);
            this.profile.userInterface.you2.setYou(you2);
        } catch (error) {
            throw new Error(`save version 5 error;  ${error}`);
        }
    }
}
