import { ProfileActionEventMatcher, ProfileActionEventMatcherOptions } from './profile/event';
import { Profile } from './profile/profile';
import { UserInterface } from './profile/user-interface';
import { ProfileModifiers } from './profile/modifiers';
// import { ProfileTownship } from './profile/township/township';
// import { ProfileAgility } from './agility/agility';
// import { ProfileAstrology } from './astrology/astrology';
import { TinyPassiveIconsCompatibility } from './compatibility/tiny-passive-icons';
import { ProfileSkillData } from './profile/profile.types';
import { languages } from './language';
import { ProfileTranslation } from './profile/translation/translation';
import { ProfileSettings } from './profile/settings';

declare global {
    interface CloudManager {
        hasTotHEntitlement: boolean;
        hasAoDEntitlement: boolean;
    }

    const cloudManager: CloudManager;

    interface SkillIDDataMap {
        'namespace_profile:Profile': ProfileSkillData;
    }

    interface SkillValue {
        skill: AnySkill;
        value: number;
    }

    interface Game {
        profile: Profile;
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
        await this.context.loadTemplates('profile/profile.html');
        await this.context.loadTemplates('profile/single_species/single_species.html');
        await this.context.loadTemplates('profile/shout/shout.html');
        await this.context.loadTemplates('profile/mastery/mastery.html');
        await this.context.loadTemplates('profile/locked/locked.html');

        this.initLanguage();
        this.initTranslation();
        const settings = this.initSettings();
        this.patchEventManager();
        this.initModifiers();

        this.game.profile = this.game.registerSkill(this.game.registeredNamespaces.getNamespace('namespace_profile'), Profile);
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
            //             skillID: 'namespace_profile:Profile',
            //             data: {
            //                 minibar: {
            //                     defaultItems: ['namespace_profile:Superior_Profile_Skillcape'],
            //                     upgrades: [],
            //                     pets: []
            //                 },
            //                 species: []
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

        this.patchGamemodes(this.game.profile);
        this.patchUnlock(this.game.profile);
        this.initCompatibility(this.game.profile);
        // this.initAgility(this.game.profile);
        // this.initAstrology(this.game.profile);
        // this.initTownship();

        this.game.profile.userInterface = this.initInterface(this.game.profile);
        this.game.profile.initSettings(settings);
    }

    private patchEventManager() {
        this.context.patch(GameEventSystem, 'constructMatcher').after((_patch, data) => {
            if (this.isProfileEvent(data)) {
                return new ProfileActionEventMatcher(data, this.game) as any;
            }
        });
        // @ts-ignore
        this.context.patch(CombatManager, "onEnemyDeath").after(()=> {
            try {
                // if (game && game.activeAction && game.activeAction._localID) {
                    // if (game.activeAction._localID === "Combat") {
                        const combatLevel = game.combat.enemy.monster.combatLevel
                        // const profile = game.skills.getObjectByID('namespace_profile:Profile') as Profile;
                        const single_species = game.profile.shouts.get(1)
                        const exp = Math.floor((combatLevel/single_species.single_species.baseExperience) + single_species.single_species.baseExperience)
                        game.profile.addXP(exp)
                        game.profile.addMasteryXP(single_species.single_species, exp)
                    // }
                // }            
            } catch (error) {
                console.log('addXP', error) 
            }
          });
    }

    private patchGamemodes(profile: Profile) {
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

                gamemode.startingSkills.add(profile);
                gamemode.autoLevelSkillsPre99.push({ skill: profile, value: 5 });
                gamemode.autoLevelSkillsPost99.push({ skill: profile, value: 3 });
            }
        });
    }

    private patchUnlock(profile: Profile) {
        this.context.patch(EventManager, 'loadEvents').after(() => {
            if (this.game.currentGamemode.allowDungeonLevelCapIncrease) {
                profile.setUnlock(true);
                profile.increasedLevelCap = this.game.attack.increasedLevelCap;
            }
        });
    }

    private isProfileEvent(
        data: GameEventMatcherData | ProfileActionEventMatcherOptions
    ): data is ProfileActionEventMatcherOptions {
        return data.type === 'ProfileAction';
    }

    private initSettings() {
        const settings = new ProfileSettings(this.context);

        settings.init();

        return settings;
    }

    private initModifiers() {
        const modifiers = new ProfileModifiers();

        modifiers.registerModifiers();
    }

    // private initTownship() {
    //     const township = new ProfileTownship(this.context, this.game);

    //     township.register();
    // }

    // private initAgility(profile: Profile) {
    //     const agility = new ProfileAgility(this.game, profile);

    //     agility.register();
    // }

    // private initAstrology(profile: Profile) {
    //     const astrology = new ProfileAstrology(this.game, profile);

    //     astrology.register();
    // }

    private initCompatibility(profile: Profile) {
        const tinyPassiveIcons = new TinyPassiveIconsCompatibility(this.context, profile);

        tinyPassiveIcons.patch();
    }

    private initInterface(profile: Profile) {
        const userInterface = new UserInterface(this.context, this.game, profile);

        userInterface.init();

        return userInterface;
    }

    private initTranslation() {
        const translation = new ProfileTranslation(this.context);

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
                loadedLangJson[`Profile_Profile_${key}`] = value;
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