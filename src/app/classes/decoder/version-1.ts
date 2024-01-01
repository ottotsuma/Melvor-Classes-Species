import { Classes } from '../classes';
import { MasteredShout } from '../classes.types';
import { DecodeVersion } from './version.base';

/**
 * Legacy save version, didn't realise saves were this finicky and should have saved version number initially.
 * Had to do save version as string so I could read it properly.
 */
export class Version1 implements DecodeVersion {
    constructor(private readonly classes: Classes) {}

    public decode(reader: SaveWriter) {
        const skillVersionString = reader.getString();

        // Try parsing the version - this is painful because I didn't save a version number initially, needed this gimicky
        // work around as there is no way to tell data is legacy other then failing.
        const version = parseInt(skillVersionString.split('namespace_classesVersion:')[1].split(':')[0]);

        if (version !== 1) {
            throw new Error(`Did not read correct version number: ${version} - trying version 1`);
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
