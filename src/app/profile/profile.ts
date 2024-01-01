import { ProfileActionEvent } from './event';
import { UserInterface } from './user-interface';
import { MasteryComponent } from './mastery/mastery';
import { ProfileManager } from './manager';
import { MasteredShout, Single_Species, ProfileSkillData } from './profile.types';
import { Decoder } from './decoder/decoder';
import { MasteredShouts } from './mastered-shouts';
import { ChangeType, ProfileSettings } from './settings';

import './profile.scss';

export class Profile extends SkillWithMastery<Single_Species, ProfileSkillData> {
    public readonly version = 4;
    public readonly _media = 'https://cdn2-main.melvor.net/assets/media/skills/thieving/man.svg';
    public readonly _events = window.mitt();
    public readonly on = this._events.on;
    public readonly off = this._events.off;
    public readonly renderQueue = new ProfileRenderQueue();

    public activeSingle_Species: Single_Species;
    public shouts = new MasteredShouts(this);
    public userInterface: UserInterface;
    public settings: ProfileSettings;
    public modifiers = new MappedModifiers();
    public masteriesUnlocked = new Map<Single_Species, boolean[]>();
    public changesMade: any;
    public classIds: any[] = [];

    private renderedProgressBar?: ProgressBar;

    public readonly manager = new ProfileManager(this, this.game);

    constructor(namespace: DataNamespace, public readonly game: Game) {
        super(namespace, 'Profile', game);
    }
    public getErrorLog () {return 'a'}
    public registerData(namespace: DataNamespace, data: ProfileSkillData) {
        super.registerData(namespace, data);

        if (data.species) {
            for (const single_species of data.species) {
                this.actions.registerObject(new Single_Species(namespace, single_species));
            }
        }

        if (data.classes) {
            for (const single_species of data.classes) {
                const newClass = new Single_Species(namespace, single_species)
                this.actions.registerObject(newClass);
                this.classIds.push(newClass._localID);
            }
        }
    }

    public get name() {
        return getLangString('Profile_Profile_Profile');
    }

    public get actionLevel() {
        return this.activeSingle_Species.level;
    }

    public get masteryAction() {
        return this.activeSingle_Species;
    }

    public Master(single_species: Single_Species) {
        if (this.shouts.isMastered(single_species)) {
            return;
        }

        const MasterModifier = this.manager.getEquipCostModifier(single_species);
        const { costs, unlocked } = this.manager.calculateEquipCost(single_species);
        const MasterCost = Math.floor(costs[unlocked - 1] * (1 + MasterModifier / 100));

        const canAfford = this.game.gp.canAfford(MasterCost);

        if (!canAfford) {
            let html = `
            <h5 class="font-w400 text-combat-smoke font-size-sm mb-2">
                You cannot afford to Master this shout:
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
            ${getLangString('Profile_Profile_Would_You_Like_To_Equip_This_Shout')}
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

                html += `<span>${modifier.description}</span></small><br />`;
            }

            html += `<h5 class="font-w600 text-danger font-size-sm mt-3 mb-1">${getLangString(
                'Profile_Profile_This_Will_Replace_The_Mastered_Shout'
            )}</h5>`;

            const shout1 = this.shouts.get(1);
            const shout2 = this.shouts.get(2);

            const masteredShouts = [shout1, shout2];

            const getText = (shout: MasteredShout) =>
                shout
                    ? templateLangString('Profile_Profile_Replace', { name: shout.single_species.name })
                    : getLangString('Profile_Profile_Equip');

            if( this.classIds.includes(single_species._localID)  ) {
                html += `<div class="shout-Master-footer mt-3"><button type="button" class="shout-2-confirm font-size-xs btn btn-primary m-1" aria-label="" value="shout-2" style="display: inline-block;">${getText(
                    shout2
                )}</button>`;
            } else {
                html += `<div class="shout-Master-footer mt-3"><button type="button" class="shout-1-confirm font-size-xs btn btn-primary m-1" aria-label="" value="shout-1" style="display: inline-block;">${getText(
                    shout1
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
                    masteredShouts.forEach((shout, index) => {
                        const confirmShout = popup.querySelector<HTMLButtonElement>(`.shout-${index + 1}-confirm`);

                        if (confirmShout) {
                            confirmShout.onclick = () => {
                                this.game.gp.remove(MasterCost);

                                if (shout) {
                                    this.shouts.remove(shout.single_species);
                                }

                                const masteredShout: MasteredShout = {
                                    single_species,
                                    slot: shout?.slot ?? index + 1,
                                    socket: undefined,
                                    utility: undefined
                                };

                                this.shouts.set(single_species, masteredShout);

                                (<any>this.userInterface)[`shout${masteredShout.slot}`].setShout(masteredShout);

                                this.computeProvidedStats(true);

                                this.userInterface.species.forEach(component => {
                                    component.updateDisabled();
                                });

                                popup.querySelector<HTMLButtonElement>('.swal2-cancel').click();
                            };
                        }
                    });
                }
            });
        }
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

        for (const single_species of this.actions.registeredObjects.values()) {
            this.renderQueue.actionMastery.add(single_species);
        }

        this.computeProvidedStats(false);

        this.renderQueue.grants = true;
        this.renderQueue.shoutModifiers = true;
        this.renderQueue.visibleSpecies = true;

        for (const component of this.userInterface.species.values()) {
            component.updateDisabled();
        }
    }

    public initSettings(settings: ProfileSettings) {
        this.settings = settings;

        this.settings.onChange(ChangeType.Modifiers, () => {
            setTimeout(() => {
                this.computeProvidedStats(true);
            }, 10);
        });
    }

    public onLevelUp(oldLevel: number, newLevel: number) {
        super.onLevelUp(oldLevel, newLevel);

        this.renderQueue.visibleSpecies = true;
    }

    public onMasteryLevelUp(action: Single_Species, oldLevel: number, newLevel: number): void {
        super.onMasteryLevelUp(action, oldLevel, newLevel);

        if (newLevel >= action.level) {
            this.computeProvidedStats(true);
        }

        this.renderQueue.gpRange = true;
        this.renderQueue.shoutModifiers = true;
    }

    public onModifierChange() {
        super.onModifierChange();

        this.renderQueue.grants = true;
        this.renderQueue.gpRange = true;
        this.renderQueue.shoutModifiers = true;
    }

    public render() {
        super.render();

        this.renderProgressBar();
        this.renderGrants();
        this.renderGPRange();
        this.renderShoutModifiers();
        this.renderVisibleSpecies();
    }

    public postDataRegistration() {
        super.postDataRegistration();

        this.sortedMasteryActions = this.actions.allObjects.sort((a, b) => a.level - b.level);
        this.milestones.push(...this.actions.allObjects);

        this.sortMilestones();

        for (const action of this.actions.allObjects) {
            this.masteriesUnlocked.set(action, [true, false, false, false]);
        }

        const capesToExclude = ['melvorF:Max_Skillcape'];

        if (cloudManager.hasTotHEntitlement) {
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

    public preAction() {}

    public postAction() {
        this.renderQueue.grants = true;
    }

    public onEquipmentChange() {}

    public computeProvidedStats(updatePlayer = true) {
        this.modifiers.reset();

        for (const shout of this.shouts.all()) {
            const modifiers = this.manager.getModifiersForApplication(shout.single_species);
            this.modifiers.addArrayModifiers(modifiers);
        }

        if (updatePlayer) {
            this.game.combat.player.computeAllStats();
        }
    }

    public get actionRewards() {
        const rewards = new Rewards(this.game);
        const actionEvent = new ProfileActionEvent(this, this.activeSingle_Species);
        const costs = new Costs(this.game);

        rewards.addXP(this, this.activeSingle_Species.baseExperience);
        // rewards.addGP(this.manager.getGoldToAward(this.activeSingle_Species));
        costs.addGP(this.manager.getGoldToTake(this.activeSingle_Species))        
        costs.consumeCosts()

        this._events.emit('action', actionEvent);

        return rewards;
    }

    public getXPModifier(single_species?: Single_Species) {
        let modifier = super.getXPModifier(single_species);

        if (this.isPoolTierActive(0)) {
            modifier += 3;
        }

        return modifier;
    }

    public getMasteryXPModifier(single_species: Single_Species) {
        let modifier = super.getMasteryXPModifier(single_species);

        if (this.isPoolTierActive(1)) {
            modifier += 5;
        }

        return modifier;
    }

    public renderGrants() {
        if (!this.renderQueue.grants) {
            return;
        }

        for (const component of this.userInterface.species.values()) {
            const masteryXP = this.getMasteryXPToAddForAction(
                component.single_species, 0
            );

            const baseMasteryXP = this.getBaseMasteryXPToAddForAction(
                component.single_species, 0
            );

            const poolXP = this.getMasteryXPToAddToPool(masteryXP);

            component.updateGrants(
                this.modifyXP(component.single_species.baseExperience, component.single_species),
                component.single_species.baseExperience,
                masteryXP,
                baseMasteryXP,
                poolXP
            );
        }

        this.renderQueue.grants = false;
    }

    public renderGPRange() {
        if (!this.renderQueue.gpRange) {
            return;
        }

        for (const component of this.userInterface.species.values()) {
            component.updateGPRange();
        }

        this.renderQueue.gpRange = false;
    }

    public renderShoutModifiers() {
        if (!this.renderQueue.shoutModifiers) {
            return;
        }

        this.userInterface.shout1.updateEnabled(true); // Shout 1 is always available.
        this.userInterface.shout2.updateEnabled(true);

        this.userInterface.shout1.updateModifiers();
        this.userInterface.shout2.updateModifiers();

        this.userInterface.shout1.updateCurrentMasteryLevel();
        this.userInterface.shout2.updateCurrentMasteryLevel();

        this.renderQueue.shoutModifiers = false;
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

    public getTotalUnlockedMasteryActions() {
        return this.actions.reduce(levelUnlockSum(this), 0);
    }

    public resetActionState() {

        this.activeSingle_Species = undefined;
        this.shouts.clear();
    }

    public encode(writer: SaveWriter): SaveWriter {
        super.encode(writer);

        writer.writeUint32(this.version);
        writer.writeBoolean(this.activeSingle_Species !== undefined);

        if (this.activeSingle_Species) {
            writer.writeNamespacedObject(this.activeSingle_Species);
        }

        writer.writeArray(this.actions.allObjects, action => {
            writer.writeNamespacedObject(action);

            const masteriesUnlocked = this.masteriesUnlocked.get(action);

            writer.writeArray(masteriesUnlocked, value => {
                writer.writeBoolean(value);
            });
        });

        writer.writeComplexMap(this.shouts.shouts, (key, value, writer) => {
            writer.writeNamespacedObject(key);
            writer.writeUint32(value.slot);

            writer.writeBoolean(value.socket !== undefined);

            if (value.socket) {
                const socket = this.game.items.getObjectByID(value.socket.id);

                writer.writeNamespacedObject(socket);
            }

            writer.writeBoolean(value.utility !== undefined);

            if (value.utility) {
                const utility = this.game.items.getObjectByID(value.utility.id);

                writer.writeNamespacedObject(utility);
            }
        });

        return writer;
    }

    public decode(reader: SaveWriter, version: number): void {
        super.decode(reader, version);

        const decoder = new Decoder(this.game, this, reader.byteOffset);

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
    gpRange = false;
    shoutModifiers = false;
    visibleSpecies = false;
}
