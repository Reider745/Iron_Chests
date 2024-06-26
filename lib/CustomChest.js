LIBRARY({
    name: "CustomChest",
    version: 3,
    shared: false,
    api: "CoreEngine"
});

IMPORT("VanillaSlots");
IMPORT("StorageInterface");

function getScrollY(window){
    let view = window.layout;
    var scrollY = 0;
    try {
        while(true) {
            scrollY += view.getScrollY();
            view = view.getChildAt(0);
        }
    } catch(errr) {};
    return scrollY;
}
var CustomChest = {
    setChestRender: function (id) {
        for (var data = 0; data < 4; data++) {
            Block.setShape(id, 1 / 16, 0, 1 / 16, 15 / 16, 14 / 16, 15 / 16, data);
            var render = new ICRender.Model();
            var model = BlockRenderer.createModel();
            model.addBox(1 / 16, 0, 1 / 16, 15 / 16, 14 / 16, 15 / 16, id, data);
            if (data == 0)
                model.addBox(7 / 16, 7 / 16, 15 / 16, 9 / 16, 11 / 16, 1, id, data);
            if (data == 1)
                model.addBox(7 / 16, 7 / 16, 0, 9 / 16, 11 / 16, 1 / 16, id, data);
            if (data == 2)
                model.addBox(15 / 16, 7 / 16, 7 / 16, 1, 11 / 16, 9 / 16, id, data);
            if (data == 3)
                model.addBox(0, 7 / 16, 7 / 16, 1 / 16, 11 / 16, 9 / 16, id, data);
            render.addEntry(model);
            BlockRenderer.setStaticICRender(id, data, render);
        }
    },
    createGuiSlotSet: function (count, inRow, slotSize) {
        var startX = (1000 - inRow * slotSize) / 2;
        var elements = {};
        for (var i = 0; i < count; i++) {
            var x = i % inRow;
            var y = Math.floor(i / inRow);
            elements["slot" + i] = {
                type: "slot", i: i, x: startX + x * slotSize, y: y * slotSize, size: slotSize
            };
        }
        return elements;
    },
    createChestGui: function (title, count, inRow, slotSize) {
        var inRow = inRow || 9;
        var slotSize = slotSize || 108;
        var window = new UI.StandardWindow({
            standard: {
                header: { text: { text: Translation.translate(title) } },
                inventory: { standard: true },
                background: { standard: true },
                minHeight: Math.ceil(count / inRow) * slotSize
            },
            elements: this.createGuiSlotSet(count, inRow, slotSize)
        });
        return window;
    }
};
var ChestTileEntity = /** @class */ (function () {
    function ChestTileEntity(guiScreen) {
        this.useNetworkItemContainer = true;
        this.guiScreen = guiScreen;
    }
    ChestTileEntity.prototype.getScreenName = function (player, coords) {
        return "main";
    };
    ChestTileEntity.prototype.getScreenByName = function (screenName, container) {
        return this.guiScreen;
    };
    ChestTileEntity.prototype.getGuiScreen = function () {
        return this.guiScreen;
    };
    ChestTileEntity.prototype.clearContainer = function () {
        for (var name in this.container.slots) {
            this.container.clearSlot(name);
        }
    };
    ChestTileEntity.prototype.tick = function () {
        StorageInterface.checkHoppers(this);
        this.container.sendChanges();
    };
    ChestTileEntity.prototype.registerTile = function(id){
        TileEntity.registerPrototype(id, this);
        VanillaSlots.registerForTile(id);
    }
    return ChestTileEntity;
}());

EXPORT("CustomChest", CustomChest);
EXPORT("ChestTileEntity", ChestTileEntity);
