import { Classes } from '../classes/classes';

export class ClassesAgility {
    constructor(private readonly game: Game, private readonly classes: Classes) {}

    public register() {
        const waterfall = this.game.agility.actions.registeredObjects.get('melvorF:Waterfall');

        waterfall.modifiers.decreasedSkillIntervalPercent.push({
            skill: this.classes,
            value: 5
        });

        waterfall.modifiers.increasedSkillXP.push({
            skill: this.classes,
            value: 5
        });

        waterfall.modifiers.increasedMasteryXP.push({
            skill: this.classes,
            value: 5
        });

        this.game.agility.actions.registeredObjects.set('melvorF:Waterfall', waterfall);
    }
}
