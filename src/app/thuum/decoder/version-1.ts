import { Thuum } from '../thuum';
import { MasteredShout } from '../thuum.types';
import { DecodeVersion } from './version.base';

/**
 * Legacy save version, didn't realise saves were this finicky and should have saved version number initially.
 * Had to do save version as string so I could read it properly.
 */
export class Version1 implements DecodeVersion {
    constructor(private readonly thuum: Thuum) {}

    public decode(reader: SaveWriter) {
        const skillVersionString = reader.getString();

        // Try parsing the version - this is painful because I didn't save a version number initially, needed this gimicky
        // work around as there is no way to tell data is legacy other then failing.
        const version = parseInt(skillVersionString.split('namespace_thuumVersion:')[1].split(':')[0]);

        if (version !== 1) {
            throw new Error(`Did not read correct version number: ${version} - trying version 1`);
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
