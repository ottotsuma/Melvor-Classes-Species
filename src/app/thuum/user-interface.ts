import { ShoutComponent } from './shout/shout';
import { TeacherComponent } from './teacher/teacher';
import { LockedComponent } from './locked/locked';
import { Thuum } from './thuum';
import { Teacher } from './thuum.types';

export class UserInterface {
    public readonly teachers = new Map<Teacher, ReturnType<typeof TeacherComponent>>();
    public locked: ReturnType<typeof LockedComponent>;
    public shout1: ReturnType<typeof ShoutComponent>;

    public get mainContainer() {
        return document.getElementById('main-container');
    }

    public get teachersContainer() {
        return document.getElementById('teachers-container');
    }

    public get shoutContainer() {
        return document.getElementById('shout-container');
    }

    constructor(
        private readonly context: Modding.ModContext,
        private readonly game: Game,
        private readonly thuum: Thuum
    ) {}

    public init() {
        this.context.onInterfaceAvailable(async () => {
            this.mainContainer.append(...this.thuum.manager.elements);

            this.modifySkillInfoClass(this.mainContainer);

            for (const teacher of this.thuum.sortedMasteryActions) {
                const component = TeacherComponent(this.thuum, teacher, this.game);

                ui.create(component, this.teachersContainer);

                this.teachers.set(teacher, component);
            }

            this.locked = LockedComponent(this.thuum);
            ui.create(this.locked, this.teachersContainer);

            this.shout1 = ShoutComponent(this.thuum);

            ui.create(this.shout1, this.shoutContainer);
        });
    }

    private modifySkillInfoClass(mainContainer: HTMLElement) {
        // The isMobile function is bugged as it doesn't actually call isAndroid???
        const isMobile = isIOS() || isAndroid() || location.pathname.includes('index_mobile.php');

        if (!isMobile) {
            return;
        }

        const skillInfo = mainContainer.querySelector('#thuum-container .thuum-skill-info');

        if (!skillInfo) {
            return;
        }

        skillInfo.classList.remove('skill-info');
        skillInfo.classList.add('skill-info-mobile');
    }
}
