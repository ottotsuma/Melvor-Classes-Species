import { Profile } from './profile';
import { Single_Species, MasteredShout } from './profile.types';

export class MasteredShouts {
    public readonly shouts = new Map<Single_Species, MasteredShout>();

    constructor(private readonly profile: Profile) {}

    public get(single_species: Single_Species): MasteredShout | undefined;
    public get(slot: number): MasteredShout | undefined;
    public get(slotOrSingle_Species: Single_Species | number): MasteredShout | undefined {
        let masteredShout: MasteredShout | undefined;

        if (typeof slotOrSingle_Species === 'number') {
            masteredShout = Array.from(this.shouts.values()).find(shout => shout.slot === slotOrSingle_Species);
        } else {
            const shout = this.profile.actions.getObjectByID(slotOrSingle_Species.id);

            masteredShout = this.shouts.get(shout);
        }

        return masteredShout;
    }

    public set(key: Single_Species, value: MasteredShout) {
        const shout = this.profile.actions.getObjectByID(key.id);

        this.shouts.set(shout, value);
    }

    public all() {
        return Array.from(this.shouts.values());
    }

    public remove(key: Single_Species) {
        const shout = this.profile.actions.getObjectByID(key.id);

        this.shouts.delete(shout);
    }

    public clear() {
        this.shouts.clear();
    }

    public isMastered(single_species: Single_Species) {
        const shout = this.profile.actions.getObjectByID(single_species.id);

        return this.shouts.has(shout);
    }
}
