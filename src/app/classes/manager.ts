import { Classes } from './classes';
import { ShoutModifier, Teacher, TeacherModifier, TeacherSkillModifier } from './classes.types';

export class ClassesManager {
    public get elements() {
        const fragment = new DocumentFragment();

        fragment.append(getTemplateNode('classes'));

        return [...fragment.children];
    }

    public get essenceOfClassesIcon() {
        return this.game.items.getObjectByID('namespace_classes:Dragon_Soul')?.media;
    }

    constructor(private readonly classes: Classes, private readonly game: Game) {}

    /** Gets modifier metadata. */
    public getModifiers(teacher: Teacher) {
        if (!teacher.id) {
            return [] as ShoutModifier[];
        }

        return teacher.modifiers(this.classes.settings.modifierType).map(modifier => {
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
        if (this.classes.level < teacher.level) {
            return [];
        }

        return teacher
            .modifiers(this.classes.settings.modifierType)
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
        const component = this.classes.userInterface.teachers.get(teacher);
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
        const component = this.classes.userInterface.teachers.get(teacher);
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
            this.classes.settings.shoutEquipCostOne || 1000,
            this.classes.settings.shoutEquipCostTwo || 10000,
            this.classes.settings.shoutEquipCostThree || 100000,
            this.classes.settings.shoutEquipCostFour || 10000000,
            this.classes.settings.shoutEquipCostFive || 10000000
        ];
        const teacherRef = this.classes.actions.find(action => action.id === teacher.id);
        const unlocked = this.classes.masteriesUnlocked.get(teacherRef).filter(isUnlocked => isUnlocked).length;

        return { costs: MasterCostMap, unlocked };
    }

    public getEquipCostModifier(teacher: Teacher) {
        let modifier = this.game.modifiers.increasedClassesEquipCost - this.game.modifiers.decreasedClassesEquipCost;

        if (this.classes.isPoolTierActive(3)) {
            modifier -= 5;
        }

        const masteryLevel = this.classes.getMasteryLevel(teacher);

        if (masteryLevel >= 90) {
            modifier -= 5;
        }

        return Math.max(modifier, -95);
    }

    private isModifierActive(teacher: Teacher, modifier: TeacherModifier) {
        teacher = this.classes.actions.find(action => action.id === teacher.id);

        let unlockedMasteries = this.classes.masteriesUnlocked.get(teacher);

        const shout = this.classes.shouts.get(teacher);

        const validModifierLevels = teacher
            .modifiers(this.classes.settings.modifierType)
            .filter((modifier, index) => unlockedMasteries[index])
            .map(teacher => teacher.level);

        return validModifierLevels.includes(modifier.level);
    }

    private isSkillModifier(modifier: TeacherModifier): modifier is TeacherSkillModifier {
        return 'skill' in modifier;
    }
}
