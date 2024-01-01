export class ThuumTranslation {
    constructor(private readonly context: Modding.ModContext) {}

    public init() {
        this.context.patch(Item, 'name').get(function (patch) {
            if (this.namespace === 'namespace_thuum') {
                return getLangString(`ITEM_NAME_${this.localID}`);
            }

            return patch();
        });

        this.context.patch(Item, 'description').get(function (patch) {
            if (this.namespace === 'namespace_thuum' && this._customDescription !== undefined) {
                return getLangString(`ITEM_DESCRIPTION_${this.localID}`);
            }

            return patch();
        });

        this.context.patch(ShopPurchase, 'name').get(function (patch) {
            if (this.namespace === 'namespace_thuum' && this._customName !== undefined) {
                return getLangString(`SHOP_NAME_${this.localID}`);
            }

            return patch();
        });

        this.context.patch(ShopPurchase, 'description').get(function (patch) {
            if (this.namespace === 'namespace_thuum' && this._customDescription !== undefined) {
                return getLangString(`SHOP_DESCRIPTION_${this.localID}`);
            }

            return patch();
        });

        this.context.patch(Monster, 'name').get(function (patch) {
            if (this.namespace === 'namespace_thuum') {
                return getLangString(`MONSTER_NAME_${this.localID}`);
            }

            return patch();
        });

        this.context.patch(CombatArea, 'name').get(function (patch) {
            if (this.namespace === 'namespace_thuum') {
                return getLangString(`COMBAT_AREA_NAME_${this.localID}`);
            }

            return patch();
        });

        this.context.patch(SpecialAttack, 'name').get(function (patch) {
            if (this.namespace === 'namespace_thuum') {
                return getLangString(`SPECIAL_ATTACK_NAME_${this.localID}`);
            }

            return patch();
        });

        this.context.patch(SpecialAttack, 'description').get(function (patch) {
            if (this.namespace === 'namespace_thuum') {
                return templateString(
                    getLangString(`SPECIAL_ATTACK_DESCRIPTION_${this.localID}`),
                    this.descriptionTemplateData
                );
            }

            return patch();
        });

        this.context.patch(HerbloreRecipe, 'name').get(function (patch) {
            if (this.namespace === 'namespace_thuum') {
                return getLangString(`POTION_NAME_${this.localID}`);
            }

            return patch();
        });

        this.context.patch(Pet, 'name').get(function (patch) {
            if (this.namespace === 'namespace_thuum') {
                return getLangString(`PET_NAME_${this.localID}`);
            }

            return patch();
        });
    }
}
