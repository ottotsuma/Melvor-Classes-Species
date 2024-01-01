import { Thuum } from './thuum';
import { Teacher } from './thuum.types';

export class ThuumActionEvent extends SkillActionEvent {
    public skill: Thuum;
    public action: Teacher;

    constructor(skill: Thuum, action: Teacher) {
        super();
        this.skill = skill;
        this.action = action;
    }
}

export interface ThuumActionEventMatcherOptions extends SkillActionEventMatcherOptions {
    type: 'ThuumAction';
    actionIDs?: string[];
}

export class ThuumActionEventMatcher extends SkillActionEventMatcher<ThuumActionEvent> {
    /** If present, the recipe of the action must match a member */
    public actions?: Set<Teacher>;
    public type = <any>'ThuumAction';

    constructor(options: ThuumActionEventMatcherOptions, game: Game) {
        super(options, game);

        if (options.actionIDs !== undefined) {
            const thuum = game.skills.find(skill => skill.id === 'namespace_thuum:Thuum') as Thuum;
            this.actions = thuum.actions.getSetForConstructor(options.actionIDs, this, Teacher.name);
        }
    }

    public doesEventMatch(event: GameEvent): boolean {
        return (
            event instanceof ThuumActionEvent &&
            (this.actions === undefined || this.actions.has(event.action)) &&
            super.doesEventMatch(event)
        );
    }

    public _assignNonRaidHandler(handler: Handler<ThuumActionEvent>) {
        const thuum = this.game.skills.getObjectByID('namespace_thuum:Thuum') as Thuum;
        thuum.on('action', handler);
    }

    public _unassignNonRaidHandler(handler: Handler<ThuumActionEvent>) {
        const thuum = this.game.skills.getObjectByID('namespace_thuum:Thuum') as Thuum;
        thuum.off('action', handler);
    }
}
