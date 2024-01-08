import { ProfileActionEventMatcher, ProfileActionEventMatcherOptions } from './profile/event';
import { Profile } from './profile/profile';
import { UserInterface } from './profile/user-interface';
import { ProfileModifiers } from './profile/modifiers';
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
        await this.context.loadTemplates('profile/you/you.html');
        await this.context.loadTemplates('profile/mastery/mastery.html');
        await this.context.loadTemplates('profile/locked/locked.html');
        await this.context.loadTemplates('profile/guide.html');

        this.initLanguage();
        this.initTranslation();
        const settings = this.initSettings();
        this.patchEventManager();
        this.initModifiers();

        this.game.profile = this.game.registerSkill(this.game.registeredNamespaces.getNamespace('namespace_profile'), Profile);
        const kcm = mod.manager.getLoadedModList().includes('Custom Modifiers in Melvor')
        if (!kcm) {
            return;
        }
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
            "melvorD:ProtectorofIce"
        ]
        const AngelList: any[] = [
            "melvorF:Angel",
            "melvorF:Fairy",
            "melvorF:Valkyrie",
            "melvorF:HolyArcher"
        ]
        const PlantList: any[] = [
            "melvorD:Plant"
        ]
        const OrcList: any[] = [
            "melvorF:TurkulRiders",
            "melvorF:TurkulArchers",
            "melvorF:TurkulThrowers",
            "melvorF:TurkulGiant",
            "melvorF:TurkulGeneral"
        ]
        const elfList: any[] = [
        ]
        const UndeadList: any[] = [
            "melvorD:PirateCaptain",
            "melvorD:ZombieHand",
            "melvorD:Zombie",
            "melvorD:ZombieLeader",
            "melvorD:Ghost",
            "melvorD:Skeleton",
            "melvorF:UndeadWerewolf",
            "melvorF:CursedLich",
            "melvorF:GreaterSkeletalDragon",
            "melvorF:Mummy",
            "melvorF:Vampire",
            "melvorF:ElderVampire",
            "melvorF:CursedMaiden"
        ]
        const AarakocraList: any[] = []
        const SeaCreatureList: any[] = [
            "melvorF:MioliteSprig",
            "melvorF:MioliteTrio",
            "melvorF:MioliteWarden",
            "melvorF:MioliteMonarch",
            "melvorD:GiantCrab",
            "melvorD:Tentacle",
            "melvorD:TheKraken",
            "melvorF:Lissia",
            "melvorF:Murtia",
            "melvorF:Umbora",
            "melvorF:Rokken",
            "melvorF:Kutul",
            "melvorF:Lissia",
            "melvorF:Murtia",
            "melvorF:MioliteWarden",
        ]
        const GoblinList = [
            "melvorD:Golbin",
            "melvorD:RangedGolbin"
        ]
        const AnimalList: any[] = [            
            "melvorD:Chicken",
            "melvorD:Cow",
            "melvorD:Chick",
            "melvorD:MummaChicken",
            "melvorD:Leech",
            "melvorD:Bat",
            "melvorD:BigBat",
            "melvorD:ViciousSerpent",
            "melvorD:Spider",
            "melvorD:BrownSpider",
            "melvorD:EvilSpider",
            "melvorD:SpiderKing",
            "melvorD:Seagull",
            "melvorD:FrozenMammoth",
            "melvorF:AirGuard",
            "melvorF:LegaranWurm",
            "melvorF:NoxiousSerpent",
            "melvorF:VenomousSnake",
            "melvorF:GiantMoth",
            "melvorF:RancoraSpider",
            "melvorF:SpikedRedClaw"
        ]
        const ElementalCreatureList: any[] = [
            "melvorD:Ice",
            "MelvorD:FireSpirit",
            "melvorF:AirGolem",
            "melvorF:WaterGuard",
            "melvorF:WaterMonster",
            "melvorF:WaterGolem",
            "melvorF:Glacia",
            "melvorF:EarthGolem",
            "melvorF:FireGolem",
        ]
        const HumansList: any[] = [
            "melvorF:BountyHunter",
            "melvorD:BlackKnight",
            "melvorD:ConfusedPirate",
            "melvorD:FrozenArcher",
            "melvorD:Pirate",
            "melvorD:FirstMate",
            "melvorD:JuniorFarmer",
            "melvorD:AdultFarmer",
            "melvorD:MasterFarmer",
            "melvorD:Wizard",
            "melvorD:SteelKnight",
            "melvorD:MithrilKnight",
            "melvorD:AdamantKnight",
            "melvorD:RuneKnight",
            "melvorD:BanditTrainee",
            "melvorD:Bandit",
            "melvorD:BanditLeader",
            "melvorD:DarkWizard",
            "melvorD:MasterWizard",
            "melvorD:ElderWizard",
            "melvorF:Druid",
            "melvorF:Thief",
            "melvorF:Shaman",
            "melvorF:Necromancer",
            "melvorF:Elementalist",
            "melvorF:Paladin",
            "melvorF:Priest",
            "melvorF:WanderingBard",

        ]
        const DemonList: any[] = [
            "melvorF:RedDevil",
            "melvorF:FierceDevil",
            "melvorF:FireGuard",
            "melvorF:Ignis",
            "melvorF:Ragnar"
        ]
        const MythList: any[] = [
            "melvorD:ElerineMage",
            "melvorD:ElerineWarrior",
            "melvorD:ElerineArcher",
            "melvorF:Griffin",
            "melvorF:Pegasus",
            "melvorF:Cerberus",
            "melvorF:Phoenix",
            "melvorF:Aleron",
            "melvorF:EarthGuard",
            "melvorF:EarthMonster",
            "melvorF:Ophidia",
            "melvorF:FireMonster",
            "melvorTotH:IceHydra",
            "melvorF:Aeris",
            "melvorF:Voltaire",
            "melvorF:Aleron"
        ]
        const BeastList = ["melvorD:WetMonster", "melvorD:SweatyMonster", "melvorD:MoistMonster", "melvorD:IceMonster", "melvorF:StoneSnake", "melvorF:Statue", "melvorF:GooMonster", "melvorF:GreenGooMonster", "melvorF:PurpleGooMonster", "melvorF:ScatteredGooMonster", "melvorF:LotsofEyes", "melvorF:ManyEyedMonster", "melvorF:StrangeEyedMonster", "melvorF:Eyes", "melvorF:SuperiorEyedMonster", "melvorF:EyeOfFear", "melvorF:SandBeast", "melvorF:RagingHornedElite", "melvorF:SeethingHornedElite", "melvorF:DarkHornedElite", "melvorF:FuriousHornedElite", "melvorTotH:LargeIceTroll", "melvorD:IceTroll", "melvorD:Ice", "melvorD:TheEye", "melvorD:ResurrectedEye", "melvorF:AirMonster", "melvorF:AirGuard"]
        const GiantList = ["melvorD:HillGiant", "melvorD:MossGiant", "melvorF:GiantMoth", "melvorD:GiantCrab", "melvorF:TurkulGiant"]
        if (cloudManager.hasTotHEntitlement) {
            BeastList.push("melvorTotH:GoliathWerewolf")
            MythList.push(
                "melvorTotH:Manticore",
                "melvorTotH:Cockatrice"
            )
            DemonList.push(
                "melvorTotH:MagicFireDemon",
                "melvorTotH:GuardianoftheHerald"
            )
            ElementalCreatureList.push(
                "melvorTotH:InfernalGolem",
                "melvorTotH:FrostGolem",
                "melvorTotH:LightningSpirit"
            )
            HumansList.push(
                "melvorTotH:PlagueDoctor", "melvorTotH:DarkKnight",
            )
            SeaCreatureList.push(
                "melvorTotH:TwinSeaDragonSerpent",
                "melvorTotH:Leviathan",
                "melvorTotH:Siren",
                "melvorTotH:MonsterCroc",
            )
            UndeadList.push(
                "melvorTotH:CursedSkeletonWarrior",
                "melvorTotH:CursedSpirit",
                "melvorTotH:LadyDarkheart",
                "melvorTotH:Phantom",
                "melvorTotH:Banshee",
                "melvorTotH:Spectre",
                "melvorTotH:VorloranDevastator",
                "melvorTotH:VorloranWatcher",
                "melvorTotH:VorloranProtector",
                "melvorTotH:Fiozor",
            )
            DragonList.push(
                "melvorTotH:TwinSeaDragonSerpent",
                "melvorTotH:RaZu",
                "melvorTotH:Kongamato",
                "melvorTotH:GretYun"
            )
            PlantList.push(
                "melvorTotH:HungryPlant",
                "melvorTotH:Alraune",
                "melvorTotH:Morellia",
                "melvorTotH:TreeGiant",
                "melvorTotH:TreeSpirit",
            )
            AarakocraList.push(
                "melvorTotH:Torvair",
                "melvorTotH:Arctair",
                "melvorTotH:Harkair"
            )
            AnimalList.push(
                "melvorTotH:PoisonToad",
                "melvorTotH:Conda",
                "melvorTotH:BurningSnake",
                "melvorTotH:PolarBear",
                "melvorTotH:SpectralIceWolf",
                "melvorTotH:MonsterCroc",
                "melvorTotH:ScouterSpider",
                "melvorTotH:TrapperSpider",
                "melvorTotH:WickedSpider",
                "melvorTotH:BasherSpider",
                "melvorTotH:EnforcerSpider",
                "melvorTotH:GuardianSpider",
                "melvorTotH:SpiderQueen",
                "melvorTotH:Beholder",
                "melvorTotH:ShadowBeast"
            )
        }
        if (cloudManager.hasAoDEntitlement) {
            PlantList.push("melvorAoD:EvilOak", "melvorAoD:GrumpyWillow", "melvorAoD:AngryTeak", "melvorAoD:RagingMaple", "melvorAoD:IllusiveRoots", "melvorAoD:LavaGolem")
            BeastList.push("melvorAoD:GreenSlime", "melvorAoD:SlimeShooter", "melvorAoD:PoisonRoamer", "melvorAoD:PoisonSlime", "melvorAoD:PoisonBloater", "melvorAoD:PoisonLeecher", "melvorAoD:MagicMirror", "melvorAoD:PossessedBarrel", "melvorAoD:FakeDoor", "melvorAoD:CultMonster", "melvorAoD:PuppetMaster")
            SeaCreatureList.push(
                "melvorAoD:ShipwreckBeast",
                "melvorAoD:Merman",
                "melvorAoD:MermaidArcher",
                "melvorAoD:MermanGuard",
                "melvorAoD:TreacherousJellyfish",
                "melvorAoD:Nagaia")
            UndeadList.push(
                "melvorAoD:BlindGhost",
                "melvorAoD:Lich",
                "melvorAoD:GhostSailor",
                "melvorAoD:GhostMercenary",
                "melvorAoD:CursedPirateCaptain", 
                "melvorAoD:VampiricBat"
            )
            HumansList.push(
                "melvorAoD:BlindWarrior",
                "melvorAoD:BlindArcher",
                "melvorAoD:BlindMage",
                "melvorAoD:SoulTakerWitch",
                "melvorAoD:CultMember"
            )
            ElementalCreatureList.push("melvorAoD:CrystalBarrager", "melvorAoD:CrystalSmasher", "melvorAoD:CrystalProwler", "melvorAoD:GraniteGolem", "melvorAoD:RangedGolem", "melvorAoD:EarthGolem", "melvorAoD:MagicGolem", "melvorAoD:CrystalManipulator", "melvorAoD:CrystalShatterer", "melvorAoD:CrystalBehemoth", "melvorAoD:LavaGolem")
            DemonList.push("melvorAoD:CultImp")
        }
        const cmim = mod.api.customModifiersInMelvor;
        // Species
        cmim.addMonsters("Dragon", DragonList)
        cmim.addMonsters("Animal", AnimalList)
        cmim.addMonsters("Undead", UndeadList)
        cmim.addMonsters("SeaCreature", SeaCreatureList)
        cmim.addMonsters("Human", HumansList)
        cmim.addMonsters("Demon", DemonList)
        cmim.addMonsters("MythicalCreature", MythList)
        cmim.addMonsters("Elemental", ElementalCreatureList)

        cmim.registerOrUpdateType("Elf", "Elves", "https://cdn.melvor.net/core/v018/assets/media/pets/elf_rock.png", elfList, true);
        cmim.registerOrUpdateType("Goblin", "Goblins", "https://cdn.melvor.net/core/v018/assets/media/monsters/goblin.png", GoblinList, true);
        cmim.registerOrUpdateType("Plant", "Plants", "https://cdn.melvor.net/core/v018/assets/media/monsters/plant.png", PlantList, true);
        cmim.registerOrUpdateType("Orc", "Orcs", "https://cdn.melvor.net/core/v018/assets/media/monsters/goblin.png", OrcList, true);
        cmim.registerOrUpdateType("Giant", "Giants", "https://cdn2-main.melvor.net/assets/media/monsters/hill_giant.png", GiantList, true);
        cmim.registerOrUpdateType("Beast", "Beasts", "https://cdn2-main.melvor.net/assets/media/monsters/m13.png", BeastList, true);
        cmim.registerOrUpdateType("Aarakocra", "Aarakocras", "https://cdn2-main.melvor.net/assets/media/monsters/torvair.png", AarakocraList, true);
        cmim.registerOrUpdateType("Angel", "Angels", "https://cdn2-main.melvor.net/assets/media/monsters/angel.png", AngelList, true);

        cmim.forceBaseModTypeActive("Dragon");
        cmim.forceBaseModTypeActive("Undead");
        cmim.forceBaseModTypeActive("Human");
        cmim.forceBaseModTypeActive("Animal");
        cmim.forceBaseModTypeActive("Demon");
        cmim.forceBaseModTypeActive("Elemental");
        cmim.forceBaseModTypeActive("MythicalCreature");
        cmim.forceBaseModTypeActive("SeaCreature");

        // Classes
        // 1
        cmim.registerOrUpdateType("Knight", "Knights", "https://cdn2-main.melvor.net/assets/media/monsters/steel_knight.png", [], true);
        // 10
        cmim.registerOrUpdateType("Wizard", "Wizards", "https://cdn2-main.melvor.net/assets/media/monsters/wizard.png", [], true);
        // 20
        cmim.registerOrUpdateType("Scout", "Scouts", "https://cdn2-main.melvor.net/assets/media/monsters/vorloran_watcher.png", [], true);

        // 100
        cmim.registerOrUpdateType("Inquisitor", "Inquisitors", "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flh6.googleusercontent.com%2FskuUeS-5K71wasTCTeygB27hQUX0_lDxH1obAssZfPa8L2_e5u-YDs49Uu8urKIBWTdFUrnuQxiNp1CGub5b4JAA3d6XV7a2FKZKJVqbePTHwizHVOt3Xgne_6zt0h-5kw%3Ds800&f=1&nofb=1&ipt=856a2de22cf5c3ccc940367000465b6b191368a975c6ab4362051d6a881eb46c&ipo=images", [], true);


        

        await this.context.gameData.addPackage('data.json');
        // await this.context.gameData.addPackage('data-cmim.json');
        if (cloudManager.hasTotHEntitlement) {
            await this.context.gameData.addPackage('data-toth.json');
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

        // this.context.onCharacterLoaded(async () => {

        // })

        this.patchGamemodes(this.game.profile);
        this.patchUnlock(this.game.profile);
        this.initCompatibility(this.game.profile);

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
        this.context.patch(CombatManager, "onEnemyDeath").after(() => {
            try {
                // if (game && game.activeAction && game.activeAction._localID) {
                // if (game.activeAction._localID === "Combat") {
                const combatLevel = game.combat.enemy.monster.combatLevel
                // const profile = game.skills.getObjectByID('namespace_profile:Profile') as Profile;
                // game.profile.isPoolTierActive(0) // 3% skill exp
                // game.profile.isPoolTierActive(1) // 5% mastery exp
                // game.profile.isPoolTierActive(2) // All modifier values +1
                // game.profile.isPoolTierActive(3) // 5% you cost

                const single_species = game.profile.yous.get(1)
                const single_class = game.profile.yous.get(2)
                let exp1 = 0
                if (single_species) {
                    exp1 = Math.floor((combatLevel / single_species.single_species.baseExperience) + single_species.single_species.baseExperience) || 0
                }
                let exp2 = 0
                if (single_class) {
                    exp2 = Math.floor((combatLevel / single_class.single_species.baseExperience) + single_class.single_species.baseExperience) || 0
                }

                let skillExp1 = exp1 || 0
                let masteryExp1 = exp1 || 0

                let skillExp2 = exp2 || 0
                let masteryExp2 = exp2 || 0
                if (game.profile.isPoolTierActive(1)) {
                    skillExp1 = skillExp1 + ((skillExp1 / 100) * 3) || 0
                    skillExp2 = skillExp2 + ((skillExp2 / 100) * 3) || 0
                }
                if (game.profile.isPoolTierActive(1)) {
                    masteryExp1 = masteryExp1 + ((masteryExp1 / 100) * 5) || 0
                    masteryExp2 = masteryExp2 + ((masteryExp2 / 100) * 5) || 0
                }

                const globalEXPmod = game.modifiers.increasedGlobalSkillXP - game.modifiers.decreasedGlobalSkillXP || 0
                // const globalEXPmodperSkill = game.modifiers.decreasedGlobalSkillXPPerLevel - game.modifiers.increasedGlobalSkillXPPerLevel
                // const flatEXPmod = game.modifiers.increasedFlatGlobalSkillXP - game.modifiers.decreasedFlatGlobalSkillXP
                // const flatEXPmodPerSkill = game.modifiers.decreasedFlatGlobalSkillXPPerSkillLevel - game.modifiers.increasedFlatGlobalSkillXPPerSkillLevel
                const totalExp = skillExp1 + skillExp2 + (((skillExp1 + skillExp2) / 100) * globalEXPmod) || 0
                game.profile.addXP(totalExp)

                const globalMasteryEXPmod = game.modifiers.increasedGlobalMasteryXP - game.modifiers.decreasedGlobalMasteryXP || 0

                const totalMasteryExp1 = masteryExp1 + (((skillExp1) / 100) * globalMasteryEXPmod) || 0
                const totalMasteryExp2 = masteryExp2 + (((skillExp2) / 100) * globalMasteryEXPmod) || 0

                if(single_species) {
                    game.profile.addMasteryXP(single_species.single_species, totalMasteryExp1)
                }
                if(single_class) {
                    game.profile.addMasteryXP(single_class.single_species, totalMasteryExp2)
                }
                game.profile.addMasteryPoolXP(totalMasteryExp1 + totalMasteryExp2)

            } catch (error) {
                console.log('addXP', error)
            }
        });
        // @ts-ignore
        this.context.patch(Skill, 'addXP').after(function (amount, masteryAction) {
            const single_species = game.profile.yous.get(1) // human
            const single_class = game.profile.yous.get(2) // knight

            let exp1 = 0
            if (single_species) {
                exp1 = Math.floor(single_species.single_species.baseExperience) || 0
            }
            let exp2 = 0
            if (single_class) {
                exp2 = Math.floor(single_class.single_species.baseExperience) || 0
            }
            let skillExp1 = exp1 || 0
            let masteryExp1 = exp1 || 0

            let skillExp2 = exp2 || 0
            let masteryExp2 = exp2 || 0
            if (game.profile.isPoolTierActive(1)) {
                skillExp1 = skillExp1 + ((skillExp1 / 100) * 3) || 0
                skillExp2 = skillExp2 + ((skillExp2 / 100) * 3) || 0
            }
            if (game.profile.isPoolTierActive(1)) {
                masteryExp1 = masteryExp1 + ((masteryExp1 / 100) * 5) || 0
                masteryExp2 = masteryExp2 + ((masteryExp2 / 100) * 5) || 0
            }
            // const globalEXPmod = game.modifiers.increasedGlobalSkillXP - game.modifiers.decreasedGlobalSkillXP || 0

            // const totalExp = skillExp1 + skillExp2 + (((skillExp1 + skillExp2) / 100) * globalEXPmod) || 0

            const globalMasteryEXPmod = game.modifiers.increasedGlobalMasteryXP - game.modifiers.decreasedGlobalMasteryXP || 0

            const totalMasteryExp1 = masteryExp1 + (((skillExp1) / 100) * globalMasteryEXPmod) || 0
            const totalMasteryExp2 = masteryExp2 + (((skillExp2) / 100) * globalMasteryEXPmod) || 0
            let currentSpeicies = ''
            if(single_species) {
                currentSpeicies = single_species.single_species.localID
            }
            
            if (game && game.activeAction && currentSpeicies === 'Human' && game.activeAction._localID === 'Crafting') {
                // && masteryAction !== totalExp // can kind of stop the re-triggering
                // game.profile.addXP(totalExp) // removed to only increase the mastery exp and not the skill exp causing a re-triggering
                game.profile.addMasteryXP(single_species.single_species, totalMasteryExp1)
                game.profile.addMasteryXP(single_class.single_species, totalMasteryExp2)
                game.profile.addMasteryPoolXP(totalMasteryExp1 + totalMasteryExp2)
            }

            if (game && game.activeAction && currentSpeicies === 'Elf' && game.activeAction._localID === 'Farming') {
                // && masteryAction !== totalExp // can kind of stop the re-triggering
                // game.profile.addXP(totalExp) // removed to only increase the mastery exp and not the skill exp causing a re-triggering
                game.profile.addMasteryXP(single_species.single_species, totalMasteryExp1)
                game.profile.addMasteryXP(single_class.single_species, totalMasteryExp2)
                game.profile.addMasteryPoolXP(totalMasteryExp1 + totalMasteryExp2)
            }
            // Angel // Pray?

            if (game && game.activeAction && currentSpeicies === 'Aarakocra' && game.activeAction._localID === 'Fishing') {
                // && masteryAction !== totalExp // can kind of stop the re-triggering
                // game.profile.addXP(totalExp) // removed to only increase the mastery exp and not the skill exp causing a re-triggering
                game.profile.addMasteryXP(single_species.single_species, totalMasteryExp1)
                game.profile.addMasteryXP(single_class.single_species, totalMasteryExp2)
                game.profile.addMasteryPoolXP(totalMasteryExp1 + totalMasteryExp2)
            }

            if (game && game.activeAction && currentSpeicies === 'Goblin' && game.activeAction._localID === 'Thieving') {
                // && masteryAction !== totalExp // can kind of stop the re-triggering
                // game.profile.addXP(totalExp) // removed to only increase the mastery exp and not the skill exp causing a re-triggering
                game.profile.addMasteryXP(single_species.single_species, totalMasteryExp1)
                game.profile.addMasteryXP(single_class.single_species, totalMasteryExp2)
                game.profile.addMasteryPoolXP(totalMasteryExp1 + totalMasteryExp2)
            }

            if (game && game.activeAction && currentSpeicies === 'Dragon' && game.activeAction._localID === 'Firemaking') {
                // && masteryAction !== totalExp // can kind of stop the re-triggering
                // game.profile.addXP(totalExp) // removed to only increase the mastery exp and not the skill exp causing a re-triggering
                game.profile.addMasteryXP(single_species.single_species, totalMasteryExp1)
                game.profile.addMasteryXP(single_class.single_species, totalMasteryExp2)
                game.profile.addMasteryPoolXP(totalMasteryExp1 + totalMasteryExp2)
            }

            if (game && game.activeAction && currentSpeicies === 'Undead' && game.activeAction._localID === 'Mining') {
                // && masteryAction !== totalExp // can kind of stop the re-triggering
                // game.profile.addXP(totalExp) // removed to only increase the mastery exp and not the skill exp causing a re-triggering
                game.profile.addMasteryXP(single_species.single_species, totalMasteryExp1)
                game.profile.addMasteryXP(single_class.single_species, totalMasteryExp2)
                game.profile.addMasteryPoolXP(totalMasteryExp1 + totalMasteryExp2)
            }

            if (game && game.activeAction && currentSpeicies === 'Demon' && game.activeAction._localID === 'Summoning') {
                // && masteryAction !== totalExp // can kind of stop the re-triggering
                // game.profile.addXP(totalExp) // removed to only increase the mastery exp and not the skill exp causing a re-triggering
                game.profile.addMasteryXP(single_species.single_species, totalMasteryExp1)
                game.profile.addMasteryXP(single_class.single_species, totalMasteryExp2)
                game.profile.addMasteryPoolXP(totalMasteryExp1 + totalMasteryExp2)
            }

            if (game && game.activeAction && currentSpeicies === 'SeaCreature' && game.activeAction._localID === 'Agility') {
                // && masteryAction !== totalExp // can kind of stop the re-triggering
                // game.profile.addXP(totalExp) // removed to only increase the mastery exp and not the skill exp causing a re-triggering
                game.profile.addMasteryXP(single_species.single_species, totalMasteryExp1)
                game.profile.addMasteryXP(single_class.single_species, totalMasteryExp2)
                game.profile.addMasteryPoolXP(totalMasteryExp1 + totalMasteryExp2)
            }

            if (game && game.activeAction && currentSpeicies === 'Elemental' && game.activeAction._localID === 'Runecrafting') {
                // && masteryAction !== totalExp // can kind of stop the re-triggering
                // game.profile.addXP(totalExp) // removed to only increase the mastery exp and not the skill exp causing a re-triggering
                game.profile.addMasteryXP(single_species.single_species, totalMasteryExp1)
                game.profile.addMasteryXP(single_class.single_species, totalMasteryExp2)
                game.profile.addMasteryPoolXP(totalMasteryExp1 + totalMasteryExp2)
            }

            if (game && game.activeAction && currentSpeicies === 'MythicalCreature' && game.activeAction._localID === 'Astrology') {
                // && masteryAction !== totalExp // can kind of stop the re-triggering
                // game.profile.addXP(totalExp) // removed to only increase the mastery exp and not the skill exp causing a re-triggering
                game.profile.addMasteryXP(single_species.single_species, totalMasteryExp1)
                game.profile.addMasteryXP(single_class.single_species, totalMasteryExp2)
                game.profile.addMasteryPoolXP(totalMasteryExp1 + totalMasteryExp2)
            }

            if (game && game.activeAction && currentSpeicies === 'Giant' && game.activeAction._localID === 'Woodcutting') {
                // && masteryAction !== totalExp // can kind of stop the re-triggering
                // game.profile.addXP(totalExp) // removed to only increase the mastery exp and not the skill exp causing a re-triggering
                game.profile.addMasteryXP(single_species.single_species, totalMasteryExp1)
                game.profile.addMasteryXP(single_class.single_species, totalMasteryExp2)
                game.profile.addMasteryPoolXP(totalMasteryExp1 + totalMasteryExp2)
            }
            // 100, 105, 110, 115, 120
            // "Plant" Herblore  
            // Orc Smithing

            // Beast
            // Animal 

            // {"melvorD:Cooking" => Cooking}
            // {"melvorD:Fletching" => Fletching}

            // {"melvorD:Township" => Township}
            // {"melvorAoD:Cartography" => Cartography}
            // {"melvorAoD:Archaeology" => Archaeology}

            // {"mythMusic:Music" => Music}
            // {"namespace_thuum:Thuum" => Thuum}
            return [amount, masteryAction]
        })
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