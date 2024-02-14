import { Profile } from '../profile';
import { Single_Species } from '../profile.types';

import './single_species.scss';

export function Single_SpeciesComponent(profile: Profile, single_species: Single_Species, game: Game) {
    return {
        $template: '#profile-single_species',
        single_species,
        single_speciesName: single_species.name,
        media: single_species.media,
        id: single_species.id,
        localId: single_species.localID.toLowerCase(),
        disabled: false,
        progressBar: {} as ProgressBar,
        mounted: function () {
            const grantsContainer = document
                .querySelector(`#${this.localId}`)
                .querySelector('#grants-container') as HTMLElement;

            this.xpIcon = new XPIcon(grantsContainer, 0, 0, 32);
            this.masteryIcon = new MasteryXPIcon(grantsContainer, 0, 0, 32);
            this.masteryPoolIcon = new MasteryPoolIcon(grantsContainer, 0, 32);
            // this.intervalIcon = new IntervalIcon(grantsContainer, 0, 32);

            const progressBar = document
                .querySelector(`#${this.localId}`)
                .querySelector('.progress-bar') as HTMLElement;

            this.progressBar = new ProgressBar(progressBar, 'bg-secondary');
        },
        updateGrants: function (
            xp: number,
            baseXP: number,
            masteryXP: number,
            baseMasteryXP: number,
            masteryPoolXP: number,
        ) {
            this.xpIcon.setXP(xp, baseXP);
            this.masteryIcon.setXP(masteryXP, baseMasteryXP);
            this.masteryPoolIcon.setXP(masteryPoolXP);
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
                    if(!/(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg|svg)$/.test(media)) {
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
