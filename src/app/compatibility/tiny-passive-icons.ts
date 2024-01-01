import { Classes } from '../classes/classes';

export class TinyPassiveIconsCompatibility {
    private readonly tinyIconTags = {
        increasedClassesEquipCost: ['classes', 'gp'],
        decreasedClassesEquipCost: ['classes', 'gp'],
        increasedClassesGP: ['classes', 'gp'],
        decreasedClassesGP: ['classes', 'gp'],
        increasedClassesAdditionalRewardRoll: ['classes'],
        decreasedClassesAdditionalRewardRoll: ['classes'],
        increasedSkillMasteryXPPerVariel: ['skill']
    };

    constructor(private readonly context: Modding.ModContext, private readonly classes: Classes) {}

    public patch() {
        this.context.onModsLoaded(() => {
            if (!this.isLoaded()) {
                return;
            }

            const tinyIcons = mod.api.tinyIcons;

            const classesTags: Record<string, string> = {
                classes: this.classes.media,
                shrimp: tinyIcons.getIconResourcePath('bank', 'shrimp'),
            };

            for (const teacher of this.classes.actions.allObjects) {
                classesTags[teacher.localID] = teacher.media;
            }

            for (const rareDrop of this.classes.rareDrops) {
                classesTags[rareDrop.item.localID] = rareDrop.item.media;
            }

            tinyIcons.addTagSources(classesTags);
            tinyIcons.addCustomModifiers(this.tinyIconTags);
        });
    }

    private isLoaded() {
        return mod.manager.getLoadedModList().includes('Tiny Icons');
    }
}
