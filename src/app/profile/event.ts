import { Profile } from './profile';
import { Single_Species } from './profile.types';

export class ProfileActionEvent extends SkillActionEvent {
    public skill: Profile;
    public action: Single_Species;

    constructor(skill: Profile, action: Single_Species) {
        super();
        this.skill = skill;
        this.action = action;
    }
}

export interface ProfileActionEventMatcherOptions extends SkillActionEventMatcherOptions {
    type: 'ProfileAction';
    actionIDs?: string[];
}

export class ProfileActionEventMatcher extends SkillActionEventMatcher<ProfileActionEvent> {
    /** If present, the recipe of the action must match a member */
    public actions?: Set<Single_Species>;
    public type = <any>'ProfileAction';

    constructor(options: ProfileActionEventMatcherOptions, game: Game) {
        super(options, game);

        if (options.actionIDs !== undefined) {
            const profile = game.skills.find(skill => skill.id === 'namespace_profile:Profile') as Profile;
            this.actions = profile.actions.getSetForConstructor(options.actionIDs, this, Single_Species.name);
        }
    }

    public doesEventMatch(event: GameEvent): boolean {
        return (
            event instanceof ProfileActionEvent &&
            (this.actions === undefined || this.actions.has(event.action)) &&
            super.doesEventMatch(event)
        );
    }

    public _assignNonRaidHandler(handler: Handler<ProfileActionEvent>) {
        const profile = this.game.skills.getObjectByID('namespace_profile:Profile') as Profile;
        profile.on('action', handler);
    }

    public _unassignNonRaidHandler(handler: Handler<ProfileActionEvent>) {
        const profile = this.game.skills.getObjectByID('namespace_profile:Profile') as Profile;
        profile.off('action', handler);
    }
}
