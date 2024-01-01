export class ClassesTownship {
    private readonly itemType = ['Hat', 'Body', 'Leggings', 'Boots'];

    constructor(private readonly context: Modding.ModContext, private readonly game: Game) {}

    public register() {
        this.context.gameData
            .buildPackage(builder => {
                builder.skillData.add({
                    skillID: 'melvorD:Township',
                    data: {
                        itemConversions: {
                            toTownship: [],
                            fromTownship: [
                                {
                                    resourceID: 'melvorF:Planks',
                                    items: [
                                        {
                                            itemID: 'namespace_classes:Classes_Scroll_Of_XP',
                                            unlockRequirements: [
                                                { type: 'SkillLevel', skillID: 'namespace_classes:Classes', level: 15 },
                                                { type: 'SkillLevel', skillID: 'melvorD:Township', level: 15 }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                });

                this.updateSkillingOutfitItemUpgrade(builder);

                builder.itemSynergies.add({
                    itemIDs: [
                        'namespace_classes:Shouts_Hat',
                        'namespace_classes:Shouts_Body',
                        'namespace_classes:Shouts_Leggings',
                        'namespace_classes:Shouts_Boots'
                    ],
                    playerModifiers: {
                        increasedMasteryXP: [
                            {
                                skillID: 'namespace_classes:Classes',
                                value: 8
                            }
                        ]
                    }
                });
            })
            .add();

        this.modifyTradeOrder();
    }

    private modifyTradeOrder() {
        // Switch order of trades so scroll of xp is first.
        const planks = this.game.township.resources.getObjectByID('melvorF:Planks');
        const trades = this.game.township.itemConversions.fromTownship.get(planks);

        const scrollOfClassesXP = trades.find(trade => trade.item.id === 'namespace_classes:Classes_Scroll_Of_XP');

        trades.splice(trades.indexOf(scrollOfClassesXP), 1);
        trades.splice(0, 0, scrollOfClassesXP);

        this.game.township.itemConversions.fromTownship.set(planks, trades);
    }

    private updateSkillingOutfitItemUpgrade(builder: Modding.GameDataPackageBuilder) {
        for (const type of this.itemType) {
            // Get the item upgrade from woodcutters, all outfits share the same item upgrade so this will modify
            // all of them.
            const itemUpgrades = this.game.bank.itemUpgrades.get(
                this.game.items.getObjectByID(`melvorF:Woodcutters_${type}`)
            );

            if (!itemUpgrades?.length) {
                return;
            }

            const itemUpgrade = itemUpgrades.find(upgrade => upgrade.upgradedItem.id === `melvorF:Skillers_${type}`);

            if (!itemUpgrade) {
                return;
            }

            // Delete the existing item upgrade as we need to amend it with the new data.
            // Could optionally add to the item upgrade, but I want to use the builder
            // so I don't need to think about all the little details for registration. Let Malc
            // deal with it.
            for (const item of itemUpgrade.rootItems) {
                this.game.bank.itemUpgrades.delete(item);
            }

            builder.itemUpgrades.add({
                upgradedItemID: itemUpgrade.upgradedItem.id,
                gpCost: itemUpgrade.gpCost,
                scCost: itemUpgrade.scCost,
                itemCosts: [
                    ...itemUpgrade.itemCosts.map(cost => ({ id: cost.item.id, quantity: 1 })),
                    {
                        id: `namespace_classes:Shouts_${type}`,
                        quantity: 1
                    }
                ],
                rootItemIDs: [...itemUpgrade.rootItems.map(item => item.id), `namespace_classes:Shouts_${type}`],
                isDowngrade: itemUpgrade.isDowngrade
            });
        }
    }
}
