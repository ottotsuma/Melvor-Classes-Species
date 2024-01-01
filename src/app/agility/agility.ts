import { Profile } from '../profile/profile';

export class ProfileAgility {
    constructor(private readonly game: Game, private readonly profile: Profile) {}

    public register() {
        const waterfall = this.game.agility.actions.registeredObjects.get('melvorF:Waterfall');

        waterfall.modifiers.decreasedSkillIntervalPercent.push({
            skill: this.profile,
            value: 5
        });

        waterfall.modifiers.increasedSkillXP.push({
            skill: this.profile,
            value: 5
        });

        waterfall.modifiers.increasedMasteryXP.push({
            skill: this.profile,
            value: 5
        });

        this.game.agility.actions.registeredObjects.set('melvorF:Waterfall', waterfall);
    }
}
