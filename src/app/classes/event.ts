import { Classes } from './classes';
import { Teacher } from './classes.types';

export class ClassesActionEvent extends SkillActionEvent {
    public skill: Classes;
    public action: Teacher;

    constructor(skill: Classes, action: Teacher) {
        super();
        this.skill = skill;
        this.action = action;
    }
}

export interface ClassesActionEventMatcherOptions extends SkillActionEventMatcherOptions {
    type: 'ClassesAction';
    actionIDs?: string[];
}

export class ClassesActionEventMatcher extends SkillActionEventMatcher<ClassesActionEvent> {
    /** If present, the recipe of the action must match a member */
    public actions?: Set<Teacher>;
    public type = <any>'ClassesAction';

    constructor(options: ClassesActionEventMatcherOptions, game: Game) {
        super(options, game);

        if (options.actionIDs !== undefined) {
            const classes = game.skills.find(skill => skill.id === 'namespace_classes:Classes') as Classes;
            this.actions = classes.actions.getSetForConstructor(options.actionIDs, this, Teacher.name);
        }
    }

    public doesEventMatch(event: GameEvent): boolean {
        return (
            event instanceof ClassesActionEvent &&
            (this.actions === undefined || this.actions.has(event.action)) &&
            super.doesEventMatch(event)
        );
    }

    public _assignNonRaidHandler(handler: Handler<ClassesActionEvent>) {
        const classes = this.game.skills.getObjectByID('namespace_classes:Classes') as Classes;
        classes.on('action', handler);
    }

    public _unassignNonRaidHandler(handler: Handler<ClassesActionEvent>) {
        const classes = this.game.skills.getObjectByID('namespace_classes:Classes') as Classes;
        classes.off('action', handler);
    }
}
