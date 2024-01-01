import { Thuum } from '../thuum/thuum';

export class ThuumAgility {
    constructor(private readonly game: Game, private readonly thuum: Thuum) {}

    public register() {
        const waterfall = this.game.agility.actions.registeredObjects.get('melvorF:Waterfall');

        waterfall.modifiers.decreasedSkillIntervalPercent.push({
            skill: this.thuum,
            value: 5
        });

        waterfall.modifiers.increasedSkillXP.push({
            skill: this.thuum,
            value: 5
        });

        waterfall.modifiers.increasedMasteryXP.push({
            skill: this.thuum,
            value: 5
        });

        this.game.agility.actions.registeredObjects.set('melvorF:Waterfall', waterfall);
    }
}
