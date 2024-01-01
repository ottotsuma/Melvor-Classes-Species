import { Classes } from '../classes/classes';

export class ClassesAstrology {
    constructor(private readonly game: Game, private readonly classes: Classes) {}

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
                        skill: this.classes
                    });
                }

                if (modifier.key === 'increasedMasteryXP') {
                    astrologyModifier.modifiers.push({
                        key: 'increasedMasteryXP',
                        skill: this.classes
                    });
                }
            }
        }

        for (const astrologyModifier of variel.uniqueModifiers) {
            for (const modifier of [...astrologyModifier.modifiers]) {
                if (modifier.key === 'decreasedSkillIntervalPercent') {
                    astrologyModifier.modifiers.push({
                        key: 'decreasedSkillIntervalPercent',
                        skill: this.classes
                    });
                }
            }
        }

        variel.skills.push(this.classes);
        variel.masteryXPModifier = 'increasedSkillMasteryXPPerVariel';

        this.game.astrology.actions.registeredObjects.set('melvorTotH:Variel', variel);
    }
}
