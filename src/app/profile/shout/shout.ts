import { Profile } from '../profile';
import { ShoutModifier, MasteredShout } from '../profile.types';

import './shout.scss';

export function ShoutComponent(profile: Profile) {
    return {
        $template: '#profile-shout',
        shout: undefined as MasteredShout,
        isEnabled: false,
        modifiers: [] as ShoutModifier[],
        currentMasteryLevel: 1,
        essenceIcon: function () {
            return profile.manager.essenceOfProfileIcon;
        },
        setShout: function (shout: MasteredShout) {
            this.shout = shout;
            this.updateCurrentMasteryLevel();
        },
        updateCurrentMasteryLevel: function () {
            if (this.shout) {
                const single_species = this.shout.single_species;
                const single_speciesRef = profile.actions.allObjects.find(action => action.id === single_species.id);

                this.currentMasteryLevel = profile.getMasteryLevel(single_speciesRef);
            }
        },
        updateEnabled: function (enabled: boolean) {
            this.isEnabled = enabled;
        },
        updateModifiers: function () {
            this.modifiers = [];

            if (this.shout) {
                this.modifiers = profile.manager.getModifiers(this.shout.single_species);
            }
        }
    };
}
