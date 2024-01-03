declare global {
    interface StandardModifierObject<Standard> extends CombatModifierObject<Standard> {
        increasedProfileEquipCost: Standard;
        decreasedProfileEquipCost: Standard;
        increasedProfileGP: Standard;
        decreasedProfileGP: Standard;
        increasedProfileAdditionalRewardRoll: Standard;
        decreasedProfileAdditionalRewardRoll: Standard;
    }

    interface SkillModifierObject<Skill> {
        increasedSkillMasteryXPPerVariel: Skill;
    }

    interface PlayerModifiers {
        increasedProfileEquipCost: number;
        decreasedProfileEquipCost: number;
        increasedProfileGP: number;
        decreasedProfileGP: number;
        increasedProfileAdditionalRewardRoll: number;
        decreasedProfileAdditionalRewardRoll: number;
        increasedSkillMasteryXPPerVariel: number;
    }
}

export class ProfileModifiers {
    public registerModifiers() {
        modifierData.increasedProfileEquipCost = {
            get langDescription() {
                return getLangString('Profile_Profile_You_Equip_Cost_Positive');
            },
            description: '+${value}% You Equip Cost',
            isSkill: false,
            isNegative: true,
            tags: []
        };

        modifierData.decreasedProfileEquipCost = {
            get langDescription() {
                return getLangString('Profile_Profile_You_Equip_Cost_Negative');
            },
            description: '-${value}% You Equip Cost',
            isSkill: false,
            isNegative: false,
            tags: []
        };

        modifierData.increasedProfileGP = {
            get langDescription() {
                return getLangString('Profile_Profile_Profile_GP_Positive');
            },
            description: '+${value}% Profile GP',
            isSkill: false,
            isNegative: true,
            tags: []
        };

        modifierData.decreasedProfileGP = {
            get langDescription() {
                return getLangString('Profile_Profile_Profile_GP_Negative');
            },
            description: '-${value}% Profile GP',
            isSkill: false,
            isNegative: false,
            tags: []
        };

        modifierData.increasedProfileAdditionalRewardRoll = {
            get langDescription() {
                return getLangString('Profile_Profile_Additional_Reward_Roll_Positive');
            },
            description: '+${value} additional reward roll while training Profile',
            isSkill: false,
            isNegative: false,
            tags: []
        };

        modifierData.decreasedProfileAdditionalRewardRoll = {
            get langDescription() {
                return getLangString('Profile_Profile_Additional_Reward_Roll_Negative');
            },
            description: '-${value} additional reward roll while training Profile',
            isSkill: false,
            isNegative: true,
            tags: []
        };

        modifierData.increasedSkillMasteryXPPerVariel = {
            get langDescription() {
                return getLangString('Profile_Profile_Increased_Mastery_XP_Per_Variel');
            },
            description: '+${value}% ${skillName} Mastery XP per maxed Star in Variel constellation in Astrology',
            isSkill: true,
            isNegative: false,
            tags: []
        };
    }
}
