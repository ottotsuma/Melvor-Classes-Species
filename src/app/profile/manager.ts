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
    // static getDescriptions(statObject, negMult=1, posMult=1, includeZero=true) {
    //     const descriptions = [];
    //     if (statObject.modifiers !== undefined) {
    //         statObject.modifiers.forEach((modValue)=>{
    //             if (this.showDescription(modValue.isNegative, negMult, posMult, includeZero))
    //                 descriptions.push(modValue.print(negMult, posMult));
    //         }
    //         );
    //     }
    //     if (statObject.combatEffects !== undefined) {
    //         statObject.combatEffects.forEach((applicator)=>{
    //             const desc = applicator.getDescription(negMult, posMult);
    //             if (desc !== undefined && this.showDescription(applicator.isNegative, negMult, posMult, includeZero)) {
    //                 descriptions.push(desc);
    //             }
    //         }
    //         );
    //     }
    //     if (statObject.conditionalModifiers !== undefined) {
    //         statObject.conditionalModifiers.forEach((conditional)=>{
    //             const desc = conditional.getDescription(negMult, posMult);
    //             if (desc !== undefined && this.showDescription(conditional.isNegative, negMult, posMult, includeZero))
    //                 descriptions.push(desc);
    //         }
    //         );
    //     }
    //     if (statObject.enemyModifiers !== undefined) {
    //         statObject.enemyModifiers.forEach((modValue,id)=>{
    //             if (this.showDescription(!modValue.isNegative, negMult, posMult, includeZero))
    //                 descriptions.push(modValue.printEnemy(posMult, negMult, 2, id === 0));
    //         }
    //         );
    //     }
    //     return descriptions;
    // }
    // static showDescription(isNegative, negMult, posMult, includeZero) {
    //     return includeZero || !(isNegative ? negMult === 0 : posMult === 0);
    // }
    constructor(private readonly profile: Profile, private readonly game: Game) { }
    public getModifiers(single_species: Single_Species) {
        if (!single_species.id) {
            return [] as YouModifier[];
        }
        return single_species.modifiers(this.profile.settings.modifierType).map(modifier => {
            let description: {
                description: string;
                isNegative: boolean;
            }[] = [];
            const Part1:StatDescription[] = StatObject.getDescriptions(modifier)
            for (let index = 0; index < Part1.length; index++) {
                const Part2: {
                    description: string;
                    isNegative: boolean;
                } = {
                    description: Part1[index].text,
                    isNegative: Part1[index].isNegative,
                }
                description.push(Part2)
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
