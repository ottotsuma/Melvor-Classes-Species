import { Thuum } from '../thuum';
import { MasteredShout } from '../thuum.types';
import { DecodeVersion } from './version.base';

export class Version2 implements DecodeVersion {
    constructor(private readonly thuum: Thuum) {}

    public decode(reader: SaveWriter) {
        const version = reader.getUint32();

        if (version !== 2) {
            throw new Error(`Did not read correct version number: ${version} - trying version 2`);
        }

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

        if (reader.getBoolean()) {
            const teacher = reader.getNamespacedObject(this.thuum.actions);

            if (typeof teacher === 'string' || teacher.level > this.thuum.level) {
                this.thuum.shouldResetAction = true;
            } else {
                const masteredShout: MasteredShout = {
                    teacher,
                    slot: 2,
                    socket: undefined,
                    utility: undefined
                };

                this.thuum.shouts.set(teacher, masteredShout);

            }
        }

        if (this.thuum.shouldResetAction) {
            this.thuum.resetActionState();
        }
    }
}
