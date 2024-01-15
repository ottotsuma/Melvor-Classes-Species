import { Profile } from '../profile/profile';

export class TinyPassiveIconsCompatibility {
    private readonly tinyIconTags = {
        increasedProfileEquipCost: ['profile', 'gp'],
        decreasedProfileEquipCost: ['profile', 'gp'],
        increasedProfileGP: ['profile', 'gp'],
        decreasedProfileGP: ['profile', 'gp'],
        increasedSkillMasteryXPPerVariel: ['skill']
    };

    constructor(private readonly context: Modding.ModContext, private readonly profile: Profile) {}

    public patch() {
        this.context.onModsLoaded(() => {
            if (!this.isLoaded()) {
                return;
            }

            const tinyIcons = mod.api.tinyIcons;

            const profileTags: Record<string, string> = {
                profile: this.profile.media,
                shrimp: tinyIcons.getIconResourcePath('bank', 'shrimp'),
            };

            for (const single_species of this.profile.actions.allObjects) {
                profileTags[single_species.localID] = single_species.media;
            }

            for (const rareDrop of this.profile.rareDrops) {
                profileTags[rareDrop.item.localID] = rareDrop.item.media;
            }

            tinyIcons.addTagSources(profileTags);
            tinyIcons.addCustomModifiers(this.tinyIconTags);
        });
    }

    private isLoaded() {
        return mod.manager.getLoadedModList().includes('Tiny Icons');
    }
}
