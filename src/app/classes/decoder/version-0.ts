import { Classes } from '../classes';
import { MasteredShout } from '../classes.types';
import { DecodeVersion } from './version.base';

export class Version0 implements DecodeVersion {
    constructor(private readonly classes: Classes) {}

    public decode(reader: SaveWriter) {
        if (reader.getBoolean()) {
            const teacher = reader.getNamespacedObject(this.classes.actions);

            if (typeof teacher === 'string' || teacher.level > this.classes.level) {
                // // this.classes.shouldResetAction = true;
            } else {
                this.classes.activeTeacher = teacher;
            }
        }

        if (reader.getBoolean()) {
            const teacher = reader.getNamespacedObject(this.classes.actions);

            if (typeof teacher === 'string' || teacher.level > this.classes.level) {
                // this.classes.shouldResetAction = true;
            } else {
                const masteredShout: MasteredShout = {
                    teacher,
                    slot: 1,
                    socket: undefined,
                    utility: undefined
                };

                this.classes.shouts.set(teacher, masteredShout);

                this.classes.userInterface.shout1.setShout(masteredShout);
            }
        }

        // if (this.classes.shouldResetAction) {
        //     this.classes.resetActionState();
        // }
    }
}
