import { Profile } from '../profile';
import { YouModifier, MasteredYou } from '../profile.types';

import './you.scss';

export function YouComponent(profile: Profile) {
    return {
        $template: '#profile-you',
        you: undefined as MasteredYou,
        get media() {
            return this.you?.media;
        },
        get name() {
            return this.you?.name;
        },
        isEnabled: false,
        modifiers: [] as YouModifier[],
        currentMasteryLevel: 1,
        essenceIcon: function () {
            return profile.manager.essenceOfProfileIcon;
        },
        setYou: function (you: MasteredYou) {
            if (!you) {
                this.you = undefined
            } else {

                this.you = you
                this.updateCurrentMasteryLevel();
            }
        },
        updateCurrentMasteryLevel: function () {
            if (this.you) {
                const single_speciesRef = profile.actions.allObjects.find(action => action.id === this.you.single_species.id);

                this.currentMasteryLevel = profile.getMasteryLevel(single_speciesRef);
            }
        },
        updateEnabled: function (enabled: boolean) {
            this.isEnabled = enabled;
        },
        updateModifiers: function () {
            this.modifiers = [];

            if (this.you) {
                this.modifiers = profile.manager.getModifiers(this.you.single_species);
            }
        }
    };
}
