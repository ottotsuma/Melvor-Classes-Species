import { Classes } from '../classes';
import { ShoutModifier, MasteredShout } from '../classes.types';

import './shout.scss';

export function ShoutComponent(classes: Classes) {
    return {
        $template: '#classes-shout',
        shout: undefined as MasteredShout,
        isEnabled: false,
        modifiers: [] as ShoutModifier[],
        currentMasteryLevel: 1,
        essenceIcon: function () {
            return classes.manager.essenceOfClassesIcon;
        },
        setShout: function (shout: MasteredShout) {
            this.shout = shout;
            this.updateCurrentMasteryLevel();
        },
        updateCurrentMasteryLevel: function () {
            if (this.shout) {
                const teacher = this.shout.teacher;
                const teacherRef = classes.actions.allObjects.find(action => action.id === teacher.id);

                this.currentMasteryLevel = classes.getMasteryLevel(teacherRef);
            }
        },
        updateEnabled: function (enabled: boolean) {
            this.isEnabled = enabled;
        },
        updateModifiers: function () {
            this.modifiers = [];

            if (this.shout) {
                this.modifiers = classes.manager.getModifiers(this.shout.teacher);
            }
        }
    };
}
