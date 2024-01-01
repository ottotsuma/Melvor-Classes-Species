import { Thuum } from '../thuum';
import { MasteredShout } from '../thuum.types';
import { DecodeVersion } from './version.base';

export class Version0 implements DecodeVersion {
    constructor(private readonly thuum: Thuum) {}

    public decode(reader: SaveWriter) {
        if (reader.getBoolean()) {
            const teacher = reader.getNamespacedObject(this.thuum.actions);

            if (typeof teacher === 'string' || teacher.level > this.thuum.level) {
                this.thuum.shouldResetAction = true;
            } else {
                this.thuum.activeTeacher = teacher;
            }
        }

        if (reader.getBoolean()) {
            const teacher = reader.getNamespacedObject(this.thuum.actions);

            if (typeof teacher === 'string' || teacher.level > this.thuum.level) {
                this.thuum.shouldResetAction = true;
            } else {
                const masteredShout: MasteredShout = {
                    teacher,
                    slot: 1,
                    socket: undefined,
                    utility: undefined
                };

                this.thuum.shouts.set(teacher, masteredShout);

                this.thuum.userInterface.shout1.setShout(masteredShout);
            }
        }

        if (this.thuum.shouldResetAction) {
            this.thuum.resetActionState();
        }
    }
}
