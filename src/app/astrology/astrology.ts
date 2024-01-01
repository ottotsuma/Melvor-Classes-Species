import { Profile } from '../profile/profile';

export class ProfileAstrology {
    constructor(private readonly game: Game, private readonly profile: Profile) {}

    public register() {
        if (!cloudManager.hasTotHEntitlement) {
            return;
        }

        const variel = this.game.astrology.actions.registeredObjects.get('melvorTotH:Variel');

        for (const astrologyModifier of variel.standardModifiers) {
            for (const modifier of [...astrologyModifier.modifiers]) {
                if (modifier.key === 'increasedSkillXP') {
                    astrologyModifier.modifiers.push({
                        key: 'increasedSkillXP',
                        skill: this.profile
                    });
                }

                if (modifier.key === 'increasedMasteryXP') {
                    astrologyModifier.modifiers.push({
                        key: 'increasedMasteryXP',
                        skill: this.profile
                    });
                }
            }
        }

        for (const astrologyModifier of variel.uniqueModifiers) {
            for (const modifier of [...astrologyModifier.modifiers]) {
                if (modifier.key === 'decreasedSkillIntervalPercent') {
                    astrologyModifier.modifiers.push({
                        key: 'decreasedSkillIntervalPercent',
                        skill: this.profile
                    });
                }
            }
        }

        variel.skills.push(this.profile);
        variel.masteryXPModifier = 'increasedSkillMasteryXPPerVariel';

        this.game.astrology.actions.registeredObjects.set('melvorTotH:Variel', variel);
    }
}
