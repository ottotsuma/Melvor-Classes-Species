declare global {
    interface StandardModifierObject<Standard> extends CombatModifierObject<Standard> {
        increasedThuumEquipCost: Standard;
        decreasedThuumEquipCost: Standard;
        increasedThuumGP: Standard;
        decreasedThuumGP: Standard;
        increasedThuumAdditionalRewardRoll: Standard;
        decreasedThuumAdditionalRewardRoll: Standard;
    }

    interface SkillModifierObject<Skill> {
        increasedSkillMasteryXPPerVariel: Skill;
    }

    interface PlayerModifiers {
        increasedThuumEquipCost: number;
        decreasedThuumEquipCost: number;
        increasedThuumGP: number;
        decreasedThuumGP: number;
        increasedThuumAdditionalRewardRoll: number;
        decreasedThuumAdditionalRewardRoll: number;
        increasedSkillMasteryXPPerVariel: number;
    }
}

export class ThuumModifiers {
    public registerModifiers() {
        modifierData.increasedThuumEquipCost = {
            get langDescription() {
                return getLangString('Thuum_Thuum_Shout_Equip_Cost_Positive');
            },
            description: '+${value}% Shout Equip Cost',
            isSkill: false,
            isNegative: true,
            tags: []
        };

        modifierData.decreasedThuumEquipCost = {
            get langDescription() {
                return getLangString('Thuum_Thuum_Shout_Equip_Cost_Negative');
            },
            description: '-${value}% Shout Equip Cost',
            isSkill: false,
            isNegative: false,
            tags: []
        };

        modifierData.increasedThuumGP = {
            get langDescription() {
                return getLangString('Thuum_Thuum_Thuum_GP_Positive');
            },
            description: '+${value}% Thuum GP',
            isSkill: false,
            isNegative: true,
            tags: []
        };

        modifierData.decreasedThuumGP = {
            get langDescription() {
                return getLangString('Thuum_Thuum_Thuum_GP_Negative');
            },
            description: '-${value}% Thuum GP',
            isSkill: false,
            isNegative: false,
            tags: []
        };

        modifierData.increasedThuumAdditionalRewardRoll = {
            get langDescription() {
                return getLangString('Thuum_Thuum_Additional_Reward_Roll_Positive');
            },
            description: '+${value} additional reward roll while training Thuum',
            isSkill: false,
            isNegative: false,
            tags: []
        };

        modifierData.decreasedThuumAdditionalRewardRoll = {
            get langDescription() {
                return getLangString('Thuum_Thuum_Additional_Reward_Roll_Negative');
            },
            description: '-${value} additional reward roll while training Thuum',
            isSkill: false,
            isNegative: true,
            tags: []
        };

        modifierData.increasedSkillMasteryXPPerVariel = {
            get langDescription() {
                return getLangString('Thuum_Thuum_Increased_Mastery_XP_Per_Variel');
            },
            description: '+${value}% ${skillName} Mastery XP per maxed Star in Variel constellation in Astrology',
            isSkill: true,
            isNegative: false,
            tags: []
        };
    }
}
