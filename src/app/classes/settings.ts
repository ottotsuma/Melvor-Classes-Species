export enum ChangeType {
    ShoutEquipCost,
    Modifiers
}

export enum ModifierType {
    Standard = 'standard',
    Hardcore = 'hardcore'
}

export type ShoutEquipCostCallback = (value: number, previousValue: number) => void;
export type ModifierCallback = (value: ModifierType, previousValue: ModifierType) => void;

export class ClassesSettings {
    private shoutEquipCostCallbacks: ShoutEquipCostCallback[] = [];
    private modifierCallbacks: ModifierCallback[] = [];

    constructor(private readonly context: Modding.ModContext) {}

    public init() {
        const that = this;

        this.context.settings.section(getLangString('Classes_Classes_Settings_Shout_Equip_Cost')).add([
            {
                type: 'number',
                name: 'one-mastery',
                label: getLangString('Classes_Classes_Settings_Base_Shout_Equip_Cost_1'),
                hint: '',
                default: 0,
                min: 100,
                max: 999999999999,
                onChange(value: number, previousValue: number) {
                    if (value < 100) {
                        return getLangString('Classes_Classes_Settings_Must_Be_Larger_Then');
                    }

                    if (value > 999999999999) {
                        return getLangString('Classes_Classes_Settings_Must_Be_Smaller_Then');
                    }

                    that.emitChange(ChangeType.ShoutEquipCost, value, previousValue);
                }
            } as Modding.Settings.NumberConfig,
            {
                type: 'number',
                name: 'two-mastery',
                label: getLangString('Classes_Classes_Settings_Base_Shout_Equip_Cost_2'),
                hint: '',
                default: 100000,
                min: 100,
                max: 999999999999,
                onChange(value: number, previousValue: number) {
                    if (value < 100) {
                        return getLangString('Classes_Classes_Settings_Must_Be_Larger_Then');
                    }

                    if (value > 999999999999) {
                        return getLangString('Classes_Classes_Settings_Must_Be_Smaller_Then');
                    }

                    that.emitChange(ChangeType.ShoutEquipCost, value, previousValue);
                }
            } as Modding.Settings.NumberConfig,
            {
                type: 'number',
                name: 'three-mastery',
                label: getLangString('Classes_Classes_Settings_Base_Shout_Equip_Cost_3'),
                hint: '',
                default: 1000000,
                min: 100,
                max: 999999999999,
                onChange(value: number, previousValue: number) {
                    if (value < 100) {
                        return getLangString('Classes_Classes_Settings_Must_Be_Larger_Then');
                    }

                    if (value > 999999999999) {
                        return getLangString('Classes_Classes_Settings_Must_Be_Smaller_Then');
                    }

                    that.emitChange(ChangeType.ShoutEquipCost, value, previousValue);
                }
            } as Modding.Settings.NumberConfig,
            {
                type: 'number',
                name: 'four-mastery',
                label: getLangString('Classes_Classes_Settings_Base_Shout_Equip_Cost_4'),
                hint: '',
                default: 10000000,
                min: 100,
                max: 999999999999,
                onChange(value: number, previousValue: number) {
                    if (value < 100) {
                        return getLangString('Classes_Classes_Settings_Must_Be_Larger_Then');
                    }

                    if (value > 999999999999) {
                        return getLangString('Classes_Classes_Settings_Must_Be_Smaller_Then');
                    }

                    that.emitChange(ChangeType.ShoutEquipCost, value, previousValue);
                }
            } as Modding.Settings.NumberConfig,
            {
                type: 'number',
                name: 'five-mastery',
                label: getLangString('Classes_Classes_Settings_Base_Shout_Equip_Cost_5'),
                hint: '',
                default: 10000000,
                min: 100,
                max: 999999999999,
                onChange(value: number, previousValue: number) {
                    if (value < 100) {
                        return getLangString('Classes_Classes_Settings_Must_Be_Larger_Then');
                    }

                    if (value > 999999999999) {
                        return getLangString('Classes_Classes_Settings_Must_Be_Smaller_Then');
                    }

                    that.emitChange(ChangeType.ShoutEquipCost, value, previousValue);
                }
            } as Modding.Settings.NumberConfig
        ]);

        this.context.settings.section(getLangString('Classes_Classes_Settings_Modifiers')).add({
            type: 'dropdown',
            name: 'modifiers',
            label: getLangString('Classes_Classes_Settings_Modifier_Scale'),
            hint: '',
            default: ModifierType.Standard,
            options: [
                {
                    value: ModifierType.Standard,
                    display: getLangString('Classes_Classes_Settings_Modifier_Standard')
                },
                {
                    value: ModifierType.Hardcore,
                    display: getLangString('Classes_Classes_Settings_Modifier_Hardcore')
                }
            ],
            onChange(value, previousValue) {
                that.emitChange(ChangeType.Modifiers, value, previousValue);
            }
        } as Modding.Settings.DropdownConfig);
    }

    public get shoutEquipCostOne() {
        return this.context.settings
            .section(getLangString('Classes_Classes_Settings_Shout_Equip_Cost'))
            .get('one-mastery') as number;
    }

    public get shoutEquipCostTwo() {
        return this.context.settings
            .section(getLangString('Classes_Classes_Settings_Shout_Equip_Cost'))
            .get('two-mastery') as number;
    }

    public get shoutEquipCostThree() {
        return this.context.settings
            .section(getLangString('Classes_Classes_Settings_Shout_Equip_Cost'))
            .get('three-mastery') as number;
    }

    public get shoutEquipCostFour() {
        return this.context.settings
            .section(getLangString('Classes_Classes_Settings_Shout_Equip_Cost'))
            .get('four-mastery') as number;
    }

    public get shoutEquipCostFive() {
        return this.context.settings
            .section(getLangString('Classes_Classes_Settings_Shout_Equip_Cost'))
            .get('five-mastery') as number;
    }

    public get modifierType() {
        return this.context.settings
            .section(getLangString('Classes_Classes_Settings_Modifiers'))
            .get('modifiers') as ModifierType;
    }

    public onChange(type: ChangeType.ShoutEquipCost, callback: ShoutEquipCostCallback): void;
    public onChange(type: ChangeType.Modifiers, callback: ModifierCallback): void;
    public onChange(type: ChangeType, callback: ShoutEquipCostCallback | ModifierCallback) {
        switch (type) {
            case ChangeType.ShoutEquipCost:
                this.shoutEquipCostCallbacks.push(callback as ShoutEquipCostCallback);
                break;
            case ChangeType.Modifiers:
                this.modifierCallbacks.push(callback as ModifierCallback);
                break;
        }
    }

    private emitChange(type: ChangeType, value: unknown, previousValue: unknown) {
        switch (type) {
            case ChangeType.ShoutEquipCost:
                for (const callback of this.shoutEquipCostCallbacks) {
                    try {
                        callback(value as number, previousValue as number);
                    } catch {}
                }
                break;
            case ChangeType.Modifiers:
                for (const callback of this.modifierCallbacks) {
                    try {
                        callback(value as ModifierType, previousValue as ModifierType);
                    } catch {}
                }
                break;
        }
    }
}
