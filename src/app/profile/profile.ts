import { ProfileActionEvent } from './event';
import { UserInterface } from './user-interface';
import { MasteryComponent } from './mastery/mastery';
import { ProfileManager } from './manager';
import { MasteredYou, Single_Species, ProfileSkillData } from './profile.types';
import { Decoder } from './decoder/decoder';
import { MasteredYous } from './mastered-yous';
import { ChangeType, ProfileSettings } from './settings';

import './profile.scss';

export class Profile extends SkillWithMastery<Single_Species, ProfileSkillData> {
    public readonly version = 5;
    public readonly _media = 'https://cdn2-main.melvor.net/assets/media/skills/thieving/man.svg';
    public readonly _events = window.mitt();
    public readonly on = this._events.on;
    public readonly off = this._events.off;
    public readonly renderQueue = new ProfileRenderQueue();

    public activeSingle_Species: Single_Species; // not found
    public yous = new MasteredYous(this); // found
    public userInterface: UserInterface; // not found
    public settings: ProfileSettings;  // not found
    public masteriesUnlocked = new Map<Single_Species, boolean[]>(); // empty map
    public changesMade: any; // not found
    public classIds: any[] = []; // empty array
    // @ts-ignore 
    private renderedProgressBar?: ProgressBarElement; // not found

    public readonly manager = new ProfileManager(this, this.game); // found

    constructor(namespace: DataNamespace, public readonly game: Game) {
        super(namespace, 'Profile', game);
        this.manager = new ProfileManager(this, this.game);
    }
    public getErrorLog() { return 'Profile died, I dunno' }
    public registerData(namespace: DataNamespace, data: ProfileSkillData) {
        super.registerData(namespace, data);
        console.log('profile', data, namespace)
        if (data.species) {
            for (const single_species of data.species) {
                this.actions.registerObject(new Single_Species(namespace, single_species, this.game));
            }
        }

        if (data.classes) {
            for (const single_species of data.classes) {
                const newClass = new Single_Species(namespace, single_species, this.game)
                this.actions.registerObject(newClass);
                this.classIds.push(newClass._localID);
            }
        }
    }

    public get name() {
        return getLangString('Profile_Profile');
    }

    public get actionLevel() {
        return this.activeSingle_Species.level;
    }

    public get masteryAction() {
        return this.activeSingle_Species;
    }

    public Master(single_species: Single_Species) {
        if (this.yous.isMastered(single_species)) {
            return;
        }

        const MasterModifier = this.manager.getEquipCostModifier(single_species);
        const { costs, unlocked } = this.manager.calculateEquipCost(single_species);
        const MasterCost = Math.floor(costs[unlocked - 1] * (1 + MasterModifier / 100));

        const canAfford = this.game.gp.canAfford(MasterCost);

        if (!canAfford) {
            let html = `
            <h5 class="font-w400 text-combat-smoke font-size-sm mb-2">
                You cannot afford to Master this:
                <img class="single_species-icon align-middle" src="${single_species.media}" />
                ${single_species.name}
            </h5>

            <h5 class="text-danger">
                <img class="skill-icon-xs mr-2" src="${this.game.gp.media}" /> ${numberWithCommas(MasterCost)} GP
            </h5>`;

            for (const modifier of this.manager.getModifiers(single_species)) {
                html += `<small class="${modifier.level === 1 ? 'text-danger' : modifier.isActive ? 'text-success' : 'profile-text-grey'}">`;

                if (!modifier.isActive) {
                    html += `
                    <span>
                        (<img class="skill-icon-xxs mr-1"
                               src="${cdnMedia('assets/media/main/mastery_header.svg')}" />
                               ${modifier.level})
                    </span>`;
                }

                html += `<span>${modifier.description}</span></small><br />`;
            }

            SwalLocale.fire({
                html,
                showCancelButton: false,
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
        } else {
            let html = `<h5 class="font-w400 text-combat-smoke font-size-sm mb-2">
            ${getLangString('Profile_Would_You_Like_To_Equip_This_You')}
            <img class="single_species-icon align-middle" src="${single_species.media}" />
            ${single_species.name}
            </h5>

            <h5>
                <img class="skill-icon-xs mr-2" src="${this.game.gp.media}" /> ${numberWithCommas(MasterCost)} GP
            </h5>`;

            for (const modifier of this.manager.getModifiers(single_species)) {
                html += `<small class="${modifier.level === 1 ? 'text-danger' : modifier.isActive ? 'text-success' : 'profile-text-grey'}">`;

                if (!modifier.isActive) {
                    html += `
                    <span>
                        (<img class="skill-icon-xxs mr-1"
                        src="${cdnMedia('assets/media/main/mastery_header.svg')}" />
                        ${modifier.level})
                    </span>`;
                }
                if (modifier.level === 0) {
                    html += `<span style="color: yellow;">${modifier.description}</span></small><br />`;
                } else {
                    html += `<span>${modifier.description}</span></small><br />`;
                }
            }

            html += `<h5 class="font-w600 text-danger font-size-sm mt-3 mb-1">${getLangString(
                'Profile_This_Will_Replace_The_Mastered_You'
            )}</h5>`;

            const you1 = this.yous.get(1);
            const you2 = this.yous.get(2);

            const masteredYous = [you1, you2];

            const getText = (you: MasteredYou) =>
                you
                    ? templateLangString('Profile_Replace', { name: you.single_species.name })
                    : getLangString('Profile_Equip');

            if (this.classIds.includes(single_species._localID)) {
                html += `<div class="you-Master-footer mt-3"><button type="button" class="you-2-confirm font-size-xs btn btn-primary m-1" aria-label="" value="you-2" style="display: inline-block;">${getText(
                    you2
                )}</button>`;
            } else {
                html += `<div class="you-Master-footer mt-3"><button type="button" class="you-1-confirm font-size-xs btn btn-primary m-1" aria-label="" value="you-1" style="display: inline-block;">${getText(
                    you1
                )}</button>`;
            }

            html += `</div>`;

            SwalLocale.fire({
                html,
                showCancelButton: true,
                showConfirmButton: false,
                showDenyButton: false,
                customClass: {
                    cancelButton: 'font-size-xs btn btn-danger m-1',
                    actions: 'mt-0'
                },
                icon: 'info',
                didOpen: popup => {
                    masteredYous.forEach((you, index) => {
                        const confirmYou = popup.querySelector<HTMLButtonElement>(`.you-${index + 1}-confirm`);

                        if (confirmYou) {
                            confirmYou.onclick = () => {
                                if (MasterCost > 0) {
                                    this.game.gp.remove(MasterCost);
                                }

                                if (you) {
                                    this.yous.remove(you.single_species);
                                }

                                const masteredYou: MasteredYou = {
                                    single_species,
                                    slot: you?.slot ?? index + 1
                                };

                                this.yous.set(single_species, masteredYou);

                                (<any>this.userInterface)[`you${masteredYou.slot}`].setYou(masteredYou);
                                // @ts-ignore 
                                this.computeProvidedStats(true);

                                this.userInterface.species.forEach(component => {
                                    component.updateDisabled();
                                });

                                popup.querySelector<HTMLButtonElement>('.swal2-cancel').click();

                                this.userInterface.you1.updateModifiers();
                                this.userInterface.you2.updateModifiers();
                            };
                        }
                    });
                }
            });
        }
    }
    public Explain(single_species: Single_Species) {
        let html = `<div>${single_species.name}</div><br />`;
        html += `<img style="width: 20%;" class="single_species-img" src="${single_species.media}" /><br />`;
        // const images = single_species.skills.map(media => {
        //     try {
        //         if(!/(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg|svg)$/.test(media)) {
        //             return game.skills.find(skill => skill.id === media)?.media;
        //         } else {
        //             return media
        //         }
        //     } catch (error) {
        //         return "https://cdn2-main.melvor.net/assets/april/images/lemon.jpg"
        //     }
        // });
        let skills = single_species.skills.map(media => {
            try {
                if (!/(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg|svg)$/.test(media)) {
                    const ans = {
                        name: game.skills.find(skill => skill.id === media)?.name,
                        media: game.skills.find(skill => skill.id === media)?.media
                    }
                    return ans
                } else {
                    return ''
                }
            } catch (error) {
                return ''
            }
        });
        // images.forEach(image => {
        //     html += `<img class="skill-icon-xs m-2" src="${image}" />`;
        // });
        skills.forEach(skill => {
            if (skill) {
                html += `<div><small>You can gain mastery XP for ${single_species.name} from ${skill.name}</small><img class="skill-icon-xs m-2" src="${skill.media}" /></div><br />`;
            }
        });
        if (single_species._localID === "Angel") {
            html += `<small>${getLangString('Profile_Angels_burying')}</small><br />`
        }
        html += `<small>You can gain mastery & skill XP for ${single_species.name} by killing monsters</small>`;

        html = `<div class="explain-wrap">${html}</div>`

        SwalLocale.fire({
            html,
            showCancelButton: false,
            confirmButtonText: 'Ok'
        });
    }

    public unlockMastery(single_species: Single_Species) {
        SwalLocale.fire({
            html: '<div id="profile-mastery-container"></div>',
            showConfirmButton: false,
            showCancelButton: false,
            showDenyButton: false,
            didOpen: popup => {
                ui.create(
                    MasteryComponent(this.game, this, single_species),
                    popup.querySelector('#profile-mastery-container')
                );
            }
        });
    }

    public onLoad() {
        super.onLoad();
        console.log('onLoad')
        for (const single_species of this.actions.registeredObjects.values()) {
            this.renderQueue.actionMastery.add(single_species);
        }
        console.log('computeProvidedStats')
        // @ts-ignore 
        this.computeProvidedStats(false);

        this.renderQueue.grants = true;
        this.renderQueue.youModifiers = true;
        this.renderQueue.visibleSpecies = true;

        console.log('updateDisabled', this, 'known error here')
        for (const component of this.userInterface.species.values()) {
            component.updateDisabled();
        }
    }

    public initSettings(settings: ProfileSettings) {
        this.settings = settings;

        this.settings.onChange(ChangeType.Modifiers, () => {
            setTimeout(() => {
                // @ts-ignore 
                this.computeProvidedStats(true);
            }, 10);
        });
    }

    public onLevelUp(oldLevel: number, newLevel: number) {
        super.onLevelUp(oldLevel, newLevel);
        if (oldLevel < 2 && newLevel > 1) {
            game.bank.addItem(game.items.getObjectByID(`namespace_profile:Mastery_Token_Profile`), 1000, true, true, false, true, 'Gift from creator');
        }
        this.renderQueue.visibleSpecies = true;
    }

    public onMasteryLevelUp(action: Single_Species, oldLevel: number, newLevel: number): void {
        super.onMasteryLevelUp(action, oldLevel, newLevel);

        if (newLevel >= action.level) {
            // @ts-ignore 
            this.computeProvidedStats(true);
        }

        if (oldLevel < 20 && newLevel > 19) {
            game.bank.addItem(game.items.getObjectByID(`namespace_profile:Profile_Token`), 1, true, true, false, true, 'Gift from creator');
        }

        this.renderQueue.youModifiers = true;
    }

    public onModifierChange() {
        super.renderModifierChange();

        this.renderQueue.grants = true;
        this.renderQueue.youModifiers = true;
    }

    public render() {
        super.render();

        this.renderProgressBar();
        this.renderGrants();
        this.renderYouModifiers();
        this.renderVisibleSpecies();
    }

    public postDataRegistration() {
        super.postDataRegistration();

        this.sortedMasteryActions = this.actions.allObjects.sort((a, b) => a.level - b.level);
        this.milestones.push(...this.actions.allObjects);

        this.sortMilestones();

        for (const action of this.actions.allObjects) {
            this.masteriesUnlocked.set(action, [true, true, false, false, false, false, false]);
        }

        const capesToExclude = ['melvorF:Max_Skillcape'];

        if (cloudManager.hasTotHEntitlementAndIsEnabled) {
            capesToExclude.push('melvorTotH:Superior_Max_Skillcape');
        }

        const skillCapes = this.game.shop.purchases.filter(purchase => capesToExclude.includes(purchase.id));

        for (const cape of skillCapes) {
            const allSkillLevelsRequirement = cape.purchaseRequirements.find(
                req => req.type === 'AllSkillLevels'
            ) as AllSkillLevelRequirement;

            if (allSkillLevelsRequirement !== undefined) {
                if (allSkillLevelsRequirement.exceptions === undefined) {
                    allSkillLevelsRequirement.exceptions = new Set();
                }

                allSkillLevelsRequirement.exceptions.add(this);
            }
        }
    }

    public preAction() { }

    public postAction() {
        this.renderQueue.grants = true;
    }

    public onEquipmentChange() { }

    public addProvidedStats() {
        // @ts-ignore 
        super.addProvidedStats();

        for (const you of this.yous.all()) {
            const modifiers = this.manager.getModifiersForApplication(you.single_species);

            for (const modifier of modifiers) {
                // @ts-ignore 
                this.providedStats.addStatObject(you.single_species, modifier);
            }
        }
    }

    // public computeProvidedStats(updatePlayer = true) {
    //     this.modifiers.reset();

    //     for (const you of this.yous.all()) {
    //         const modifiers = this.manager.getModifiersForApplication(you.single_species);
    //         this.modifiers.addArrayModifiers(modifiers);
    //     }

    //     if (updatePlayer) {
    //         this.game.combat.player.computeAllStats();
    //     }
    // }

    public isMasteryActionUnlocked(action: Single_Species) {
        // @ts-ignore 
        return this.isBasicSkillRecipeUnlocked(action);
    }

    public get actionRewards() {
        const rewards = new Rewards(this.game);
        const actionEvent = new ProfileActionEvent(this, this.activeSingle_Species);

        this._events.emit('action', actionEvent);

        return rewards;
    }

    public getXPModifier(single_species?: Single_Species) {
        let modifier = super.getXPModifier(single_species);

        return modifier;
    }

    public getMasteryXPModifier(single_species: Single_Species) {
        let modifier = super.getMasteryXPModifier(single_species);

        return modifier;
    }

    public renderGrants() {
        if (!this.renderQueue.grants) {
            return;
        }
        console.log('2', this)
        for (const component of this.userInterface.species.values()) {
            const single_species = component.single_species
            const combatLevel = game?.combat?.enemy?.monster?.combatLevel || 1
            const profileLevel = game.profile._level
            let exp1 = 0
            if (single_species) {
                exp1 = Math.floor((combatLevel / single_species.baseExperience) + single_species.baseExperience) || 0
            }

            let skillExp1 = exp1 || 0
            let masteryExp1 = exp1 || 0

            // if (game.profile.isPoolTierActive(1)) {
            //     skillExp1 = skillExp1 + ((skillExp1 / 100) * 3) || 0
            // }
            // if (game.profile.isPoolTierActive(1)) {
            //     masteryExp1 = masteryExp1 + ((masteryExp1 / 100) * 5) || 0
            // }
            // @ts-ignore
            const globalEXPmod = game.modifiers.getValue('skillXP', {}) // game.modifiers.increasedGlobalSkillXP - game.modifiers.decreasedGlobalSkillXP || 0
            const totalExp = skillExp1 + (((skillExp1) / 100) * globalEXPmod) || 0
            // @ts-ignore
            const globalMasteryEXPmod = game.modifiers.getValue('masteryXP', {}) // game.modifiers.increasedGlobalMasteryXP - game.modifiers.decreasedGlobalMasteryXP || 0

            const totalMasteryExp1 = masteryExp1 + (((skillExp1) / 100) * globalMasteryEXPmod) + profileLevel || 0

            const masteryXP = totalMasteryExp1

            const baseMasteryXP = Math.floor(component.single_species.baseExperience)

            const poolXP = this.getMasteryXPToAddToPool(masteryXP);

            component.updateGrants(
                totalExp,
                component.single_species.baseExperience,
                masteryXP,
                baseMasteryXP,
                poolXP
            );
        }

        this.renderQueue.grants = false;
    }

    public renderYouModifiers() {
        if (!this.renderQueue.youModifiers) {
            return;
        }

        this.userInterface.you1.updateEnabled(true); // You 1 is always available.
        this.userInterface.you2.updateEnabled(true);

        this.userInterface.you1.updateModifiers();
        this.userInterface.you2.updateModifiers();

        this.userInterface.you1.updateCurrentMasteryLevel();
        this.userInterface.you2.updateCurrentMasteryLevel();

        this.renderQueue.youModifiers = false;
    }

    public renderProgressBar() {
        if (!this.renderQueue.progressBar) {
            return;
        }

        const progressBar = this.userInterface.species.get(this.activeSingle_Species)?.progressBar;

        if (progressBar !== this.renderedProgressBar) {
            this.renderedProgressBar?.stopAnimation();
        }

        this.renderQueue.progressBar = false;
    }

    public renderVisibleSpecies() {
        if (!this.renderQueue.visibleSpecies) {
            return;
        }

        for (const single_species of this.actions.registeredObjects.values()) {
            const menu = this.userInterface.species.get(single_species);

            if (menu === undefined) {
                return;
            }

            const element = document.querySelector(`#${menu.localId}`) as HTMLElement;

            if (!element) {
                return;
            }

            if (this.level >= single_species.level) {
                showElement(element);
            } else {
                hideElement(element);
            }
        }

        this.userInterface.locked.update();

        this.renderQueue.visibleSpecies = false;
    }

    // @ts-ignore 
    public getRegistry(type: ScopeSourceType) {
        switch (type) {
            // @ts-ignore 
            case ScopeSourceType.Action:
                return this.actions;
        }
    }

    public resetActionState() {

        this.activeSingle_Species = undefined;
        this.yous.clear();
    }

    public encode(writer: SaveWriter): SaveWriter {
        super.encode(writer);

        writer.writeUint32(this.version);
        writer.writeBoolean(this.activeSingle_Species !== undefined);

        if (this.activeSingle_Species) {
            writer.writeNamespacedObject(this.activeSingle_Species);
        }
        // mod.manager.getLoadedModList().includes(
        writer.writeArray(this.actions.allObjects, action => {
            try {
                writer.writeNamespacedObject(action);

                const masteriesUnlocked = this.masteriesUnlocked.get(action);
                writer.writeArray(masteriesUnlocked, value => {
                    writer.writeBoolean(value);
                });
            } catch (error) {
                console.log(error, this.actions.allObjects, action, this.masteriesUnlocked.get(action))
            }
        });

        // console.log(JSON.stringify(array).replace(/[\[\]\,\"]/g,'').length)

        writer.writeComplexMap(this.yous.yous, (key, value, writer) => {
            writer.writeNamespacedObject(key);
            writer.writeUint32(value.slot);
        });

        return writer;
    }

    public decode(reader: SaveWriter, version: number): void {
        super.decode(reader, version);
        const decoder = new Decoder(this.game, this, reader.byteOffset);
        console.log('decoding 2')
        decoder.decode(reader);
    }

    /** Fix completion log bug which passes through base game namespace even for modded skills. */
    public getMaxTotalMasteryLevels() {
        return super.getMaxTotalMasteryLevels(this.namespace);
    }

    /** Fix completion log bug which passes through base game namespace even for modded skills. */
    public getTotalCurrentMasteryLevels() {
        return super.getTotalCurrentMasteryLevels(this.namespace);
    }

    public getActionIDFromOldID(oldActionID: number, idMap: NumericIDMap) {
        return '';
    }
}

export class ProfileRenderQueue extends GatheringSkillRenderQueue<Single_Species> {
    grants = false;
    youModifiers = false;
    visibleSpecies = false;
}
