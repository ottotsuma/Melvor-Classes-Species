import { ModifierType } from './settings';

export interface ShoutModifier {
    description: string;
    isActive: boolean;
    level: number;
}

export type Single_SpeciesModifier = SpecieskillModifier | SpeciestandardModifier;

export interface SpecieskillModifier {
    level: number;
    key: SkillModifierKeys;
    value: number;
    skill: string | AnySkill;
}

export interface SpeciestandardModifier {
    level: number;
    key: StandardModifierKeys;
    value: number;
}

export interface ProfileSkillData extends MasterySkillData {
    species: Single_SpeciesData[];
    classes: Single_SpeciesData[];
}

export interface Single_SpeciesData extends BasicSkillRecipeData {
    name: string;
    media: string;
    maxGP: number;
    standardModifiers: Single_SpeciesModifier[];
    hardcoreModifiers: Single_SpeciesModifier[];
    skills: string[];
}

export interface MasteredShout {
    single_species: Single_Species;
    slot: number;
    socket: Item;
    utility: Item;
}

export class Single_Species extends BasicSkillRecipe {
    maxGP: number;
    skills: string[];

    private standardModifiers: Single_SpeciesModifier[];
    private hardcoreModifiers: Single_SpeciesModifier[];

    public get name() {
        return getLangString(`Profile_Profile_Single_Species_${this.localID}`);
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

    constructor(namespace: DataNamespace, private readonly data: Single_SpeciesData) {
        super(namespace, data);

        this.maxGP = data.maxGP;
        this.standardModifiers = data.standardModifiers;
        this.hardcoreModifiers = data.hardcoreModifiers;
        this.skills = data.skills;
    }
}
