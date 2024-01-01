import { Thuum } from '../thuum/thuum';

export class TinyPassiveIconsCompatibility {
    private readonly tinyIconTags = {
        increasedThuumEquipCost: ['thuum', 'gp'],
        decreasedThuumEquipCost: ['thuum', 'gp'],
        increasedThuumGP: ['thuum', 'gp'],
        decreasedThuumGP: ['thuum', 'gp'],
        increasedThuumAdditionalRewardRoll: ['thuum'],
        decreasedThuumAdditionalRewardRoll: ['thuum'],
        increasedSkillMasteryXPPerVariel: ['skill']
    };

    constructor(private readonly context: Modding.ModContext, private readonly thuum: Thuum) {}

    public patch() {
        this.context.onModsLoaded(() => {
            if (!this.isLoaded()) {
                return;
            }

            const tinyIcons = mod.api.tinyIcons;

            const thuumTags: Record<string, string> = {
                thuum: this.thuum.media,
                shrimp: tinyIcons.getIconResourcePath('bank', 'shrimp'),
            };

            for (const teacher of this.thuum.actions.allObjects) {
                thuumTags[teacher.localID] = teacher.media;
            }

            for (const rareDrop of this.thuum.rareDrops) {
                thuumTags[rareDrop.item.localID] = rareDrop.item.media;
            }

            tinyIcons.addTagSources(thuumTags);
            tinyIcons.addCustomModifiers(this.tinyIconTags);
        });
    }

    private isLoaded() {
        return mod.manager.getLoadedModList().includes('Tiny Icons');
    }
}
