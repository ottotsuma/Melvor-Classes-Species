import { ModifierType } from './settings';

export interface YouModifier {
    description: any[];
    isActive: boolean;
    level: number;
}

export interface ProfileSkillData extends MasterySkillData {
    species: Single_SpeciesData[];
    classes: Single_SpeciesData[];
}

export interface Single_SpeciesData extends BasicSkillRecipeData {
    name: string;
    media: string;
    standardModifiers: StatObject[];
    skills: string[];
}

export interface MasteredYou {
    single_species: Single_Species;
    slot: number;
}

export class Single_Species extends BasicSkillRecipe {
    skills: string[];

    private standardModifiers: StatObject[];

    public get name() {
        return getLangString(`Profile_Single_Species_${this.localID}`);
    }

    public get media() {
        return this.getMediaURL(this.data.media);
    }

    public modifiers(type: ModifierType) {
        switch (type) {
            case ModifierType.Standard:
                return this.standardModifiers;
        }
    }

    constructor(namespace: DataNamespace, private readonly data: Single_SpeciesData, game: Game) {
        // @ts-ignore
        super(namespace, data, game);

        // this.standardModifiers = data.standardModifiers;
        this.standardModifiers = data.standardModifiers.map(modifier => {
            // @ts-ignore 
            if (modifier.value) {
                const newModifier = {
                    level: modifier.level,
                    // @ts-ignore 
                    modifiers: {
                        "increasedMasteryXP": [
                            {
                                "value": -5,
                                "skillID": "melvorD:Firemaking"
                            }
                        ]
                    }
                }
                // @ts-ignore 
                const stats = new StatObject(newModifier, game, `${Single_Species.name}`);
                stats.level = modifier.level;
                return stats;
            } else {
                // @ts-ignore 
                const stats = new StatObject(modifier, game, `${Single_Species.name}`);
                stats.level = modifier.level;
                return stats;
            }
        });
        this.skills = data.skills;
    }
}


export interface UpgradeData {
    itemId: string;
    modifiers: StatObject[];
}

export class UpgradeModifier {
    itemId: string;
    // @ts-ignore 
    modifiers: StatObject[];

    constructor(private readonly data: UpgradeData, private readonly game: Game) {
        this.itemId = this.data.itemId;
        // @ts-ignore 
        this.modifiers = new StatObject(this.data, this.game, `${UpgradeModifier.name} with id ${this.itemId}`);

        // @ts-ignore 
        this.modifiers.registerSoftDependencies(this.data, this.game);
    }
}