import { Profile } from './profile';
import { YouModifier, Single_Species } from './profile.types';

export class ProfileManager {
    public get elements() {
        const fragment = new DocumentFragment();

        fragment.append(getTemplateNode('profile'));

        return [...fragment.children];
    }

    public get essenceOfProfileIcon() {
        return this.game.items.getObjectByID('namespace_profile:Profile_Token')?.media;
    }

    constructor(private readonly profile: Profile, private readonly game: Game) { }

    /** Gets modifier metadata. */
    public getModifiers(single_species: Single_Species) {
        if (!single_species.id) {
            return [] as YouModifier[];
        }
        return single_species.modifiers(this.profile.settings.modifierType).map(modifier => {
            let description: any[] = [];
            if (modifier.modifiers) {
                for (let index = 0; index < modifier.modifiers.length; index++) {
                    // @ts-ignore 
                    description.push(modifier.modifiers[index].getDescription())
                }
            }
            if (modifier.combatEffects) {
                for (let index = 0; index < modifier.combatEffects.length; index++) {
                    // @ts-ignore 
                    const obj1 = modifier.combatEffects[index].getDescription()
                    // @ts-ignore 
                    obj1.description = obj1.text
                    description.push(obj1)
                }
            }
            if (!modifier.modifiers && !modifier.combatEffects) {
                console.log('Nothing here: ', modifier)
            }

            return {
                description,
                isActive: this.isModifierActive(single_species, modifier),
                level: modifier.level
            } as YouModifier;
        });
    }

    /** Gets modifiers and constructs object needed to apply the modifier to the player. */
    public getModifiersForApplication(single_species: Single_Species) {
        if (this.profile.level < single_species.level) {
            return [];
        }
        return single_species.modifiers(this.profile.settings.modifierType).filter(modifier => this.isModifierActive(single_species, modifier));
    }

    public calculateEquipCost(single_species: Single_Species) {
        const MasterCostMap = [
            this.profile.settings.youEquipCostOne || 0,
            this.profile.settings.youEquipCostTwo || 0,
            this.profile.settings.youEquipCostThree || 10000,
            this.profile.settings.youEquipCostFour || 100000,
            this.profile.settings.youEquipCostFive || 1000000,
            this.profile.settings.youEquipCostSix || 10000000,
            this.profile.settings.youEquipCostSeven || 100000000
        ];
        const single_speciesRef = this.profile.actions.find(action => action.id === single_species.id);
        const unlocked = this.profile.masteriesUnlocked.get(single_speciesRef).filter(isUnlocked => isUnlocked).length;

        return { costs: MasterCostMap, unlocked };
    }

    public getEquipCostModifier(single_species: Single_Species) {
        // @ts-ignore 
        let modifier = this.game.modifiers.getValue('namespace_profile:ProfileEquipCost', this.profile.getActionModifierQuery(single_species));
        return Math.max(modifier, -95);
    }

    private isModifierActive(single_species: Single_Species, modifier: StatObject) {
        single_species = this.profile.actions.find(action => action.id === single_species.id);

        let unlockedMasteries = this.profile.masteriesUnlocked.get(single_species);

        const validModifierLevels = single_species
            .modifiers(this.profile.settings.modifierType)
            .filter((modifier, index) => unlockedMasteries[index])
            .map(single_species => single_species.level);

        return validModifierLevels.includes(modifier.level);
    }
}
