import { Thuum } from '../thuum';
import { ShoutModifier, Teacher } from '../thuum.types';

import './mastery.scss';

enum State {
    View = 'view',
    Unlock = 'unlock'
}

interface EssenceOfThuum {
    item: AnyItem;
    quantity: number;
}

export function MasteryComponent(game: Game, thuum: Thuum, teacher: Teacher) {
    return {
        $template: '#thuum-mastery',
        teacher,
        state: State.View,
        modifier: undefined as ShoutModifier,
        essenceOfThuum: undefined as EssenceOfThuum,
        unlockGPCost: 0,
        get unlockableModifiers() {
            const modifiers = thuum.manager.getModifiers(teacher);

            return modifiers //.filter(modifier => modifier.level < 100);
        },
        get currentMasteryLevel() {
            return thuum.getMasteryLevel(teacher);
        },
        mounted: function () {
            this.updateCosts();
        },
        isUnlocked: function (index: number) {
            const teacherRef = thuum.actions.find(action => action.id === teacher.id);
            const unlockedMasteries = thuum.masteriesUnlocked.get(teacherRef);

            return unlockedMasteries[index];
        },
        canUnlock: function (modifier: ShoutModifier) {
            const masteryLevel = thuum.getMasteryLevel(teacher);

            return masteryLevel >= modifier.level;
        },
        getNextEquipCost: function () {
            const { costs, unlocked } = thuum.manager.calculateEquipCost(teacher);

            return formatNumber(costs[unlocked]);
        },
        ok: function () {
            SwalLocale.clickConfirm();
        },
        setState: function (state: State, modifier: ShoutModifier | undefined) {
            this.state = state;
            this.modifier = modifier;

            if (!this.modifier) {
                this.unlockGPCost = 100000;
                return;
            }

            switch (this.modifier.level) {
                case 40:
                default:
                    this.unlockGPCost = 100000;
                    break;
                case 75:
                    this.unlockGPCost = 1000000;
                    break;
                case 99:
                    this.unlockGPCost = 10000000;
                    break;
            }
        },
        unlock: function (modifier: ShoutModifier) {
            game.bank.removeItemQuantityByID('namespace_thuum:Dragon_Soul', 1, true);
            game.gp.remove(this.unlockGPCost);

            const teacherRef = thuum.actions.find(action => action.id === teacher.id);
            const index = teacherRef
                .modifiers(thuum.settings.modifierType)
                .findIndex(mod => mod.level === modifier.level);
            const unlockedMasteries = thuum.masteriesUnlocked.get(teacherRef);

            unlockedMasteries[index] = true;

            thuum.masteriesUnlocked.set(teacherRef, unlockedMasteries);

            this.updateCosts();
            this.completeUpgrade();
        },
        updateCosts: function () {
            const item = game.items.getObjectByID(`namespace_thuum:Dragon_Soul`);

            this.essenceOfThuum = {
                item,
                quantity: game.bank.getQty(item)
            };
        },
        completeUpgrade: function () {
            thuum.computeProvidedStats(true);
            thuum.renderQueue.shoutModifiers = true;
            thuum.renderQueue.gpRange = true;
            thuum.renderQueue.grants = true;

            this.state = State.View;
        }
    };
}
