import { ProfileActionEventMatcher, ProfileActionEventMatcherOptions } from './profile/event';
import { Profile } from './profile/profile';
import { UserInterface } from './profile/user-interface';
import { TinyPassiveIconsCompatibility } from './compatibility/tiny-passive-icons';
import { ProfileSkillData } from './profile/profile.types';
import { languages } from './language';
import { ProfileTranslation } from './profile/translation/translation';
import { ProfileSettings } from './profile/settings';
import { classList } from './../../class'
declare global {
    interface CloudManager {
        hasTotHEntitlementAndIsEnabled: boolean;
        hasAoDEntitlementAndIsEnabled: boolean;
        hasItAEntitlementAndIsEnabled: boolean;
    }

    // @ts-ignore
    const cloudManager: CloudManager;

    interface SkillIDDataMap {
        'namespace_profile:Profile': ProfileSkillData;
    }

    interface SkillValue {
        skill: AnySkill;
        value: number;
    }

    interface Game {
        profileLog: any,
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
        // mod.api.mythCombatSimulator?.registerNamespace('namespace_profile');
        await this.context.loadTemplates('profile/profile.html');
        await this.context.loadTemplates('profile/single_species/single_species.html');
        await this.context.loadTemplates('profile/you/you.html');
        await this.context.loadTemplates('profile/mastery/mastery.html');
        await this.context.loadTemplates('profile/locked/locked.html');
        // await this.context.loadTemplates('profile/guide.html');
        this.initLanguage();
        this.initTranslation();
        const settings = this.initSettings();
        this.patchEventManager();
        this.game.profile = this.game.registerSkill(this.game.registeredNamespaces.getNamespace('namespace_profile'), Profile);

        this.context.onModsLoaded(async () => {
            const kcm = mod.manager.getLoadedModList().includes('Custom Modifiers in Melvor')
            const AR = mod.manager.getLoadedModList().includes('Abyssal Rift')
            // const gen1 = mod.manager.getLoadedModList().includes('Pokeworld (Generation 1)')
            const music = mod.manager.getLoadedModList().includes('[Myth] Music')
            const ToB = mod.manager.getLoadedModList().includes('Theatre of Blood')
            // const Runescape = mod.manager.getLoadedModList().includes('Runescape Encounters in Melvor')
            const Pokemon = mod.manager.getLoadedModList().includes('pokemon')
            const tes = mod.manager.getLoadedModList().includes('The Elder Scrolls')
            const necromancy = mod.manager.getLoadedModList().includes("Necromancy")

            // const monad = mod.manager.getLoadedModList().includes('Monad')
            if (!kcm) {
                console.log('kcm not found')
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
                "melvorD:Plant",
                "namespace_profile:plant_golem"
            ]
            const OrcList: any[] = [
                "melvorF:TurkulRiders",
                "melvorF:TurkulArchers",
                "melvorF:TurkulThrowers",
                "melvorF:TurkulGiant",
                "melvorF:TurkulGeneral"
            ]
            const elfList: any[] = [
                "melvorD:ElderWizard",
                "melvorD:FrozenArcher",
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
            const NagaList: any[] = [
                "melvorF:StoneSnake",
            ]
            const AnimalList: any[] = [
                "namespace_profile:abyssal_chicken_monster",
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
                "namespace_profile:plant_golem",
                "namespace_profile:fire_golem",
                "namespace_profile:air_golem",
                "namespace_profile:sand_golem",
                "melvorD:Ice",
                "melvorD:FireSpirit",
                "melvorF:AirGolem",
                "melvorF:WaterGuard",
                "melvorF:WaterMonster",
                "melvorF:WaterGolem",
                "melvorF:Glacia",
                "melvorF:EarthGolem",
                "melvorF:FireGolem",
            ]
            const HumansList: any[] = [
                "namespace_profile:Bob_monster",
                "melvorF:BountyHunter",
                "melvorD:BlackKnight",
                "melvorD:ConfusedPirate",
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
                "melvorF:Aeris",
                "melvorF:Voltaire",
                "melvorF:Aleron"
            ]
            const BeastList = [
                "melvorD:WetMonster", "melvorD:SweatyMonster", "melvorD:MoistMonster", "melvorD:IceMonster", "melvorF:Statue", "melvorF:GooMonster", "melvorF:GreenGooMonster", "melvorF:PurpleGooMonster", "melvorF:ScatteredGooMonster", "melvorF:LotsofEyes", "melvorF:ManyEyedMonster", "melvorF:StrangeEyedMonster", "melvorF:Eyes", "melvorF:SuperiorEyedMonster", "melvorF:EyeOfFear", "melvorF:SandBeast", "melvorF:RagingHornedElite", "melvorF:SeethingHornedElite", "melvorF:DarkHornedElite", "melvorF:FuriousHornedElite", "melvorD:IceTroll", "melvorD:Ice", "melvorD:TheEye", "melvorD:ResurrectedEye", "melvorF:AirMonster", "melvorF:AirGuard"
            ]
            const GiantList = [
                "melvorD:HillGiant", "melvorD:MossGiant", "melvorF:GiantMoth", "melvorD:GiantCrab", "melvorF:TurkulGiant"
            ]
            const FightersList: any[] = [
                "melvorD:BlackKnight",
                "melvorD:HillGiant",
                "melvorD:MossGiant",
                "melvorD:GiantCrab",
                "melvorD:Tentacle",
                "melvorD:Seagull",
                "melvorD:ConfusedPirate",
                "melvorD:FrozenMammoth",
                "melvorD:WetMonster",
                "melvorD:MoistMonster",
                "melvorD:SweatyMonster",
                "melvorD:Golbin",
                "melvorD:Chicken",
                "melvorD:Cow",
                "melvorD:Chick",
                "melvorD:MummaChicken",
                "melvorD:Pirate",
                "melvorD:PirateCaptain",
                "melvorD:TheKraken",
                "melvorD:Bat",
                "melvorD:BigBat",
                "melvorD:MalcsTheGuardianOfMelvor",
                "melvorD:Spider",
                "melvorD:BrownSpider",
                "melvorD:EvilSpider",
                "melvorD:SpiderKing",
                "melvorD:IceMonster",
                "melvorD:IceTroll",
                "melvorD:Ice",
                "melvorD:ProtectorofIce",
                "melvorD:FirstMate",
                "melvorD:ZombieHand",
                "melvorD:Zombie",
                "melvorD:ZombieLeader",
                "melvorD:Ghost",
                "melvorD:GreenDragon",
                "melvorD:BlueDragon",
                "melvorD:RedDragon",
                "melvorD:BlackDragon",
                "melvorD:JuniorFarmer",
                "melvorD:AdultFarmer",
                "melvorD:MasterFarmer",
                "melvorD:SteelKnight",
                "melvorD:MithrilKnight",
                "melvorD:AdamantKnight",
                "melvorD:RuneKnight",
                "melvorD:Leech",
                "melvorD:Plant",
                "melvorD:ElerineWarrior",
                "melvorF:Mummy",
                "melvorF:Statue",
                "melvorF:UndeadWerewolf",
                "melvorF:FierceDevil",
                "melvorF:StrangeEyedMonster",
                "melvorF:LotsofEyes",
                "melvorF:Eyes",
                "melvorF:Griffin",
                "melvorF:Pegasus",
                "melvorF:Valkyrie",
                "melvorF:GooMonster",
                "melvorF:GreenGooMonster",
                "melvorF:PurpleGooMonster",
                "melvorF:ScatteredGooMonster",
                "melvorF:RagingHornedElite",
                "melvorF:DarkHornedElite",
                "melvorF:AirMonster",
                "melvorF:Aleron",
                "melvorF:WaterMonster",
                "melvorF:Murtia",
                "melvorF:EarthMonster",
                "melvorF:EarthGolem",
                "melvorF:Ophidia",
                "melvorF:Terran",
                "melvorF:FireGuard",
                "melvorF:FireMonster",
                "melvorF:Ignis",
                "melvorF:ElderDragon",
                "melvorF:MioliteSprig",
                "melvorF:MioliteWarden",
                "melvorF:TurkulRiders",
                "melvorF:TurkulGiant",
                "melvorF:BountyHunter",
                "melvorF:ChaoticGreaterDragon",
                "melvorF:Umbora",
                "melvorF:Paladin",
                "melvorF:Cerberus",
                "melvorF:RedDevil",
                "melvorF:Incendius",
                "melvorF:MalcsTheLeaderOfDragons",
                "melvorF:MysteriousFigurePhase1",
                "melvorF:EyeOfFear",
                "melvorF:VenomousSnake",
                "melvorF:SpikedRedClaw",
                "melvorF:GreaterSkeletalDragon",
            ]
            const MagesList: any[] = [
                "melvorD:TheEye",
                "melvorD:ResurrectedEye",
                "melvorD:Wizard",
                "melvorD:DarkWizard",
                "melvorD:MasterWizard",
                "melvorD:ElderWizard",
                "melvorD:FireSpirit",
                "melvorD:ElerineMage",
                "melvorF:StoneSnake",
                "melvorF:Fairy",
                "melvorF:Angel",
                "melvorF:SeethingHornedElite",
                "melvorF:WaterGuard",
                "melvorF:WaterGolem",
                "melvorF:Lissia",
                "melvorF:Glacia",
                "melvorF:Mistral",
                "melvorF:FireGolem",
                "melvorF:Pyra",
                "melvorF:Ragnar",
                "melvorF:MioliteTrio",
                "melvorF:MioliteMonarch",
                "melvorF:Druid",
                "melvorF:Shaman",
                "melvorF:Necromancer",
                "melvorF:Elementalist",
                "melvorF:CursedMaiden",
                "melvorF:WickedGreaterDragon",
                "melvorF:Kutul",
                "melvorF:Priest",
                "melvorF:WanderingBard",
                "melvorF:FearfulEye",
                "melvorF:Phoenix",
                "melvorF:Ahrenia",
                "melvorF:SuperiorEyedMonster",
                "melvorF:GiantMoth",
                "melvorF:CursedLich",
            ]
            const RoguesList: any[] = [
                "melvorD:FrozenArcher",
                "melvorD:RangedGolbin",
                "melvorD:PratTheProtectorOfSecrets",
                "melvorD:BanditTrainee",
                "melvorD:Bandit",
                "melvorD:BanditLeader",
                "melvorD:Skeleton",
                "melvorD:ViciousSerpent",
                "melvorD:ElerineArcher",
                "melvorF:Vampire",
                "melvorF:ManyEyedMonster",
                "melvorF:HolyArcher",
                "melvorF:AirGuard",
                "melvorF:AirGolem",
                "melvorF:Voltaire",
                "melvorF:Aeris",
                "melvorF:EarthGuard",
                "melvorF:FuriousHornedElite",
                "melvorF:Thief",
                "melvorF:TurkulArchers",
                "melvorF:TurkulThrowers",
                "melvorF:TurkulGeneral",
                "melvorF:SandBeast",
                "melvorF:RancoraSpider",
                "melvorF:ElderVampire",
                "melvorF:HuntingGreaterDragon",
                "melvorF:Rokken",
                "melvorF:PratTheGuardianOfSecrets",
                "melvorF:MysteriousFigurePhase2",
                "melvorF:NoxiousSerpent",
                "melvorF:LegaranWurm",
            ]
            const randomList = [
                "melvorF:RandomITM",
                "melvorF:Bane",
                "melvorF:BaneInstrumentOfFear",
                "melvorTotH:RandomSpiderLair",
                "melvorTotH:SpiderQueen"
            ]

            if (ToB) {
                // RoguesList.push("ToBDungeon:Pestilent_Bloat",
                //     "ToBDungeon:Nylocas_vasilias_ranged",
                //     "ToBDungeon:Xarpus",
                //     "ToBDungeon:Xarpus_p2")
                // MagesList.push("ToBDungeon:Maiden",
                //     "ToBDungeon:Nylocas_vasilias_magic",
                //     "ToBDungeon:Verzik_vitur")
                // FightersList.push("ToBDungeon:Nylocas_vasilias_melee",
                //     "ToBDungeon:Sotetseg",
                //     "ToBDungeon:Verzik_vitur_p2",
                //     "ToBDungeon:Verzik_vitur_final")
                DemonList.push("ToBDungeon:Pestilent_Bloat", "ToBDungeon:Maiden", "ToBDungeon:Nylocas_vasilias_ranged", "ToBDungeon:Nylocas_vasilias_melee", "ToBDungeon:Nylocas_vasilias_magic", "ToBDungeon:Sotetseg", "ToBDungeon:Xarpus",
                    "ToBDungeon:Xarpus_p2", "ToBDungeon:Verzik_vitur_p2",
                    "ToBDungeon:Verzik_vitur_final")
            }
            if (AR) {
                // RoguesList.push("abyrift:Tick")
                // MagesList.push("abyrift:Screamer")
                // FightersList.push("abyrift:Lasher",
                //     "abyrift:Crab_Wyrm",
                //     "abyrift:Gore_Bear")
                DemonList.push("abyrift:Tick", "abyrift:Screamer", "abyrift:Lasher",
                    "abyrift:Crab_Wyrm",
                    "abyrift:Gore_Bear")
            }
            // if (gen1) {
            //     RoguesList.push("pokeworldAdditions:pwa_ProfOakLab_TrainerThree",
            //         "pokeworldAdditions:pwa_kanto_elitefour_d_one",
            //         "pokeworldAdditions:pwa_pallet_bulbasuar",
            //         "pokeworldAdditions:pwa_mtmoon_zubat",
            //         "pokeworldAdditions:pwa_pewter_brock_geodude",
            //         "pokeworldAdditions:pwa_viridian_giovanni_persian",
            //         "pokeworldAdditions:pwa_cerulean_misty_starmie",
            //         "pokeworldAdditions:pwa_vermilion_ltsurge_magnemite",
            //         "pokeworldAdditions:pwa_celadon_erika_vileplume",
            //         "pokeworldAdditions:pwa_fuchsia_koga_weezing",
            //         "pokeworldAdditions:pwa_fuchsia_koga_venomoth",
            //         "pokeworldAdditions:pwa_saffron_sabrina_mrmime",
            //         "pokeworldAdditions:pwa_cinnabar_blaine_arcanine",
            //         "pokeworldAdditions:pwa_pinkin4",
            //         "pokeworldAdditions:pwa_pinkin8")
            //     MagesList.push(
            //         "pokeworldAdditions:pwa_Kanto_TrainerFive",
            //         "pokeworldAdditions:pwa_ProfOakLab_TrainerTwo",
            //         "pokeworldAdditions:pwa_cerCave_ArmoredMewtwo",
            //         "pokeworldAdditions:pwa_kanto_elitefour_a_one",
            //         "pokeworldAdditions:pwa_kanto_elitefour_a_two",
            //         "pokeworldAdditions:pwa_kanto_elitefour_a_three",
            //         "pokeworldAdditions:pwa_kanto_elitefour_a_four",
            //         "pokeworldAdditions:pwa_kanto_elitefour_a_five",
            //         "pokeworldAdditions:pwa_kanto_elitefour_b_two",
            //         "pokeworldAdditions:pwa_kanto_elitefour_b_three",
            //         "pokeworldAdditions:pwa_kanto_elitefour_b_four",
            //         "pokeworldAdditions:pwa_kanto_elitefour_c_two",
            //         "pokeworldAdditions:pwa_kanto_elitefour_c_four",
            //         "pokeworldAdditions:pwa_kanto_elitefour_d_three",
            //         "pokeworldAdditions:pwa_pallet_charmander",
            //         "pokeworldAdditions:pwa_mtmoon_sandshrew",
            //         "pokeworldAdditions:pwa_pewter_brock",
            //         "pokeworldAdditions:pwa_viridian_giovanni_rhyhorn",
            //         "pokeworldAdditions:pwa_cerulean_misty_psyduck",
            //         "pokeworldAdditions:pwa_vermilion_ltsurge_raichu",
            //         "pokeworldAdditions:pwa_celadon_erika_tangela",
            //         "pokeworldAdditions:pwa_saffron_sabrina_alakazam",
            //         "pokeworldAdditions:pwa_cinnabar_blaine_magmar",
            //         "pokeworldAdditions:pwa_pinkin7"
            //     )
            //     FightersList.push("pokeworldAdditions:pwa_Kanto_TrainerOne",
            //         "pokeworldAdditions:pwa_Kanto_TrainerTwo",
            //         "pokeworldAdditions:pwa_Kanto_TrainerThree",
            //         "pokeworldAdditions:pwa_Kanto_TrainerFour",
            //         "pokeworldAdditions:pwa_ProfOakLab_TrainerOne",
            //         "pokeworldAdditions:pwa_cerCave_chansey",
            //         "pokeworldAdditions:pwa_cerCave_rhydon",
            //         "pokeworldAdditions:pwa_cerCave_slowbro",
            //         "pokeworldAdditions:pwa_cerCave_wigglytuff",
            //         "pokeworldAdditions:pwa_cerCave_golbat",
            //         "pokeworldAdditions:pwa_digCave_diglettA",
            //         "pokeworldAdditions:pwa_digCave_diglettB",
            //         "pokeworldAdditions:pwa_digCave_diglettC",
            //         "pokeworldAdditions:pwa_digCave_dugtrio",
            //         "pokeworldAdditions:pwa_teamRocketsHideout_f",
            //         "pokeworldAdditions:pwa_teamRocketsHideout_m",
            //         "pokeworldAdditions:pwa_teamRocketsHideout_giovanni",
            //         "pokeworldAdditions:pwa_vicRoad_machoke",
            //         "pokeworldAdditions:pwa_vicRoad_graveler",
            //         "pokeworldAdditions:pwa_vicRoad_golbat",
            //         "pokeworldAdditions:pwa_vicRoad_moltres",
            //         "pokeworldAdditions:pwa_kanto_elitefour_b_one",
            //         "pokeworldAdditions:pwa_kanto_elitefour_c_one",
            //         "pokeworldAdditions:pwa_kanto_elitefour_c_three",
            //         "pokeworldAdditions:pwa_kanto_elitefour_d_two",
            //         "pokeworldAdditions:pwa_kanto_elitefour_d_four",
            //         "pokeworldAdditions:pwa_kanto_elitefour_d_five",
            //         "pokeworldAdditions:pwa_pallet_squirtle",
            //         "pokeworldAdditions:pwa_pallet_pikachu",
            //         "pokeworldAdditions:pwa_pallet_eevee",
            //         "pokeworldAdditions:pwa_mtmoon_geodude",
            //         "pokeworldAdditions:pwa_mtmoon_paras",
            //         "pokeworldAdditions:pwa_mtmoon_clefairy",
            //         "pokeworldAdditions:pwa_pewter_brock_onix",
            //         "pokeworldAdditions:pwa_viridian_giovanni",
            //         "pokeworldAdditions:pwa_cerulean_misty",
            //         "pokeworldAdditions:pwa_vermilion_ltsurge",
            //         "pokeworldAdditions:pwa_vermilion_ltsurge_voltorb",
            //         "pokeworldAdditions:pwa_celadon_erika",
            //         "pokeworldAdditions:pwa_celadon_erika_weepinbell",
            //         "pokeworldAdditions:pwa_fuchsia_koga",
            //         "pokeworldAdditions:pwa_fuchsia_koga_golbat",
            //         "pokeworldAdditions:pwa_saffron_sabrina",
            //         "pokeworldAdditions:pwa_saffron_sabrina_jynx",
            //         "pokeworldAdditions:pwa_cinnabar_blaine",
            //         "pokeworldAdditions:pwa_cinnabar_blaine_rapidash",
            //         "pokeworldAdditions:pwa_pinkin1",
            //         "pokeworldAdditions:pwa_pinkin2",
            //         "pokeworldAdditions:pwa_pinkin3",
            //         "pokeworldAdditions:pwa_pinkin5",
            //         "pokeworldAdditions:pwa_pinkin6",
            //         "pokeworldAdditions:pwa_pinkin9")
            // }
            if (music) {
                HumansList.push("mythMusic:Enchanted_Jester",
                    "mythMusic:Mystic_Jester", "mythMusic:Jester")
            }
            if (cloudManager.hasTotHEntitlementAndIsEnabled) {
                // RoguesList.push(
                //     "melvorTotH:HungryPlant",
                //     "melvorTotH:Alraune",
                //     "melvorTotH:Morellia",
                //     "melvorTotH:LightningGolem",
                //     "melvorTotH:TwinSeaDragonSerpent",
                //     "melvorTotH:TrapperSpider",
                //     "melvorTotH:EnforcerSpider",
                //     "melvorTotH:Cockatrice",
                //     "melvorTotH:Phantom",
                //     "melvorTotH:Arctair",
                //     "melvorTotH:VorloranWatcher",
                //     "melvorTotH:TheHeraldPhase2"
                // )
                // MagesList.push(
                //     "melvorTotH:PoisonToad",
                //     "melvorTotH:MagicFireDemon",
                //     "melvorTotH:FrostGolem",
                //     "melvorTotH:SpectralIceWolf",
                //     "melvorTotH:IceHydra",
                //     "melvorTotH:LightningSpirit",
                //     "melvorTotH:RaZu",
                //     "melvorTotH:Siren",
                //     "melvorTotH:WickedSpider",
                //     "melvorTotH:GuardianSpider",
                //     "melvorTotH:PlagueDoctor",
                //     "melvorTotH:TreeSpirit",
                //     "melvorTotH:CursedSpirit",
                //     "melvorTotH:LadyDarkheart",
                //     "melvorTotH:Banshee",
                //     "melvorTotH:Beholder",
                //     "melvorTotH:Fiozor",
                //     "melvorTotH:Harkair",
                //     "melvorTotH:VorloranDevastator",
                //     "melvorTotH:TheHeraldPhase3"
                // )
                // FightersList.push(
                //     "melvorTotH:Kongamato",
                //     "melvorTotH:Conda",
                //     "melvorTotH:BurningSnake",
                //     "melvorTotH:InfernalGolem",
                //     "melvorTotH:Manticore",
                //     "melvorTotH:GretYun",
                //     "melvorTotH:Trogark",
                //     "melvorTotH:LargeIceTroll",
                //     "melvorTotH:PolarBear",
                //     "melvorTotH:LightningMonkey",
                //     "melvorTotH:MonsterCroc",
                //     "melvorTotH:Leviathan",
                //     "melvorTotH:ScouterSpider",
                //     "melvorTotH:BasherSpider",
                //     "melvorTotH:ShadowBeast",
                //     "melvorTotH:GoliathWerewolf",
                //     "melvorTotH:TreeGiant",
                //     "melvorTotH:Spectre",
                //     "melvorTotH:CursedSkeletonWarrior",
                //     "melvorTotH:DarkKnight",
                //     "melvorTotH:Torvair",
                //     "melvorTotH:VorloranProtector",
                //     "melvorTotH:GuardianoftheHerald",
                //     "melvorTotH:TheHeraldPhase1"
                // )
                BeastList.push(
                    "melvorTotH:GoliathWerewolf"
                )
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
            if (cloudManager.hasAoDEntitlementAndIsEnabled) {
                // RoguesList.push("melvorAoD:BlindArcher",
                //     "melvorAoD:VampiricBat",
                //     "melvorAoD:SlimeShooter",
                //     "melvorAoD:RangedGolem",
                //     "melvorAoD:CultImp",
                //     "melvorAoD:PoisonLeecher",
                //     "melvorAoD:PoisonRoamer",
                //     "melvorAoD:PoisonSlime",
                //     "melvorAoD:PoisonBloater",
                //     "melvorAoD:GhostMercenary",
                //     "melvorAoD:MermaidArcher",
                //     "melvorAoD:Nagaia",
                //     "melvorAoD:EvilOak",
                //     "melvorAoD:FuriousMahogany",
                //     "melvorAoD:CrystalBarrager",
                //     "melvorAoD:CrystalShatterer",)
                // MagesList.push("melvorAoD:BlindMage",
                //     "melvorAoD:BlindGhost",
                //     "melvorAoD:MagicGolem",
                //     "melvorAoD:CultMember",
                //     "melvorAoD:Lich",
                //     "melvorAoD:SoulTakerWitch",
                //     "melvorAoD:MagicMirror",
                //     "melvorAoD:PossessedBarrel",
                //     "melvorAoD:FakeDoor",
                //     "melvorAoD:IllusiveRoots",
                //     "melvorAoD:PuppetMaster",
                //     "melvorAoD:ShipwreckBeast",
                //     "melvorAoD:Merman",
                //     "melvorAoD:TreacherousJellyfish",
                //     "melvorAoD:AngryTeak",
                //     "melvorAoD:CrystalProwler",
                //     "melvorAoD:CrystalManipulator",)
                // FightersList.push("melvorAoD:BlindWarrior",
                //     "melvorAoD:GreenSlime",
                //     "melvorAoD:GraniteGolem",
                //     "melvorAoD:EarthGolem",
                //     "melvorAoD:LavaGolem",
                //     "melvorAoD:CultMonster",
                //     "melvorAoD:GhostSailor",
                //     "melvorAoD:CursedPirateCaptain",
                //     "melvorAoD:MermanGuard",
                //     "melvorAoD:GrumpyWillow",
                //     "melvorAoD:RagingMaple",
                //     "melvorAoD:CrystalSmasher",
                //     "melvorAoD:CrystalBehemoth")
                PlantList.push("melvorAoD:EvilOak", "melvorAoD:GrumpyWillow", "melvorAoD:AngryTeak", "melvorAoD:RagingMaple", "melvorAoD:IllusiveRoots")
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
            // if (necromancy) {
            //     UndeadList.push([
            //         "necromancy:Baby_Necromancer",
            //         "necromancy:Teen_Necromancer",
            //         "necromancy:Adult_Necromancer",
            //         "necromancy:Ancient_Necromancer",
            //         "necromancy:Skeletal_Deckhand",
            //         "necromancy:Old_One_Cultist",
            //         "necromancy:Old_One_Captain",
            //         "necromancy:Great_Old_One",
            //         "necromancy:Poison_Necromancer",
            //         "necromancy:Toxic_Ooze",
            //         "necromancy:Oozing_Necromancer",
            //         "necromancy:Putrid_Necromancer",
            //         "necromancy:Hellhound",
            //         "necromancy:Hellrider",
            //         "necromancy:Hulking_Beast",
            //         "necromancy:Blood_Necromancer",
            //         "necromancy:Yakar_The_Carver",
            //         "necromancy:Raulazar_The_Defiler",
            //         "necromancy:Elite_Hellhound",
            //         "necromancy:Skeletal_Rider",
            //         "necromancy:Lumbering_Beast",
            //         "necromancy:Oracle_Trio",
            //         "necromancy:Hooded_Figure",
            //         "necromancy:Hermod_The_Spirit_Of_War",
            //         "necromancy:Skeletal_Gatekeeper",
            //         "necromancy:Unleashed_Necromancer",
            //         "necromancy:Druidic_Necromancer",
            //         "necromancy:Rasials_Disciple",
            //         "necromancy:Hooded_Figure_Revisited",
            //         "necromancy:Rasial_The_First_Necromancer",
            //         "necromancy:Rasials_True_Form",
            //     ])
            // }
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
            cmim.addMonsters("Elf", elfList)

            cmim.registerOrUpdateType("Naga", "Nagas", "https://cdn.melvor.net/core/v018/assets/media/monsters/Stone_Snake.png", NagaList, true);

            cmim.registerOrUpdateType("Goblin", "Goblins", "https://cdn.melvor.net/core/v018/assets/media/monsters/goblin.png", GoblinList, true);
            cmim.registerOrUpdateType("Plant", "Plants", "https://cdn.melvor.net/core/v018/assets/media/monsters/plant.png", PlantList, true);
            cmim.registerOrUpdateType("Orc", "Orcs", "https://cdn.melvor.net/core/v018/assets/media/monsters/goblin.png", OrcList, true);
            cmim.registerOrUpdateType("Giant", "Giants", "https://cdn2-main.melvor.net/assets/media/monsters/hill_giant.png", GiantList, true);
            cmim.registerOrUpdateType("Beast", "Beasts", "https://cdn2-main.melvor.net/assets/media/monsters/m13.png", BeastList, true);
            cmim.registerOrUpdateType("Aarakocra", "Aarakocras", "https://cdn2-main.melvor.net/assets/media/monsters/torvair.png", AarakocraList, true);
            cmim.registerOrUpdateType("Angel", "Angels", "https://cdn2-main.melvor.net/assets/media/monsters/angel.png", AngelList, true);

            // cmim.registerOrUpdateType("Ooze", "Oozes", "https://cdn.melvor.net/core/v018/assets/media/monsters/plant.png", OozesList, true);
            // cmim.registerOrUpdateType("Aberration", "Aberrations", "https://cdn.melvor.net/core/v018/assets/media/monsters/plant.png", AberrationsList, true);
            // cmim.registerOrUpdateType("Construct", "Constructs", "https://cdn.melvor.net/core/v018/assets/media/monsters/plant.png", ConstructsList, true);
            // cmim.registerOrUpdateType("Fey", "Feys", "https://cdn.melvor.net/core/v018/assets/media/monsters/plant.png", FeyList, true);
            // cmim.registerOrUpdateType("Fiend", "Fiends", "https://cdn.melvor.net/core/v018/assets/media/monsters/plant.png", FiendList, true);
            // cmim.registerOrUpdateType("Monstrosity", "Monstrosities", "https://cdn.melvor.net/core/v018/assets/media/monsters/plant.png", MonstrositiesList, true);
            // @ts-ignore
            cmim.forceBaseModTypeActive("Elf");
            // @ts-ignore
            cmim.forceBaseModTypeActive("Dragon");
            // @ts-ignore
            cmim.forceBaseModTypeActive("Undead");
            // @ts-ignore
            cmim.forceBaseModTypeActive("Human");
            // @ts-ignore
            cmim.forceBaseModTypeActive("Animal");
            // @ts-ignore
            cmim.forceBaseModTypeActive("Demon");
            // @ts-ignore
            cmim.forceBaseModTypeActive("Elemental");
            // @ts-ignore
            cmim.forceBaseModTypeActive("MythicalCreature");
            // @ts-ignore
            cmim.forceBaseModTypeActive("SeaCreature");
            // @ts-ignore
            cmim.registerOrUpdateType("Fighter", "Fighters", "https://cdn2-main.melvor.net/assets/media/monsters/steel_knight.png", FightersList, true);
            cmim.registerOrUpdateType("Mage", "Mages", "https://cdn2-main.melvor.net/assets/media/monsters/wizard.png", MagesList, true);
            cmim.registerOrUpdateType("Rogue", "Rogues", "https://cdn2-main.melvor.net/assets/media/monsters/vorloran_watcher.png", RoguesList, true);

            await this.context.gameData.addPackage('data.json');

            // await this.context.gameData.addPackage('data-cmim.json');
            if (cloudManager.hasTotHEntitlementAndIsEnabled) {
                await this.context.gameData.addPackage('data-toth.json');
            }
            if (cloudManager.hasAoDEntitlementAndIsEnabled) {
                await this.context.gameData.addPackage('data-aod.json');
                if (!game.skills.getObjectByID('namespace_profile:Profile')._unlocked) {
                    game.skills.getObjectByID('namespace_profile:Profile').setUnlock(true)
                }
            }
            if (Pokemon) {
                await this.context.gameData.addPackage('pokemon.json');
            }
            if (tes) {
                await this.context.gameData.addPackage('tes.json');
            }
            if(necromancy) {
                await this.context.gameData.addPackage('necromancy.json');
            }
            await this.initGamemodes();
            this.patchUnlock(this.game.profile);
            this.initCompatibility(this.game.profile);
            // Giving monsters classes
            game.monsters.forEach(monster => {
                if (monster.attackType === "magic" && !MagesList.includes(monster._namespace.name + ':' + monster._localID)) {
                    MagesList.push(monster._namespace.name + ':' + monster._localID)
                }
                if (monster.attackType === "melee" && !FightersList.includes(monster._namespace.name + ':' + monster._localID)) {
                    FightersList.push(monster._namespace.name + ':' + monster._localID)
                }
                if (monster.attackType === "ranged" && !RoguesList.includes(monster._namespace.name + ':' + monster._localID)) {
                    RoguesList.push(monster._namespace.name + ':' + monster._localID)
                }
                if (monster.attackType === "random" && !randomList.includes(monster._namespace.name + ':' + monster._localID)) {
                    randomList.push(monster._namespace.name + ':' + monster._localID)
                }
            })

            cmim.registerOrUpdateType("Fighter", "Fighters", "https://cdn2-main.melvor.net/assets/media/monsters/steel_knight.png", FightersList, true);
            cmim.registerOrUpdateType("Mage", "Mages", "https://cdn2-main.melvor.net/assets/media/monsters/wizard.png", MagesList, true);
            cmim.registerOrUpdateType("Rogue", "Rogues", "https://cdn2-main.melvor.net/assets/media/monsters/vorloran_watcher.png", RoguesList, true);
            // adding monsters modifiers to effect species
            const cmimSeaCreatureList: String[] = await cmim.getMonstersOfType('SeaCreature');
            const cmimMythicalCreatureList: String[] = await cmim.getMonstersOfType('MythicalCreature');
            const cmimElementalList: String[] = await cmim.getMonstersOfType('Elemental');
            const cmimDemonList: String[] = await cmim.getMonstersOfType('Demon');
            const cmimAnimalList: String[] = await cmim.getMonstersOfType('Animal');
            const cmimHumanList: String[] = await cmim.getMonstersOfType('Human');
            const cmimUndeadList: String[] = await cmim.getMonstersOfType('Undead');
            const cmimAngelList: String[] = await cmim.getMonstersOfType('Angel');
            const cmimAarakocraList: String[] = await cmim.getMonstersOfType('Aarakocra');
            const cmimBeastList: String[] = await cmim.getMonstersOfType('Beast');
            const cmimGiantList: String[] = await cmim.getMonstersOfType('Giant');
            const cmimOrcList: String[] = await cmim.getMonstersOfType('Orc');
            const cmimPlantList: String[] = await cmim.getMonstersOfType('Plant');
            const cmimGoblinList: String[] = await cmim.getMonstersOfType('Goblin');
            const cmimElfList: String[] = await cmim.getMonstersOfType('Elf');
            const cmimDragonList: String[] = await cmim.getMonstersOfType('Dragon');
            const cmimFighterList: String[] = await cmim.getMonstersOfType('Fighter');
            const cmimMageList: String[] = await cmim.getMonstersOfType('Mage');
            const cmimRogueList: String[] = await cmim.getMonstersOfType('Rogue');
            const initialPackage = this.context.gameData.buildPackage((itemPackage: any) => {
                cmimRogueList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Rogue_traits"]
                        }
                    })
                })
                cmimMageList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Mage_traits"]
                        }
                    })
                })
                cmimFighterList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Fighter_traits"]
                        }
                    })
                })
                cmimDragonList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Dragon_traits"]
                        }
                    })
                })
                cmimElfList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Elf_traits"]
                        }
                    })
                })
                cmimGoblinList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Goblin_traits"]
                        }
                    })
                })
                cmimPlantList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Plant_traits"]
                        }
                    })
                })
                cmimOrcList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Orc_traits"]
                        }
                    })
                })
                cmimGiantList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Giant_traits"]
                        }
                    })
                })
                cmimBeastList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Beast_traits"]
                        }
                    })
                })
                cmimAarakocraList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Aarakocra_traits"]
                        }
                    })
                })
                cmimAngelList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Angel_traits"]
                        }
                    })
                })
                cmimUndeadList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Undead_traits"]
                        }
                    })
                })
                cmimHumanList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Human_traits"]
                        }
                    })
                })
                cmimAnimalList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Animal_traits"]
                        }
                    })
                })
                cmimElementalList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Elemental_traits"]
                        }
                    })
                })
                cmimDemonList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:Demon_traits"]
                        }
                    })
                })
                cmimMythicalCreatureList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:MythicalCreature_traits"]
                        }
                    })
                })
                cmimSeaCreatureList.forEach(monsterId => {
                    itemPackage.monsters.modify({
                        "id": monsterId,
                        "passives": {
                            "add": ["namespace_profile:SeaCreature_traits"]
                        }
                    })
                }
                )
            })
            this.game.profileLog = initialPackage
            initialPackage.add();
        })

        // try {
        //     this.context.gameData.buildPackage((itemPackage: any) => {
        //         const newClasses: any[] = []
        //         function getModifier(negative: boolean, perc = 0.5) {
        //             const newModifier = {
        //                     "increasedMasteryXP": [
        //                         {
        //                             "value": Math.floor(Math.random() * 200) + 1,
        //                             "skillID": "melvorD:Firemaking"
        //                             // game.modifierRegistry.registeredObjects
        //                         }
        //                     ]
        //                 }
        //            return newModifier
        //         }
        //         const randomClass = {
        //             "id": 'Gambler',
        //             "name": 'Gambler',
        //             "media": 'https://static.vecteezy.com/system/resources/previews/015/081/534/original/white-rolling-dice-3d-rendering-isometric-icon-png.png',
        //             "baseExperience": 155,
        //             "maxGP": 551,
        //             "productId": "namespace_profile:Gambler",
        //             "level": 99,
        //             "skills": ["namespace_profile:Profile"],
        //             "standardModifiers": [
        //                 {
        //                     "level": 0,
        //                     "modifiers": "traitAppliedFighter"
        //                 },
        //                 {
        //                     "level": 1,
        //                     "modifiers": getModifier(true, 10)
        //                 },
        //                 {
        //                     "level": 20,
        //                     "modifiers": getModifier(false)
        //                 },
        //                 {
        //                     "level": 40,
        //                     "modifiers": getModifier(false)
        //                 },
        //                 {
        //                     "level": 60,
        //                     "modifiers": getModifier(false)
        //                 },
        //                 {
        //                     "level": 80,
        //                     "modifiers": getModifier(false)
        //                 },
        //                 {
        //                     "level": 99,
        //                     "modifiers": getModifier(false)
        //                 }
        //             ]
        //         }
        //         newClasses.push(randomClass)
        //         const newsilldata = {
        //             "skillID": "namespace_profile:Profile",
        //             "data": {
        //                 "classes": newClasses
        //             }
        //         }
        //         itemPackage.skillData.add(newsilldata)
        //     }).add();
        // } catch (error) {
        //     console.log(error)
        // }

        this.context.onCharacterLoaded(() => {
            this.game.profile.updateModifiers(true)
            // game.profile.actions.registeredObjects.forEach(single => {
            //     single.standardModifiers.forEach(modifier => {
            //         modifier?.modifiers?.forEach(mod => {
            //             if (mod.value < 0) {
            //                 // @ts-ignore 
            //                 mod.value = mod.value - game.modifiers.getValue('namespace_profile:UpgradeProfileModifiers', {})
            //             } else {
            //                 // @ts-ignore 
            //                 mod.value = mod.value + game.modifiers.getValue('namespace_profile:UpgradeProfileModifiers', {})
            //             }
            //         })
            //     })
            // });
            // game.profile.computeProvidedStats(true)
        })


        // this.context.onCharacterLoaded(() => {
        //     const guides = document.getElementById('tutorial-page-Woodcutting').parentElement
        //     ui.createStatic('#tutorial-page-Profile', guides);
        //     document.body.querySelector('.modal.tutorial-page-profile-contents').id = 'tutorial-page-profile-contents';
        // })
        // getMediaURL()
        // manifest - "load": ["profile/guide.html"]


        // function viewGameGuide() {
        //     const page = game.openPage;
        //     if (page === undefined || !page.hasGameGuide)
        //         return;
        //     game.pages.forEach((page)=>{
        //         if (page.hasGameGuide) {
        //             $(`#tutorial-page-${page.localID}`).addClass('d-none');
        //             $(`#tutorial-page-${page.localID}-1`).addClass('d-none');
        //         }
        //     }
        //     );
        //     if (setLang === 'en')
        //         $(`#tutorial-page-${page.localID}`).removeClass('d-none');
        //     else
        //         $(`#tutorial-page-${page.localID}-1`).removeClass('d-none');
        //     $('#modal-game-guide').modal('show');
        // }

        this.game.profile.userInterface = this.initInterface(this.game.profile);
        this.game.profile.initSettings(settings);
    }

    private patchEventManager() {
        function addMasteryXP() {
            function SkillsMatch(ClassArray: string[], ActiveSkills: AnySkill[]) {
                const classesArray: AnySkill[] = []
                ClassArray.forEach(skill => classesArray.push(game.skills.getObjectByID(skill)))
                if (classesArray.some(item => ActiveSkills.includes(item))) {
                    return true
                }
            }
            if (rollPercentage(0.1)) {
                game.bank.addItem(game.items.getObjectByID(`namespace_profile:Mastery_Token_Profile`), 1, true, true, false, true);
            } else if (rollPercentage(0.01)) {
                game.bank.addItem(game.items.getObjectByID(`namespace_profile:Profile_Token`), 1, true, true, false, true);
            }
            const chosen_species = game.profile.yous.get(1) // human
            const chosen_class = game.profile.yous.get(2) // knight
            const profileLevel = game.profile._level
            let exp1 = 0
            if (chosen_species) {
                exp1 = Math.floor(chosen_species.single_species.baseExperience) || 0
            }

            let exp2 = 0
            if (chosen_class) {
                exp2 = Math.floor(chosen_class.single_species.baseExperience) || 0
            }

            let skillExp1 = exp1 || 0
            let masteryExp1 = exp1 || 0

            let skillExp2 = exp2 || 0
            let masteryExp2 = exp2 || 0

            // @ts-ignore
            const globalMasteryEXPmod = game.modifiers.getValue("masteryXP", {})

            const totalMasteryExp1 = masteryExp1 + (((skillExp1) / 100) * globalMasteryEXPmod) + profileLevel || 0
            const totalMasteryExp2 = masteryExp2 + (((skillExp2) / 100) * globalMasteryEXPmod) + profileLevel || 0

            // Add xp while in combat
            // if ((chosen_species || chosen_class) && game?.combat?.isActive) {
            //     const combatLevel = game?.combat?.enemy?.monster?.combatLevel || 1
            //     //@ts-ignore both
            //     const globalEXPmod = game.modifiers.getValue("skillXP", {})
            //     // Calculate the base XP
            //     const baseExp = skillExp1 + skillExp2 + (((skillExp1 + skillExp2) / 100) * globalEXPmod) || 0;

            //     // Scale the XP based on combat level
            //     const scaledExp = baseExp * (combatLevel / 100);

            //     // Ensure the XP is not less than a minimum value
            //     const totalExp = Math.max(scaledExp, 1);
            //     game.profile.addXP(totalExp, game.profile)
            //     game.profile.addMasteryPoolXP(game.defaultRealm, totalMasteryExp1 + totalMasteryExp2)
            // }

            // Burying bones
            if (SkillsMatch(chosen_species.single_species.skills, [game.skills.getObjectByID('melvorD:Prayer')])) {
                game.profile.addXP(skillExp1, game.profile)
                game.profile.addMasteryXP(chosen_species.single_species, totalMasteryExp1)
                game.profile.addMasteryPoolXP(game.defaultRealm, totalMasteryExp1)
            }
            // Generic 
            if (SkillsMatch(chosen_species.single_species.skills, [game.skills.getObjectByID("namespace_profile:Profile")])) {
                game.profile.addXP(skillExp1, game.profile)
                game.profile.addMasteryXP(chosen_species.single_species, totalMasteryExp1)
                game.profile.addMasteryPoolXP(game.defaultRealm, totalMasteryExp1)
            }
            // Add xp
            if ((chosen_species || chosen_class) && game?.activeAction?.activeSkills) {
                if (chosen_species && SkillsMatch(chosen_species.single_species.skills, game.activeAction.activeSkills)) {
                    game.profile.addMasteryXP(chosen_species.single_species, totalMasteryExp1)
                    game.profile.addMasteryPoolXP(game.defaultRealm, totalMasteryExp1)

                    //@ts-ignore species
                    const globalEXPmod = game.modifiers.getValue("skillXP", {})
                    const totalExp = skillExp1 + (((skillExp1) / 100) * globalEXPmod) || 0
                    game.profile.addXP(totalExp, game.profile)
                }
                if (chosen_class && SkillsMatch(chosen_class.single_species.skills, game.activeAction.activeSkills)) {
                    game.profile.addMasteryXP(chosen_class.single_species, totalMasteryExp2)
                    game.profile.addMasteryPoolXP(game.defaultRealm, totalMasteryExp2)

                    //@ts-ignore class
                    const globalEXPmod = game.modifiers.getValue("skillXP", {})
                    const totalExp = skillExp2 + (((skillExp2) / 100) * globalEXPmod) || 0
                    game.profile.addXP(totalExp, game.profile)
                }
            }
        }
        this.context.patch(CombatManager, "onEnemyDeath").after(() => {
            try {
                addMasteryXP()
            } catch (error) {
                console.log('addXP', error)
            }
        });
        this.context.patch(Player, 'addPrayerPoints').after(function (unknown, amount) {
            try {
                addMasteryXP()
            } catch (error) {
                console.log(error)
            }
        })
        // @ts-ignore
        this.context.patch(SkillWithMastery, 'rollForMasteryTokens').after(function (rewards: Rewards, realm: Realm) {
            try {
                addMasteryXP()
            } catch (error) {
                console.log(error)
            }
        })
        // @ts-ignore
        this.context.patch(Character, 'getMeleeDefenceBonus').after(function (meleeDefenceBonus) {
            // @ts-ignore
            return meleeDefenceBonus + (game.combat.player.levels.Defence * game.modifiers.getValue('namespace_profile:FlatMeleeDefenceBonusPerDefence', {}))
        })
        // @ts-ignore
        this.context.patch(Character, 'getRangedDefenceBonus').after(function (rangedDefenceBonus) { // @ts-ignore
            return rangedDefenceBonus + (game.combat.player.levels.Defence * game.modifiers.getValue('namespace_profile:FlatRangedDefenceBonusPerDefence', {}))
        })
        this.context.patch(Player, 'equipItem').after((_patch, data) => {
            this.game.profile.updateModifiers()
        });
        this.context.patch(Player, 'unequipItem').after((_patch, data) => {
            this.game.profile.updateModifiers()
        });
        this.context.patch(GameEventSystem, 'constructMatcher').after((_patch, data) => {
            if (this.isProfileEvent(data)) {
                return new ProfileActionEventMatcher(data, this.game) as any;
            }
        });
    }

    // private patchGamemodes(profile: Profile) {
    //     this.game.gamemodes.forEach(gamemode => {
    //         if (gamemode.allowDungeonLevelCapIncrease) {
    //             if (!gamemode.startingSkills) {
    //                 gamemode.startingSkills = new Set();
    //             }

    //             if (!gamemode.autoLevelSkillsPre99) {
    //                 gamemode.autoLevelSkillsPre99 = [];
    //             }

    //             if (!gamemode.autoLevelSkillsPost99) {
    //                 gamemode.autoLevelSkillsPost99 = [];
    //             }

    //             gamemode.startingSkills.add(profile);
    //             gamemode.autoLevelSkillsPre99.push({ skill: profile, value: 5 });
    //             gamemode.autoLevelSkillsPost99.push({ skill: profile, value: 3 });
    //         }
    //     });
    // }

    private patchUnlock(profile: Profile) {
        this.context.patch(EventManager, 'loadEvents').after(() => {
            if (this.game.currentGamemode.startingSkills?.has(profile)) {
                profile.setUnlock(true);
            }
        });
    }

    private async initGamemodes() {
        if (cloudManager.hasAoDEntitlementAndIsEnabled) {
            const levelCapIncreases = ['namespace_profile:Pre99Dungeons', 'namespace_profile:ImpendingDarknessSet100'];

            if (cloudManager.hasTotHEntitlementAndIsEnabled) {
                levelCapIncreases.push(...['namespace_profile:Post99Dungeons', 'namespace_profile:ThroneOfTheHeraldSet120']);
            }

            const gamemodes = this.game.gamemodes.filter(gamemode => gamemode.allowAncientRelicDrops);

            await this.context.gameData.addPackage({
                $schema: '',
                namespace: 'namespace_profile:Profile',
                modifications: {
                    // @ts-ignore 
                    gamemodes: gamemodes.map(gamemode => ({
                        id: gamemode.id,
                        levelCapIncreases: {
                            add: levelCapIncreases
                        },
                        startingSkills: {
                            add: ['namespace_profile:Profile']
                        },
                        skillUnlockRequirements: [
                            {
                                skillID: 'namespace_profile:Profile',
                                requirements: [
                                    {
                                        type: 'SkillLevel',
                                        skillID: 'melvorD:Attack',
                                        level: 1
                                    }
                                ]
                            }
                        ]
                    }))
                }
            });
        }
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
            'SPECIAL_ATTACK_DESCRIPTION',
            'mod_',
            'PASSIVES_NAME_',
            'MODIFIER_DATA_'
        ];

        for (const [key, value] of Object.entries<string>(languages[lang])) {
            if (keysToNotPrefix.some(prefix => key.includes(prefix))) {
                loadedLangJson[key] = value;
            } else {
                loadedLangJson[`Profile_${key}`] = value;
            }
        }
    }
}

// class CombatEffectApplicator {


//     get descriptionTemplate() {
//         if (this._descriptionLang !== undefined) {
//             return getLangString(this._descriptionLang);
//         } else if (this._customDescription !== undefined) {
//             return this._customDescription;
//         }
//         return getLangString(`EFFECT_APPLICATOR_${this.appliesWhen}`);
//     }
// }


// increasedChanceToReduceAttackDamageToZero: Standard,

// decreasedChanceToReduceAttackDamageToZero: Standard,
// increasedDamageFlatWhileTargetHasMaxHP: Standard,
// decreasedDamageFlatWhileTargetHasMaxHP: Standard,
// increasedDamagePercentWhileTargetHasMaxHP: Standard,
// decreasedDamagePercentWhileTargetHasMaxHP: Standard,
// increasedDamageFlatIgnoringDamageReduction: Standard,
// decreasedDamageFlatIgnoringDamageReduction: Standard,
// increasedGlobalDamagePreventionThreshold: Standard,
// decreasedGlobalDamagePreventionThreshold: Standard,
// increasedDamagePreventionThreshold: Standard,
// decreasedDamagePreventionThreshold: Standard,