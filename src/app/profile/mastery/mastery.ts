import { Profile } from '../profile';
import { ShoutModifier, Single_Species } from '../profile.types';

import './mastery.scss';

enum State {
    View = 'view',
    Unlock = 'unlock'
}

interface EssenceOfProfile {
    item: AnyItem;
    quantity: number;
}

export function MasteryComponent(game: Game, profile: Profile, single_species: Single_Species) {
    return {
        $template: '#profile-mastery',
        single_species,
        state: State.View,
        modifier: undefined as ShoutModifier,
        essenceOfProfile: undefined as EssenceOfProfile,
        unlockGPCost: 0,
        get unlockableModifiers() {
            const modifiers = profile.manager.getModifiers(single_species);

            return modifiers //.filter(modifier => modifier.level < 100);
        },
        get currentMasteryLevel() {
            return profile.getMasteryLevel(single_species);
        },
        mounted: function () {
            this.updateCosts();
        },
        isUnlocked: function (index: number) {
            const single_speciesRef = profile.actions.find(action => action.id === single_species.id);
            const unlockedMasteries = profile.masteriesUnlocked.get(single_speciesRef);

            return unlockedMasteries[index];
        },
        canUnlock: function (modifier: ShoutModifier) {
            const masteryLevel = profile.getMasteryLevel(single_species);

            return masteryLevel >= modifier.level;
        },
        getNextEquipCost: function () {
            const { costs, unlocked } = profile.manager.calculateEquipCost(single_species);

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
            game.bank.removeItemQuantityByID('namespace_profile:Dragon_Soul', 1, true);
            game.gp.remove(this.unlockGPCost);

            const single_speciesRef = profile.actions.find(action => action.id === single_species.id);
            const index = single_speciesRef
                .modifiers(profile.settings.modifierType)
                .findIndex(mod => mod.level === modifier.level);
            const unlockedMasteries = profile.masteriesUnlocked.get(single_speciesRef);

            unlockedMasteries[index] = true;

            profile.masteriesUnlocked.set(single_speciesRef, unlockedMasteries);

            this.updateCosts();
            this.completeUpgrade();
        },
        updateCosts: function () {
            const item = game.items.getObjectByID(`namespace_profile:Dragon_Soul`);

            this.essenceOfProfile = {
                item,
                quantity: game.bank.getQty(item)
            };
        },
        completeUpgrade: function () {
            profile.computeProvidedStats(true);
            profile.renderQueue.shoutModifiers = true;
            profile.renderQueue.gpRange = true;
            profile.renderQueue.grants = true;

            this.state = State.View;
        }
    };
}
