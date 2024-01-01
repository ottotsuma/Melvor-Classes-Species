import { ClassesActionEventMatcher, ClassesActionEventMatcherOptions } from './classes/event';
import { Classes } from './classes/classes';
import { UserInterface } from './classes/user-interface';
import { ClassesModifiers } from './classes/modifiers';
// import { ClassesTownship } from './classes/township/township';
// import { ClassesAgility } from './agility/agility';
// import { ClassesAstrology } from './astrology/astrology';
import { TinyPassiveIconsCompatibility } from './compatibility/tiny-passive-icons';
import { ClassesSkillData } from './classes/classes.types';
import { languages } from './language';
import { ClassesTranslation } from './classes/translation/translation';
import { ClassesSettings } from './classes/settings';

declare global {
    interface CloudManager {
        hasTotHEntitlement: boolean;
        hasAoDEntitlement: boolean;
    }

    const cloudManager: CloudManager;

    interface SkillIDDataMap {
        'namespace_classes:Classes': ClassesSkillData;
    }

    interface SkillValue {
        skill: AnySkill;
        value: number;
    }

    interface Game {
        classes: Classes;
    }

    interface Gamemode {
        /** The number of skill cap increase choices obtained per dungeon completion before Level 99 if allowDungeonLevelCapIncrease = true */
        skillCapIncreasesPre99: number;
        /** The number of skill cap increase choices obtained per dungeon completion after Level 99 if allowDungeonLevelCapIncrease = true */
        skillCapIncreasesPost99: number;
        /** Skills that auto level per dungeon completion before Level 99 if allowDungeonLevelCapIncrease = true */
        autoLevelSkillsPre99: SkillValue[];
        /** Skills that auto level per dungeon completion after Level 99 if allowDungeonLevelCapIncrease = true */
        autoLevelSkillsPost99: SkillValue[];
        /** Skills that are part of the cap increase pool before Level 99 obtained per dungeon completion if allowDungeonLevelCapIncrease = true */
        skillCapRollsPre99: SkillValue[];
        /** Skills that are part of the cap increase pool after Level 99 obtained per dungeon completion if allowDungeonLevelCapIncrease = true */
        skillCapRollsPost99: SkillValue[];
    }
}

export class App {
    constructor(private readonly context: Modding.ModContext, private readonly game: Game) { }

    public async init() {
        await this.context.loadTemplates('classes/classes.html');
        await this.context.loadTemplates('classes/teacher/teacher.html');
        await this.context.loadTemplates('classes/shout/shout.html');
        await this.context.loadTemplates('classes/mastery/mastery.html');
        await this.context.loadTemplates('classes/locked/locked.html');

        this.initLanguage();
        this.initTranslation();
        const settings = this.initSettings();
        this.patchEventManager();
        this.initModifiers();

        this.game.classes = this.game.registerSkill(this.game.registeredNamespaces.getNamespace('namespace_classes'), Classes);
        const kcm = mod.manager.getLoadedModList().includes('Custom Modifiers in Melvor')
        if(!kcm) {
            return;
        }
        await this.context.gameData.addPackage('data.json');
        await this.context.gameData.addPackage('data-cmim.json');
        const DragonList: any[] = [
            "melvorD:PratTheProtectorOfSecrets",
            "melvorD:GreenDragon",
            "melvorD:BlueDragon",
            "melvorD:RedDragon",
            "melvorD:BlackDragon",
            "melvorD:MalcsTheGuardianOfMelvor",
            "melvorF:ElderDragon",
            "melvorF:ChaoticGreaterDragon",
            "melvorF:HuntingGreaterDragon",
            "melvorF:WickedGreaterDragon",
            "melvorF:MalcsTheLeaderOfDragons",
            "melvorF:GreaterSkeletalDragon",
        ]

        if (cloudManager.hasTotHEntitlement) {
            // await this.context.gameData.addPackage('data-toth.json');

            DragonList.push(
                "melvorTotH:Kongamato", "melvorTotH:GretYun", "melvorTotH:RaZu",
            )

            // await this.context.gameData
            //     .buildPackage(builder => {
            //         builder.skillData.add({
            //             skillID: 'namespace_classes:Classes',
            //             data: {
            //                 minibar: {
            //                     defaultItems: ['namespace_classes:Superior_Classes_Skillcape'],
            //                     upgrades: [],
            //                     pets: []
            //                 },
            //                 teachers: []
            //             }
            //         });
            //     })
            //     .add();
        }

        if (cloudManager.hasAoDEntitlement) {
            await this.context.gameData.addPackage('data-aod.json');
        }
        const en_data = {
            MODIFIER_DATA_summoningSynergy_Devil_Eagle: "While Thieving - 50% chance for +10% base Skill XP, 40% chance for 2.5x GP, and 10% chance to gain no Items or GP",
            MONSTER_TYPE_SINGULAR_Elf: "Elf",
            MONSTER_TYPE_PLURAL_Elf: "Elves",
            tes_increasedDragonBreathDamage: "Increase damage taken from dragon breaths by +${value}",
            tes_wardsave: "+${value}% (MAX: 90%) to take 0 damage from a hit.",
            tes_increasedFlatDamageWhileTargetHasMaxHP: "Increase damage while target is fully healed by +${value}.",
            tes_increasedPercDamageWhileTargetHasMaxHP: "Increase damage while target is fully healed by +${value}%.",
            tes_decreaseFlatDamageWhileTargetHasMaxHP: "Decrease damage taken while you are fully healed by +${value}.",
            tes_bypassDamageReduction: "${value} damage, though damage reduction.",
            PASSIVES_NAME_EventPassive1: "Unusual Passive",
            PASSIVES_NAME_EventPassive2: "Unusual Passive",
            PASSIVES_NAME_EventPassive3: "Unusual Passive",
            PASSIVES_NAME_EventPassive4: "Unusual Passive",
            PASSIVES_NAME_EventPassive5: "Unusual Passive",
            PASSIVES_NAME_EventPassive6: "Unusual Passive",
            PASSIVES_NAME_EventPassive7: "Unusual Passive",
            PASSIVES_NAME_EventPassive8: "Unusual Passive",
            PASSIVES_NAME_EventPassive9: "Unusual Passive",
            PASSIVES_NAME_EventPassive10: "Unusual Passive",
            PASSIVES_NAME_EventPassive11: "Unusual Passive",
            PASSIVES_NAME_EventPassive12: "Unusual Passive",
            MODIFIER_DATA_increasedDamageAgainstElves: 'Damage to Elves'
          }
          for (const [key, value] of Object.entries(en_data)) {
            // @ts-ignore
            loadedLangJson[key] = value;
          }

        this.context.onCharacterLoaded(async () => {
                const cmim = mod.api.customModifiersInMelvor;
                cmim.addMonsters("Dragon", DragonList)
                cmim.registerOrUpdateType("Elf", "Elves", "https://cdn.melvor.net/core/v018/assets/media/pets/elf_rock.png", [], true);
                cmim.registerOrUpdateType("Goblin", "Goblins", "https://cdn.melvor.net/core/v018/assets/media/monsters/goblin.png", [], true);
                cmim.forceBaseModTypeActive("Dragon");
                cmim.forceBaseModTypeActive("Undead");
                cmim.forceBaseModTypeActive("Human");
                cmim.forceBaseModTypeActive("Animal");
                cmim.forceBaseModTypeActive("Demon");
                cmim.forceBaseModTypeActive("Elemental");
                cmim.forceBaseModTypeActive("MythicalCreature");
                cmim.forceBaseModTypeActive("SeaCreature");
        })

        this.patchGamemodes(this.game.classes);
        this.patchUnlock(this.game.classes);
        this.initCompatibility(this.game.classes);
        // this.initAgility(this.game.classes);
        // this.initAstrology(this.game.classes);
        // this.initTownship();

        this.game.classes.userInterface = this.initInterface(this.game.classes);
        this.game.classes.initSettings(settings);
    }

    private patchEventManager() {
        this.context.patch(GameEventSystem, 'constructMatcher').after((_patch, data) => {
            if (this.isClassesEvent(data)) {
                return new ClassesActionEventMatcher(data, this.game) as any;
            }
        });
        // @ts-ignore
        this.context.patch(CombatManager, "onEnemyDeath").after(()=> {
            try {
                // if (game && game.activeAction && game.activeAction._localID) {
                    // if (game.activeAction._localID === "Combat") {
                        const combatLevel = game.combat.enemy.monster.combatLevel
                        // const classes = game.skills.getObjectByID('namespace_classes:Classes') as Classes;
                        const teacher = game.classes.shouts.get(1)
                        const exp = Math.floor((combatLevel/teacher.teacher.baseExperience) + teacher.teacher.baseExperience)
                        game.classes.addXP(exp)
                        game.classes.addMasteryXP(teacher.teacher, exp)
                    // }
                // }            
            } catch (error) {
                console.log('addXP', error) 
            }
          });
    }

    private patchGamemodes(classes: Classes) {
        this.game.gamemodes.forEach(gamemode => {
            if (gamemode.allowDungeonLevelCapIncrease) {
                if (!gamemode.startingSkills) {
                    gamemode.startingSkills = new Set();
                }

                if (!gamemode.autoLevelSkillsPre99) {
                    gamemode.autoLevelSkillsPre99 = [];
                }

                if (!gamemode.autoLevelSkillsPost99) {
                    gamemode.autoLevelSkillsPost99 = [];
                }

                gamemode.startingSkills.add(classes);
                gamemode.autoLevelSkillsPre99.push({ skill: classes, value: 5 });
                gamemode.autoLevelSkillsPost99.push({ skill: classes, value: 3 });
            }
        });
    }

    private patchUnlock(classes: Classes) {
        this.context.patch(EventManager, 'loadEvents').after(() => {
            if (this.game.currentGamemode.allowDungeonLevelCapIncrease) {
                classes.setUnlock(true);
                classes.increasedLevelCap = this.game.attack.increasedLevelCap;
            }
        });
    }

    private isClassesEvent(
        data: GameEventMatcherData | ClassesActionEventMatcherOptions
    ): data is ClassesActionEventMatcherOptions {
        return data.type === 'ClassesAction';
    }

    private initSettings() {
        const settings = new ClassesSettings(this.context);

        settings.init();

        return settings;
    }

    private initModifiers() {
        const modifiers = new ClassesModifiers();

        modifiers.registerModifiers();
    }

    // private initTownship() {
    //     const township = new ClassesTownship(this.context, this.game);

    //     township.register();
    // }

    // private initAgility(classes: Classes) {
    //     const agility = new ClassesAgility(this.game, classes);

    //     agility.register();
    // }

    // private initAstrology(classes: Classes) {
    //     const astrology = new ClassesAstrology(this.game, classes);

    //     astrology.register();
    // }

    private initCompatibility(classes: Classes) {
        const tinyPassiveIcons = new TinyPassiveIconsCompatibility(this.context, classes);

        tinyPassiveIcons.patch();
    }

    private initInterface(classes: Classes) {
        const userInterface = new UserInterface(this.context, this.game, classes);

        userInterface.init();

        return userInterface;
    }

    private initTranslation() {
        const translation = new ClassesTranslation(this.context);

        translation.init();
    }

    private initLanguage() {
        let lang = setLang;

        if (lang === 'lemon' || lang === 'carrot') {
            lang = 'en';
        }

        const keysToNotPrefix = [
            'MASTERY_CHECKPOINT',
            'MASTERY_BONUS',
            'POTION_NAME',
            'PET_NAME',
            'ITEM_NAME',
            'ITEM_DESCRIPTION',
            'SHOP_NAME',
            'SHOP_DESCRIPTION',
            'MONSTER_NAME',
            'COMBAT_AREA_NAME',
            'SPECIAL_ATTACK_NAME',
            'SPECIAL_ATTACK_DESCRIPTION'
        ];

        for (const [key, value] of Object.entries<string>(languages[lang])) {
            if (keysToNotPrefix.some(prefix => key.includes(prefix))) {
                loadedLangJson[key] = value;
            } else {
                loadedLangJson[`Classes_Classes_${key}`] = value;
            }
        }
    }
}


// {
//     "level": 1,
//     "key": "increasedDamageTakenFromAirSpells",
//     "value": 20
// },
// {
//     "level": 40,
//     "key": "increasedDamageAgainstDragons",
//     "value": 20
// },
// {
//     "level": 75,
//     "key": "increasedDamageAgainstHumans",
//     "value": 20
// },
// {
//     "level": 99,
//     "key": "increasedDamageAgainstUndead",
//     "value": 20
// },
// {
//     "level": 120,
//     "key": "increasedDamageAgainstElves",
//     "value": 20
// }