import { Profile } from '../profile';
import { Single_Species } from '../profile.types';

import './single_species.scss';

export interface Single_SpeciesContext {
    media: string;
    name: string;
    single_speciesId: string;
}
// TeacherComponent ? 
export function Single_SpeciesComponent(profile: Profile, single_species: Single_Species, game: Game) {
    return {
        $template: '#profile-single_species',
        single_species,
        single_speciesName: single_species.name,
        media: single_species.media,
        id: single_species.id,
        localId: single_species.localID.toLowerCase(),
        disabled: false, // @ts-ignore 
        progressBar: {} as ProgressBarElement,
        mounted: function () {
            const grantsContainer = document
                .querySelector(`#${this.localId}`)
                .querySelector('#grants-container') as HTMLElement;

            this.xpIcon = grantsContainer.querySelector('#profile-xp');
            this.masteryIcon = grantsContainer.querySelector('#profile-mastery-xp');
            this.masteryPoolIcon = grantsContainer.querySelector('#profile-pool-xp');

            const progressBar = document
                .querySelector(`#${this.localId}`) // @ts-ignore 
                .querySelector<ProgressBarElement>('progress-bar');
        },
        updateGrants: function (
            xp: number,
            baseXP: number,
            masteryXP: number,
            baseMasteryXP: number,
            masteryPoolXP: number,            
            // @ts-ignore // TODO: TYPES
            realm: Realm
        ) {
            this.xpIcon.setXP(xp, baseXP); // @ts-ignore 
            this.xpIcon.setSources(game.profile.getXPSources(single_species));
            this.masteryIcon.setXP(masteryXP, baseMasteryXP); // @ts-ignore 
            this.masteryIcon.setSources(game.profile.getMasteryXPSources(single_species));
            this.masteryPoolIcon.setXP(masteryPoolXP);

            game.unlockedRealms.length > 1 ? this.masteryPoolIcon.setRealm(realm) : this.masteryPoolIcon.hideRealms();
        },
        Master: function () {
            profile.Master(single_species);
        },
        mastery: function () {
            profile.unlockMastery(single_species);
        },
        Explain: function () {
            profile.Explain(single_species);
        },
        updateDisabled: function () {
            this.disabled = profile.yous.isMastered(single_species);
        },
        getSkillIcons: function () {
            return single_species.skills.map(media => {
                try {
                    if (!/(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg|svg)$/.test(media)) {
                        return game.skills.find(skill => skill.id === media)?.media;
                    } else {
                        return media
                    }
                } catch (error) {
                    return "https://cdn2-main.melvor.net/assets/april/images/lemon.jpg"
                }
            });
        },
    };
}
