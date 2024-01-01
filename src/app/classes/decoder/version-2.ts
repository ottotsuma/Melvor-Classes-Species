import { Classes } from '../classes';
import { MasteredShout } from '../classes.types';
import { DecodeVersion } from './version.base';

export class Version2 implements DecodeVersion {
    constructor(private readonly classes: Classes) {}

    public decode(reader: SaveWriter) {
        const version = reader.getUint32();

        if (version !== 2) {
            throw new Error(`Did not read correct version number: ${version} - trying version 2`);
        }

        if (reader.getBoolean()) {
            const teacher = reader.getNamespacedObject(this.classes.actions);
            if (typeof teacher === 'string' || teacher.level > this.classes.level) {
                // this.classes.shouldResetAction = true;
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

        if (reader.getBoolean()) {
            const teacher = reader.getNamespacedObject(this.classes.actions);

            if (typeof teacher === 'string' || teacher.level > this.classes.level) {
                // this.classes.shouldResetAction = true;
            } else {
                const masteredShout: MasteredShout = {
                    teacher,
                    slot: 2,
                    socket: undefined,
                    utility: undefined
                };

                this.classes.shouts.set(teacher, masteredShout);

            }
        }

        // if (this.classes.shouldResetAction) {
        //     this.classes.resetActionState();
        // }
    }
}
