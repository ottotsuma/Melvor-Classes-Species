import { ShoutComponent } from './shout/shout';
import { Single_SpeciesComponent } from './single_species/single_species';
import { LockedComponent } from './locked/locked';
import { Profile } from './profile';
import { Single_Species } from './profile.types';

export class UserInterface {
    public readonly species = new Map<Single_Species, ReturnType<typeof Single_SpeciesComponent>>();

    public locked: ReturnType<typeof LockedComponent>;
    public shout1: ReturnType<typeof ShoutComponent>;
    public shout2: ReturnType<typeof ShoutComponent>;


    public get mainContainer() {
        return document.getElementById('main-container');
    }

    public get speciesContainer() {
        return document.getElementById('species-container');
    }

    public get classesContainer() {
        return document.getElementById('classes-container');
    }

    public get shoutContainer() {
        return document.getElementById('shout-container');
    }

    constructor(
        private readonly context: Modding.ModContext,
        private readonly game: Game,
        private readonly profile: Profile
    ) {}

    public init() {
        this.context.onInterfaceAvailable(async () => {
            this.mainContainer.append(...this.profile.manager.elements);

            this.modifySkillInfoClass(this.mainContainer);

            for (const single_species of this.profile.sortedMasteryActions) {
                const component = Single_SpeciesComponent(this.profile, single_species, this.game);
                if(this.profile.classIds.includes(single_species._localID)) {
                    ui.create(component, this.classesContainer);
                } else {
                    ui.create(component, this.speciesContainer);
                }

                this.species.set(single_species, component);
            }

            this.locked = LockedComponent(this.profile);
            ui.create(this.locked, this.speciesContainer);
            ui.create(this.locked, this.classesContainer);

            this.shout1 = ShoutComponent(this.profile);
            this.shout2 = ShoutComponent(this.profile);

            ui.create(this.shout1, this.shoutContainer);
            ui.create(this.shout2, this.shoutContainer);
        });
    }

    private modifySkillInfoClass(mainContainer: HTMLElement) {
        // The isMobile function is bugged as it doesn't actually call isAndroid???
        const isMobile = isIOS() || isAndroid() || location.pathname.includes('index_mobile.php');

        if (!isMobile) {
            return;
        }

        const skillInfo = mainContainer.querySelector('#profile-container .profile-skill-info');

        if (!skillInfo) {
            return;
        }

        skillInfo.classList.remove('skill-info');
        skillInfo.classList.add('skill-info-mobile');
    }
}
