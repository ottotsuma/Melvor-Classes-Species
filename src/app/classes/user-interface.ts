import { ShoutComponent } from './shout/shout';
import { TeacherComponent } from './teacher/teacher';
import { LockedComponent } from './locked/locked';
import { Classes } from './classes';
import { Teacher } from './classes.types';

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
        private readonly classes: Classes
    ) {}

    public init() {
        this.context.onInterfaceAvailable(async () => {
            this.mainContainer.append(...this.classes.manager.elements);

            this.modifySkillInfoClass(this.mainContainer);

            for (const teacher of this.classes.sortedMasteryActions) {
                const component = TeacherComponent(this.classes, teacher, this.game);

                ui.create(component, this.teachersContainer);

                this.teachers.set(teacher, component);
            }

            this.locked = LockedComponent(this.classes);
            ui.create(this.locked, this.teachersContainer);

            this.shout1 = ShoutComponent(this.classes);

            ui.create(this.shout1, this.shoutContainer);
        });
    }

    private modifySkillInfoClass(mainContainer: HTMLElement) {
        // The isMobile function is bugged as it doesn't actually call isAndroid???
        const isMobile = isIOS() || isAndroid() || location.pathname.includes('index_mobile.php');

        if (!isMobile) {
            return;
        }

        const skillInfo = mainContainer.querySelector('#classes-container .classes-skill-info');

        if (!skillInfo) {
            return;
        }

        skillInfo.classList.remove('skill-info');
        skillInfo.classList.add('skill-info-mobile');
    }
}
