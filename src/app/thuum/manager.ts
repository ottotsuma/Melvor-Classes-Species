import { Thuum } from './thuum';
import { ShoutModifier, Teacher, TeacherModifier, TeacherSkillModifier } from './thuum.types';

export class ThuumManager {
    public get elements() {
        const fragment = new DocumentFragment();

        fragment.append(getTemplateNode('thuum'));

        return [...fragment.children];
    }

    public get essenceOfThuumIcon() {
        return this.game.items.getObjectByID('namespace_thuum:Dragon_Soul')?.media;
    }

    constructor(private readonly thuum: Thuum, private readonly game: Game) {}

    /** Gets modifier metadata. */
    public getModifiers(teacher: Teacher) {
        if (!teacher.id) {
            return [] as ShoutModifier[];
        }

        return teacher.modifiers(this.thuum.settings.modifierType).map(modifier => {
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
                isActive: this.isModifierActive(teacher, modifier),
                level: modifier.level
            } as ShoutModifier;
        });
    }

    /** Gets modifiers and constructs object needed to apply the modifier to the player. */
    public getModifiersForApplication(teacher: Teacher) {
        if (this.thuum.level < teacher.level) {
            return [];
        }

        return teacher
            .modifiers(this.thuum.settings.modifierType)
            .filter(modifier => this.isModifierActive(teacher, modifier))
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

    public getGoldToTake(teacher: Teacher) {
        const component = this.thuum.userInterface.teachers.get(teacher);
        const minRoll = component.getMinGPRoll();
        const maxRoll = component.getMaxGPRoll();

        let gpToTake = rollInteger(minRoll, maxRoll);
        let gpMultiplier = 1;

        const increasedGPModifier = component.getGPModifier();

        gpMultiplier *= 1 + increasedGPModifier / 100;
        gpToTake = Math.floor((gpToTake/gpMultiplier)  - this.game.modifiers.increasedGPFlat);

        return gpToTake;
    }

    public getGoldToAward(teacher: Teacher) {
        const component = this.thuum.userInterface.teachers.get(teacher);
        const minRoll = component.getMinGPRoll();
        const maxRoll = component.getMaxGPRoll();

        let gpToAdd = rollInteger(minRoll, maxRoll);
        let gpMultiplier = 1;

        const increasedGPModifier = component.getGPModifier();

        gpMultiplier *= 1 + increasedGPModifier / 100;
        gpToAdd = Math.floor(gpMultiplier * gpToAdd + this.game.modifiers.increasedGPFlat);

        return gpToAdd;
    }

    public calculateEquipCost(teacher: Teacher) {
        const MasterCostMap = [
            this.thuum.settings.shoutEquipCostOne || 1000,
            this.thuum.settings.shoutEquipCostTwo || 10000,
            this.thuum.settings.shoutEquipCostThree || 100000,
            this.thuum.settings.shoutEquipCostFour || 10000000,
            this.thuum.settings.shoutEquipCostFive || 10000000
        ];
        const teacherRef = this.thuum.actions.find(action => action.id === teacher.id);
        const unlocked = this.thuum.masteriesUnlocked.get(teacherRef).filter(isUnlocked => isUnlocked).length;

        return { costs: MasterCostMap, unlocked };
    }

    public getEquipCostModifier(teacher: Teacher) {
        let modifier = this.game.modifiers.increasedThuumEquipCost - this.game.modifiers.decreasedThuumEquipCost;

        if (this.thuum.isPoolTierActive(3)) {
            modifier -= 5;
        }

        const masteryLevel = this.thuum.getMasteryLevel(teacher);

        if (masteryLevel >= 90) {
            modifier -= 5;
        }

        return Math.max(modifier, -95);
    }

    private isModifierActive(teacher: Teacher, modifier: TeacherModifier) {
        teacher = this.thuum.actions.find(action => action.id === teacher.id);

        let unlockedMasteries = this.thuum.masteriesUnlocked.get(teacher);

        const shout = this.thuum.shouts.get(teacher);

        const validModifierLevels = teacher
            .modifiers(this.thuum.settings.modifierType)
            .filter((modifier, index) => unlockedMasteries[index])
            .map(teacher => teacher.level);

        return validModifierLevels.includes(modifier.level);
    }

    private isSkillModifier(modifier: TeacherModifier): modifier is TeacherSkillModifier {
        return 'skill' in modifier;
    }
}
