import { Thuum } from '../thuum/thuum';

export class ThuumAstrology {
    constructor(private readonly game: Game, private readonly thuum: Thuum) {}

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
                        skill: this.thuum
                    });
                }

                if (modifier.key === 'increasedMasteryXP') {
                    astrologyModifier.modifiers.push({
                        key: 'increasedMasteryXP',
                        skill: this.thuum
                    });
                }
            }
        }

        for (const astrologyModifier of variel.uniqueModifiers) {
            for (const modifier of [...astrologyModifier.modifiers]) {
                if (modifier.key === 'decreasedSkillIntervalPercent') {
                    astrologyModifier.modifiers.push({
                        key: 'decreasedSkillIntervalPercent',
                        skill: this.thuum
                    });
                }
            }
        }

        variel.skills.push(this.thuum);
        variel.masteryXPModifier = 'increasedSkillMasteryXPPerVariel';

        this.game.astrology.actions.registeredObjects.set('melvorTotH:Variel', variel);
    }
}
