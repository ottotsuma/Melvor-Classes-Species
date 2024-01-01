import { Classes } from '../classes';
import { MasteredShout } from '../classes.types';
import { DecodeVersion } from './version.base';

export class Version3 implements DecodeVersion {
    constructor(private readonly game: Game, private readonly classes: Classes) {}

    public decode(reader: SaveWriter) {
        const version = reader.getUint32();

        if (version !== 3) {
            throw new Error(`Did not read correct version number: ${version} - trying version 3`);
        }

        if (reader.getBoolean()) {
            const teacher = reader.getNamespacedObject(this.classes.actions);
            if (typeof teacher === 'string' || teacher.level > this.classes.level) {
                // this.classes.shouldResetAction = true;
            } else {
                this.classes.activeTeacher = teacher;
            }
        }

        reader.getComplexMap(reader => {
            const teacher = reader.getNamespacedObject(this.classes.actions);
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

                this.classes.shouts.set(teacher, masteredShout);
            }

            const shout1 = this.classes.shouts.get(1);

            this.classes.userInterface.shout1.setShout(shout1);

            return {
                key: teacher,
                value: masteredShout
            };
        });

        // Migrate legacy data to new unlocked state.
        for (const action of this.classes.actions.allObjects) {
            const masteryLevel = this.classes.getMasteryLevel(action);
            const isUnlocked = action
                .modifiers(this.classes.settings.modifierType)
                .filter(modifier => modifier.level <= 100)
                .map(modifier => modifier.level <= masteryLevel);

            this.classes.masteriesUnlocked.set(action, isUnlocked);
        }
    }
}
