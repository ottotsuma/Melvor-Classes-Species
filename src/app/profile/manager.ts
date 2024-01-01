import { Profile } from './profile';
import { ShoutModifier, Single_Species, Single_SpeciesModifier, SpecieskillModifier } from './profile.types';

export class ProfileManager {
    public get elements() {
        const fragment = new DocumentFragment();

        fragment.append(getTemplateNode('profile'));

        return [...fragment.children];
    }

    public get essenceOfProfileIcon() {
        return this.game.items.getObjectByID('namespace_profile:Dragon_Soul')?.media;
    }

    constructor(private readonly profile: Profile, private readonly game: Game) {}

    /** Gets modifier metadata. */
    public getModifiers(single_species: Single_Species) {
        if (!single_species.id) {
            return [] as ShoutModifier[];
        }

        return single_species.modifiers(this.profile.settings.modifierType).map(modifier => {
            let description = '';

            if (this.isSkillModifier(modifier)) {
                [description] = printPlayerModifier(modifier.key, {
                    skill: this.game.skills.find(skill => skill.id === modifier.skill),
                    value: modifier.value
                });
            } else {
                [description] = printPlayerModifier(modifier.key, modifier.value);
            }

            return {
                description,
                isActive: this.isModifierActive(single_species, modifier),
                level: modifier.level
            } as ShoutModifier;
        });
    }

    /** Gets modifiers and constructs object needed to apply the modifier to the player. */
    public getModifiersForApplication(single_species: Single_Species) {
        if (this.profile.level < single_species.level) {
            return [];
        }

        return single_species
            .modifiers(this.profile.settings.modifierType)
            .filter(modifier => this.isModifierActive(single_species, modifier))
            .map(modifier => {
                if ('skill' in modifier) {
                    return {
                        key: modifier.key,
                        values: [
                            {
                                skill: this.game.skills.find(skill => skill.id === modifier.skill),
                                value: modifier.value
                            }
                        ]
                    } as SkillModifierArrayElement;
                } else {
                    return {
                        key: modifier.key,
                        value: modifier.value
                    } as StandardModifierArrayElement;
                }
            });
    }

    public getGoldToTake(single_species: Single_Species) {
        const component = this.profile.userInterface.species.get(single_species);
        const minRoll = component.getMinGPRoll();
        const maxRoll = component.getMaxGPRoll();

        let gpToTake = rollInteger(minRoll, maxRoll);
        let gpMultiplier = 1;

        const increasedGPModifier = component.getGPModifier();

        gpMultiplier *= 1 + increasedGPModifier / 100;
        gpToTake = Math.floor((gpToTake/gpMultiplier)  - this.game.modifiers.increasedGPFlat);

        return gpToTake;
    }

    public getGoldToAward(single_species: Single_Species) {
        const component = this.profile.userInterface.species.get(single_species);
        const minRoll = component.getMinGPRoll();
        const maxRoll = component.getMaxGPRoll();

        let gpToAdd = rollInteger(minRoll, maxRoll);
        let gpMultiplier = 1;

        const increasedGPModifier = component.getGPModifier();

        gpMultiplier *= 1 + increasedGPModifier / 100;
        gpToAdd = Math.floor(gpMultiplier * gpToAdd + this.game.modifiers.increasedGPFlat);

        return gpToAdd;
    }

    public calculateEquipCost(single_species: Single_Species) {
        const MasterCostMap = [
            this.profile.settings.shoutEquipCostOne || 0,
            this.profile.settings.shoutEquipCostTwo || 10000,
            this.profile.settings.shoutEquipCostThree || 100000,
            this.profile.settings.shoutEquipCostFour || 10000000,
            this.profile.settings.shoutEquipCostFive || 10000000
        ];
        const single_speciesRef = this.profile.actions.find(action => action.id === single_species.id);
        const unlocked = this.profile.masteriesUnlocked.get(single_speciesRef).filter(isUnlocked => isUnlocked).length;

        return { costs: MasterCostMap, unlocked };
    }

    public getEquipCostModifier(single_species: Single_Species) {
        let modifier = this.game.modifiers.increasedProfileEquipCost - this.game.modifiers.decreasedProfileEquipCost;

        if (this.profile.isPoolTierActive(3)) {
            modifier -= 5;
        }

        const masteryLevel = this.profile.getMasteryLevel(single_species);

        if (masteryLevel >= 90) {
            modifier -= 5;
        }

        return Math.max(modifier, -95);
    }

    private isModifierActive(single_species: Single_Species, modifier: Single_SpeciesModifier) {
        single_species = this.profile.actions.find(action => action.id === single_species.id);

        let unlockedMasteries = this.profile.masteriesUnlocked.get(single_species);

        const shout = this.profile.shouts.get(single_species);

        const validModifierLevels = single_species
            .modifiers(this.profile.settings.modifierType)
            .filter((modifier, index) => unlockedMasteries[index])
            .map(single_species => single_species.level);

        return validModifierLevels.includes(modifier.level);
    }

    private isSkillModifier(modifier: Single_SpeciesModifier): modifier is SpecieskillModifier {
        return 'skill' in modifier;
    }
}
