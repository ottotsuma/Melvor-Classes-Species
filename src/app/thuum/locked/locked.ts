import { Thuum } from '../thuum';

import './locked.scss';

export function LockedComponent(thuum: Thuum) {
    return {
        $template: '#thuum-teacher-locked',
        isVisible: false,
        level: 1,
        get icon() {
            return thuum.getMediaURL('assets/locked-teacher.png');
        },
        update: function () {
            const nextUnlock = this.getNextUnlock();

            this.isVisible = nextUnlock !== undefined;
            this.level = nextUnlock?.level ?? 1;
        },
        getNextUnlock: function () {
            return thuum.actions.find(action => action.level > thuum.level);
        }
    };
}
