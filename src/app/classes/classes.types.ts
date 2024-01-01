import { ModifierType } from './settings';

export interface ShoutModifier {
    description: string;
    isActive: boolean;
    level: number;
}

export type TeacherModifier = TeacherSkillModifier | TeacherStandardModifier;

export interface TeacherSkillModifier {
    level: number;
    key: SkillModifierKeys;
    value: number;
    skill: string | AnySkill;
}

export interface TeacherStandardModifier {
    level: number;
    key: StandardModifierKeys;
    value: number;
}

export interface ClassesSkillData extends MasterySkillData {
    teachers: TeacherData[];
}

export interface TeacherData extends BasicSkillRecipeData {
    name: string;
    media: string;
    maxGP: number;
    standardModifiers: TeacherModifier[];
    hardcoreModifiers: TeacherModifier[];
    skills: string[];
}

export interface MasteredShout {
    teacher: Teacher;
    slot: number;
    socket: Item;
    utility: Item;
}

export class Teacher extends BasicSkillRecipe {
    maxGP: number;
    skills: string[];

    private standardModifiers: TeacherModifier[];
    private hardcoreModifiers: TeacherModifier[];

    public get name() {
        return getLangString(`Classes_Classes_Teacher_${this.localID}`);
    }

    public get media() {
        return this.getMediaURL(this.data.media);
    }

    public modifiers(type: ModifierType) {
        switch (type) {
            case ModifierType.Standard:
                return this.standardModifiers;
            case ModifierType.Hardcore:
                return this.hardcoreModifiers;
        }
    }

    constructor(namespace: DataNamespace, private readonly data: TeacherData) {
        super(namespace, data);

        this.maxGP = data.maxGP;
        this.standardModifiers = data.standardModifiers;
        this.hardcoreModifiers = data.hardcoreModifiers;
        this.skills = data.skills;
    }
}
