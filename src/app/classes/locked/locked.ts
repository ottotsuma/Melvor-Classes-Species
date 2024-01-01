import { Classes } from '../classes';

import './locked.scss';

export function LockedComponent(classes: Classes) {
    return {
        $template: '#classes-teacher-locked',
        isVisible: false,
        level: 1,
        get icon() {
            return classes.getMediaURL('assets/locked-teacher.png');
        },
        update: function () {
            const nextUnlock = this.getNextUnlock();

            this.isVisible = nextUnlock !== undefined;
            this.level = nextUnlock?.level ?? 1;
        },
        getNextUnlock: function () {
            return classes.actions.find(action => action.level > classes.level);
        }
    };
}
