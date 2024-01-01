import { Profile } from '../profile';

import './locked.scss';

export function LockedComponent(profile: Profile) {
    return {
        $template: '#profile-single_species-locked',
        isVisible: false,
        level: 1,
        get icon() {
            return profile.getMediaURL('assets/locked-single_species.png');
        },
        update: function () {
            const nextUnlock = this.getNextUnlock();

            this.isVisible = nextUnlock !== undefined;
            this.level = nextUnlock?.level ?? 1;
        },
        getNextUnlock: function () {
            return profile.actions.find(action => action.level > profile.level);
        }
    };
}
