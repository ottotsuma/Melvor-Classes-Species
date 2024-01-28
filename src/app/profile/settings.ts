export enum ChangeType {
    YouEquipCost,
    Modifiers
}

export enum ModifierType {
    Standard = 'standard',
    // Hardcore = 'hardcore'
}

export type YouEquipCostCallback = (value: number, previousValue: number) => void;
export type ModifierCallback = (value: ModifierType, previousValue: ModifierType) => void;

export class ProfileSettings {
    private youEquipCostCallbacks: YouEquipCostCallback[] = [];
    private modifierCallbacks: ModifierCallback[] = [];

    constructor(private readonly context: Modding.ModContext) {}

    public init() {
        const that = this;

        this.context.settings.section(getLangString('Profile_Settings_You_Equip_Cost')).add([
            {
                type: 'number',
                name: 'one-mastery',
                label: getLangString('Profile_Settings_Base_You_Equip_Cost_1'),
                hint: '',
                default: 0,
                min: 100,
                max: 999999999999,
                onChange(value: number, previousValue: number) {
                    if (value < 100) {
                        return getLangString('Profile_Settings_Must_Be_Larger_Then');
                    }

                    if (value > 999999999999) {
                        return getLangString('Profile_Settings_Must_Be_Smaller_Then');
                    }

                    that.emitChange(ChangeType.YouEquipCost, value, previousValue);
                }
            } as Modding.Settings.NumberConfig,
            {
                type: 'number',
                name: 'two-mastery',
                label: getLangString('Profile_Settings_Base_You_Equip_Cost_2'),
                hint: '',
                default: 0,
                min: 100,
                max: 999999999999,
                onChange(value: number, previousValue: number) {
                    if (value < 100) {
                        return getLangString('Profile_Settings_Must_Be_Larger_Then');
                    }

                    if (value > 999999999999) {
                        return getLangString('Profile_Settings_Must_Be_Smaller_Then');
                    }

                    that.emitChange(ChangeType.YouEquipCost, value, previousValue);
                }
            } as Modding.Settings.NumberConfig,
            {
                type: 'number',
                name: 'three-mastery',
                label: getLangString('Profile_Settings_Base_You_Equip_Cost_3'),
                hint: '',
                default: 10000,
                min: 100,
                max: 999999999999,
                onChange(value: number, previousValue: number) {
                    if (value < 100) {
                        return getLangString('Profile_Settings_Must_Be_Larger_Then');
                    }

                    if (value > 999999999999) {
                        return getLangString('Profile_Settings_Must_Be_Smaller_Then');
                    }

                    that.emitChange(ChangeType.YouEquipCost, value, previousValue);
                }
            } as Modding.Settings.NumberConfig,
            {
                type: 'number',
                name: 'four-mastery',
                label: getLangString('Profile_Settings_Base_You_Equip_Cost_4'),
                hint: '',
                default: 100000,
                min: 100,
                max: 999999999999,
                onChange(value: number, previousValue: number) {
                    if (value < 100) {
                        return getLangString('Profile_Settings_Must_Be_Larger_Then');
                    }

                    if (value > 999999999999) {
                        return getLangString('Profile_Settings_Must_Be_Smaller_Then');
                    }

                    that.emitChange(ChangeType.YouEquipCost, value, previousValue);
                }
            } as Modding.Settings.NumberConfig,
            {
                type: 'number',
                name: 'five-mastery',
                label: getLangString('Profile_Settings_Base_You_Equip_Cost_5'),
                hint: '',
                default: 1000000,
                min: 100,
                max: 999999999999,
                onChange(value: number, previousValue: number) {
                    if (value < 100) {
                        return getLangString('Profile_Settings_Must_Be_Larger_Then');
                    }

                    if (value > 999999999999) {
                        return getLangString('Profile_Settings_Must_Be_Smaller_Then');
                    }

                    that.emitChange(ChangeType.YouEquipCost, value, previousValue);
                }
            } as Modding.Settings.NumberConfig,
            {
                type: 'number',
                name: 'six-mastery',
                label: getLangString('Profile_Settings_Base_You_Equip_Cost_6'),
                hint: '',
                default: 10000000,
                min: 100,
                max: 999999999999,
                onChange(value: number, previousValue: number) {
                    if (value < 100) {
                        return getLangString('Profile_Settings_Must_Be_Larger_Then');
                    }

                    if (value > 999999999999) {
                        return getLangString('Profile_Settings_Must_Be_Smaller_Then');
                    }

                    that.emitChange(ChangeType.YouEquipCost, value, previousValue);
                }
            } as Modding.Settings.NumberConfig,
            {
                type: 'number',
                name: 'seven-mastery',
                label: getLangString('Profile_Settings_Base_You_Equip_Cost_7'),
                hint: '',
                default: 100000000,
                min: 100,
                max: 999999999999,
                onChange(value: number, previousValue: number) {
                    if (value < 100) {
                        return getLangString('Profile_Settings_Must_Be_Larger_Then');
                    }

                    if (value > 999999999999) {
                        return getLangString('Profile_Settings_Must_Be_Smaller_Then');
                    }

                    that.emitChange(ChangeType.YouEquipCost, value, previousValue);
                }
            } as Modding.Settings.NumberConfig
        ]);

        this.context.settings.section(getLangString('Profile_Settings_Modifiers')).add({
            type: 'dropdown',
            name: 'modifiers',
            label: getLangString('Profile_Settings_Modifier_Scale'),
            hint: '',
            default: ModifierType.Standard,
            options: [
                {
                    value: ModifierType.Standard,
                    display: getLangString('Profile_Settings_Modifier_Standard')
                }
            ],
            onChange(value, previousValue) {
                that.emitChange(ChangeType.Modifiers, value, previousValue);
            }
        } as Modding.Settings.DropdownConfig);
    }

    public get youEquipCostOne() {
        return this.context.settings
            .section(getLangString('Profile_Settings_You_Equip_Cost'))
            .get('one-mastery') as number;
    }

    public get youEquipCostTwo() {
        return this.context.settings
            .section(getLangString('Profile_Settings_You_Equip_Cost'))
            .get('two-mastery') as number;
    }

    public get youEquipCostThree() {
        return this.context.settings
            .section(getLangString('Profile_Settings_You_Equip_Cost'))
            .get('three-mastery') as number;
    }

    public get youEquipCostFour() {
        return this.context.settings
            .section(getLangString('Profile_Settings_You_Equip_Cost'))
            .get('four-mastery') as number;
    }

    public get youEquipCostFive() {
        return this.context.settings
            .section(getLangString('Profile_Settings_You_Equip_Cost'))
            .get('five-mastery') as number;
    }

    public get youEquipCostSix() {
        return this.context.settings
            .section(getLangString('Profile_Settings_You_Equip_Cost'))
            .get('six-mastery') as number;
    }

    public get youEquipCostSeven() {
        return this.context.settings
            .section(getLangString('Profile_Settings_You_Equip_Cost'))
            .get('seven-mastery') as number;
    }

    public get modifierType() {
        return this.context.settings
            .section(getLangString('Profile_Settings_Modifiers'))
            .get('modifiers') as ModifierType;
    }

    public onChange(type: ChangeType.YouEquipCost, callback: YouEquipCostCallback): void;
    public onChange(type: ChangeType.Modifiers, callback: ModifierCallback): void;
    public onChange(type: ChangeType, callback: YouEquipCostCallback | ModifierCallback) {
        switch (type) {
            case ChangeType.YouEquipCost:
                this.youEquipCostCallbacks.push(callback as YouEquipCostCallback);
                break;
            case ChangeType.Modifiers:
                this.modifierCallbacks.push(callback as ModifierCallback);
                break;
        }
    }

    private emitChange(type: ChangeType, value: unknown, previousValue: unknown) {
        switch (type) {
            case ChangeType.YouEquipCost:
                for (const callback of this.youEquipCostCallbacks) {
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
