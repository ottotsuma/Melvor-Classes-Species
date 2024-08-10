import { Profile } from '../profile';
import { YouModifier, MasteredYou } from '../profile.types';

import './you.scss';

export interface YouContext {
    media: string;
    name: string;
    youId: string;
}
export function YouComponent(profile: Profile) {
    let MasteredYou: MasteredYou = undefined;
    return {
        $template: '#profile-you',
        you: undefined as YouContext,
        get media() {
            return this.you?.media;
        },
        get name() {
            return this.you?.name;
        },
        get hasYou() {
            return this.you !== undefined;
        },
        isEnabled: false,
        modifiers: [] as YouModifier[],
        currentMasteryLevel: 1,
        essenceIcon: function () {
            return profile.manager.essenceOfProfileIcon;
        },
        setYou: function (you: MasteredYou) {
            MasteredYou = you;
            if (!you) {
                this.you = undefined
            } else {
                this.you = {
                    youId: you.single_species?.id,
                    media: you.single_species?.media,
                    name: you.single_species?.name
                }
                this.updateCurrentMasteryLevel();
            }
        },
        updateCurrentMasteryLevel: function () {
            if (this.you) {
                const single_speciesRef = profile.actions.allObjects.find(action => action.id === this.you.youId);

                this.currentMasteryLevel = profile.getMasteryLevel(single_speciesRef);
            }
        },
        updateEnabled: function (enabled: boolean) {
            this.isEnabled = enabled;
        },
        updateModifiers: function () {
            this.modifiers = [];
            if (this.you) {
                {
                    try {
                        // @ts-ignore 
                        const profileModifer = game.modifiers.getValue('namespace_profile:UpgradeProfileModifiers', {}) || 0
                        // Need to have a saved state from the start
                        let difference = 0;
                        // @ts-ignore 
                        const savedValue = game?.saveUpdateProfileModifiers || 0
                        if (savedValue !== profileModifer) {
                            // Calculate the difference correctly
                            difference = profileModifer - savedValue;
                            // @ts-ignore 
                            game.saveUpdateProfileModifiers = profileModifer;
                        }
                        if (difference !== 0) {
                            game.profile.actions.registeredObjects.forEach(single => {
                                single.standardModifiers.forEach(modifier => {
                                    modifier?.modifiers?.forEach(mod => {
                                        // Update mod.value by the difference
                                        if (mod.value < 0) {
                                            mod.value -= difference;
                                        } else {
                                            mod.value += difference;
                                        }
                                    });
                                });
                            });
                        }
                    } catch (error) {
                        console.log(error)
                    }
                    const Ref = profile.actions.allObjects.find(action => action.id === this.you.youId);
                    this.modifiers = profile.manager.getModifiers(Ref);
                    // this.modifiers = profile.manager.getModifiers(this.you.single_species);
                }
            }
        }
    }
}
