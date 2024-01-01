declare global {
    interface StandardModifierObject<Standard> extends CombatModifierObject<Standard> {
        increasedClassesEquipCost: Standard;
        decreasedClassesEquipCost: Standard;
        increasedClassesGP: Standard;
        decreasedClassesGP: Standard;
        increasedClassesAdditionalRewardRoll: Standard;
        decreasedClassesAdditionalRewardRoll: Standard;
    }

    interface SkillModifierObject<Skill> {
        increasedSkillMasteryXPPerVariel: Skill;
    }

    interface PlayerModifiers {
        increasedClassesEquipCost: number;
        decreasedClassesEquipCost: number;
        increasedClassesGP: number;
        decreasedClassesGP: number;
        increasedClassesAdditionalRewardRoll: number;
        decreasedClassesAdditionalRewardRoll: number;
        increasedSkillMasteryXPPerVariel: number;
    }
}

export class ClassesModifiers {
    public registerModifiers() {
        modifierData.increasedClassesEquipCost = {
            get langDescription() {
                return getLangString('Classes_Classes_Shout_Equip_Cost_Positive');
            },
            description: '+${value}% Shout Equip Cost',
            isSkill: false,
            isNegative: true,
            tags: []
        };

        modifierData.decreasedClassesEquipCost = {
            get langDescription() {
                return getLangString('Classes_Classes_Shout_Equip_Cost_Negative');
            },
            description: '-${value}% Shout Equip Cost',
            isSkill: false,
            isNegative: false,
            tags: []
        };

        modifierData.increasedClassesGP = {
            get langDescription() {
                return getLangString('Classes_Classes_Classes_GP_Positive');
            },
            description: '+${value}% Classes GP',
            isSkill: false,
            isNegative: true,
            tags: []
        };

        modifierData.decreasedClassesGP = {
            get langDescription() {
                return getLangString('Classes_Classes_Classes_GP_Negative');
            },
            description: '-${value}% Classes GP',
            isSkill: false,
            isNegative: false,
            tags: []
        };

        modifierData.increasedClassesAdditionalRewardRoll = {
            get langDescription() {
                return getLangString('Classes_Classes_Additional_Reward_Roll_Positive');
            },
            description: '+${value} additional reward roll while training Classes',
            isSkill: false,
            isNegative: false,
            tags: []
        };

        modifierData.decreasedClassesAdditionalRewardRoll = {
            get langDescription() {
                return getLangString('Classes_Classes_Additional_Reward_Roll_Negative');
            },
            description: '-${value} additional reward roll while training Classes',
            isSkill: false,
            isNegative: true,
            tags: []
        };

        modifierData.increasedSkillMasteryXPPerVariel = {
            get langDescription() {
                return getLangString('Classes_Classes_Increased_Mastery_XP_Per_Variel');
            },
            description: '+${value}% ${skillName} Mastery XP per maxed Star in Variel constellation in Astrology',
            isSkill: true,
            isNegative: false,
            tags: []
        };
    }
}
