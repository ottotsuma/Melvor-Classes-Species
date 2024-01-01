import { Thuum } from '../thuum';
import { MasteredShout } from '../thuum.types';
import { DecodeVersion } from './version.base';

export class Version4 implements DecodeVersion {
    constructor(private readonly game: Game, private readonly thuum: Thuum) {}

    public decode(reader: SaveWriter) {
        const version = reader.getUint32();

        if (version !== 4) {
            throw new Error(`Did not read correct version number: ${version} - trying version 4`);
        }

        if (reader.getBoolean()) {
            const teacher = reader.getNamespacedObject(this.thuum.actions);
            if (typeof teacher === 'string' || teacher.level > this.thuum.level) {
                this.thuum.shouldResetAction = true;
            } else {
                this.thuum.activeTeacher = teacher;
            }
        }

        reader.getArray(reader => {
            const teacher = reader.getNamespacedObject(this.thuum.actions);

            if (typeof teacher !== 'string') {
                const masteriesUnlocked: boolean[] = [];

                reader.getArray(reader => {
                    const isUnlocked = reader.getBoolean();
                    masteriesUnlocked.push(isUnlocked);
                });

                this.thuum.masteriesUnlocked.set(teacher, masteriesUnlocked);
            }
        });

        reader.getComplexMap(reader => {
            const teacher = reader.getNamespacedObject(this.thuum.actions);
            const slot = reader.getUint32();
            let socket: string | Item;

            if (reader.getBoolean()) {
                socket = reader.getNamespacedObject(this.game.items);
            }

            let utility: string | Item;

            if (reader.getBoolean()) {
                utility = reader.getNamespacedObject(this.game.items);
            }

            let masteredShout: MasteredShout;

            if (typeof teacher !== 'string') {
                masteredShout = {
                    teacher,
                    slot,
                    socket: typeof socket !== 'string' ? socket : undefined,
                    utility: typeof utility !== 'string' ? utility : undefined
                };

                this.thuum.shouts.set(teacher, masteredShout);
            }

            return {
                key: teacher,
                value: masteredShout
            };
        });

        const shout1 = this.thuum.shouts.get(1);

        this.thuum.userInterface.shout1.setShout(shout1);
    }
}
