import { Profile } from './profile';
import { Single_Species, MasteredYou } from './profile.types';

export class MasteredYous {
    public readonly yous = new Map<Single_Species, MasteredYou>();

    constructor(private readonly profile: Profile) {}

    public get(single_species: Single_Species): MasteredYou | undefined;
    public get(slot: number): MasteredYou | undefined;
    public get(slotOrSingle_Species: Single_Species | number): MasteredYou | undefined {
        let masteredYou: MasteredYou | undefined;

        if (typeof slotOrSingle_Species === 'number') {
            masteredYou = Array.from(this.yous.values()).find(you => you.slot === slotOrSingle_Species);
        } else {
            const you = this.profile.actions.getObjectByID(slotOrSingle_Species.id);

            masteredYou = this.yous.get(you);
        }

        return masteredYou;
    }

    public set(key: Single_Species, value: MasteredYou) {
        const you = this.profile.actions.getObjectByID(key.id);

        this.yous.set(you, value);
    }

    public all() {
        return Array.from(this.yous.values());
    }

    public remove(key: Single_Species) {
        const you = this.profile.actions.getObjectByID(key.id);

        this.yous.delete(you);
    }

    public clear() {
        this.yous.clear();
    }

    public isMastered(single_species: Single_Species) {
        const you = this.profile.actions.getObjectByID(single_species.id);

        return this.yous.has(you);
    }
}
