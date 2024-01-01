import { Thuum } from '../thuum';
import { ShoutModifier, MasteredShout } from '../thuum.types';

import './shout.scss';

export function ShoutComponent(thuum: Thuum) {
    return {
        $template: '#thuum-shout',
        shout: undefined as MasteredShout,
        isEnabled: false,
        modifiers: [] as ShoutModifier[],
        currentMasteryLevel: 1,
        essenceIcon: function () {
            return thuum.manager.essenceOfThuumIcon;
        },
        setShout: function (shout: MasteredShout) {
            this.shout = shout;
            this.updateCurrentMasteryLevel();
        },
        updateCurrentMasteryLevel: function () {
            if (this.shout) {
                const teacher = this.shout.teacher;
                const teacherRef = thuum.actions.allObjects.find(action => action.id === teacher.id);

                this.currentMasteryLevel = thuum.getMasteryLevel(teacherRef);
            }
        },
        updateEnabled: function (enabled: boolean) {
            this.isEnabled = enabled;
        },
        updateModifiers: function () {
            this.modifiers = [];

            if (this.shout) {
                this.modifiers = thuum.manager.getModifiers(this.shout.teacher);
            }
        }
    };
}
