import { Thuum } from '../thuum';
import { MasteredShout } from '../thuum.types';
import { DecodeVersion } from './version.base';

export class Version3 implements DecodeVersion {
    constructor(private readonly game: Game, private readonly thuum: Thuum) {}

    public decode(reader: SaveWriter) {
        const version = reader.getUint32();

        if (version !== 3) {
            throw new Error(`Did not read correct version number: ${version} - trying version 3`);
        }

        if (reader.getBoolean()) {
            const teacher = reader.getNamespacedObject(this.thuum.actions);
            if (typeof teacher === 'string' || teacher.level > this.thuum.level) {
                this.thuum.shouldResetAction = true;
            } else {
                this.thuum.activeTeacher = teacher;
            }
        }

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

            const shout1 = this.thuum.shouts.get(1);

            this.thuum.userInterface.shout1.setShout(shout1);

            return {
                key: teacher,
                value: masteredShout
            };
        });

        // Migrate legacy data to new unlocked state.
        for (const action of this.thuum.actions.allObjects) {
            const masteryLevel = this.thuum.getMasteryLevel(action);
            const isUnlocked = action
                .modifiers(this.thuum.settings.modifierType)
                .filter(modifier => modifier.level <= 100)
                .map(modifier => modifier.level <= masteryLevel);

            this.thuum.masteriesUnlocked.set(action, isUnlocked);
        }
    }
}
