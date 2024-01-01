import { Classes } from '../classes';
import { ShoutModifier, Teacher } from '../classes.types';

import './mastery.scss';

enum State {
    View = 'view',
    Unlock = 'unlock'
}

interface EssenceOfClasses {
    item: AnyItem;
    quantity: number;
}

export function MasteryComponent(game: Game, classes: Classes, teacher: Teacher) {
    return {
        $template: '#classes-mastery',
        teacher,
        state: State.View,
        modifier: undefined as ShoutModifier,
        essenceOfClasses: undefined as EssenceOfClasses,
        unlockGPCost: 0,
        get unlockableModifiers() {
            const modifiers = classes.manager.getModifiers(teacher);

            return modifiers //.filter(modifier => modifier.level < 100);
        },
        get currentMasteryLevel() {
            return classes.getMasteryLevel(teacher);
        },
        mounted: function () {
            this.updateCosts();
        },
        isUnlocked: function (index: number) {
            const teacherRef = classes.actions.find(action => action.id === teacher.id);
            const unlockedMasteries = classes.masteriesUnlocked.get(teacherRef);

            return unlockedMasteries[index];
        },
        canUnlock: function (modifier: ShoutModifier) {
            const masteryLevel = classes.getMasteryLevel(teacher);

            return masteryLevel >= modifier.level;
        },
        getNextEquipCost: function () {
            const { costs, unlocked } = classes.manager.calculateEquipCost(teacher);

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
            game.bank.removeItemQuantityByID('namespace_classes:Dragon_Soul', 1, true);
            game.gp.remove(this.unlockGPCost);

            const teacherRef = classes.actions.find(action => action.id === teacher.id);
            const index = teacherRef
                .modifiers(classes.settings.modifierType)
                .findIndex(mod => mod.level === modifier.level);
            const unlockedMasteries = classes.masteriesUnlocked.get(teacherRef);

            unlockedMasteries[index] = true;

            classes.masteriesUnlocked.set(teacherRef, unlockedMasteries);

            this.updateCosts();
            this.completeUpgrade();
        },
        updateCosts: function () {
            const item = game.items.getObjectByID(`namespace_classes:Dragon_Soul`);

            this.essenceOfClasses = {
                item,
                quantity: game.bank.getQty(item)
            };
        },
        completeUpgrade: function () {
            classes.computeProvidedStats(true);
            classes.renderQueue.shoutModifiers = true;
            classes.renderQueue.gpRange = true;
            classes.renderQueue.grants = true;

            this.state = State.View;
        }
    };
}
