LIBRARY({
    name: "CustomChest",
    version: 1,
    shared: false,
    api: "CoreEngine"
});
function defaultChestData(){
    return {
        container: null,
        start: false,
        item: {
            maxCount: 0,
            count: 0
        },
        barData: {
            name: "",
            x: 0,
            y: 0
        },
        selectedSlot: null,
        selectedSlotType: null
    }
}
var chestData = defaultChestData();
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
        elements['scale1'] = {
            type: "scale",
            x: -100,
            y: -100,
            z: 10,
            direction: 0,
            bitmap: "transferBarFull",
            background: "transferBar",
            value: 0,
            scale: 60/108*slotSize/15
        };
        for (var i = 0; i < count; i++) {
            var x = i % inRow;
            var y = Math.floor(i / inRow);
            elements["slot" + i] = { 
                type: "slot", i: i, x: startX + x * slotSize, y: y * slotSize, size: slotSize, visual: true,
                onTouchEvent: function(element, event){
                    var slot_id = 'slot' + this.i;
                    var item = chestData.container.getSlot(slot_id);
                    var uiAdapter = chestData.container.getUiAdapter();
                    event_type = event.type;
                    if(event.type == 'CLICK')event_type = 'UP';
                    if(event_type == 'DOWN'){
                        if(chestData.selectedSlot != null){
                            if(chestData.selectedSlot == slot_id) {
                                chestData.selectedSlot = null;
                                chestData.selectedSlotType = null;
                                uiAdapter.getElement("scale2").setPosition(-100, -100);
                                chestData.container.setScale('scale2', 0);
                                uiAdapter.getElement("scale1").setPosition(-100, -100);
                                chestData.container.setScale('scale1', 0);
                                return;
                            }
                            chestData.item.count = Math.min(Math.round(chestData.item.count), chestData.item.maxCount);
                            if(chestData.selectedSlotType == 0){
                                chestData.container.sendInventoryToSlotTransaction(chestData.selectedSlot, slot_id, chestData.item.count);
                            } else {
                                chestData.container.sendEvent("SlotToSlot", {slot1: chestData.selectedSlot, slot2: slot_id, count: chestData.item.count});
                                //chestData.container.sendSlotToSlotTransaction(chestData.selectedSlot, slot_id, chestData.item.count);
                            }
                            uiAdapter.getElement("scale2").setPosition(-100, -100);
                            chestData.container.setScale('scale2', 0);
                            uiAdapter.getElement("scale1").setPosition(-100, -100);
                            chestData.container.setScale('scale1', 0);
                            chestData.selectedSlot = null;
                            chestData.selectedSlotType = null;
                        } else {
                            if(item.id == 0)return;
                            chestData.item = {
                                maxCount: item.count,
                                count: 0
                            }
                            chestData.start = World.getThreadTime() + 10;
                            chestData.tickStarted = false;
                            chestData.barData = {
                                name: "scale1",
                                x: this.x + (slotSize - elements['scale1'].scale*15)/2,
                                y: this.y
                            }
                        }
                    }
                    if(event_type == 'UP'){
                        if(chestData.selectedSlot != null || !chestData.start) return;
                        chestData.start = false;
                        chestData.selectedSlot = slot_id;
                        chestData.selectedSlotType = 1;
                        if(!chestData.tickStarted) chestData.item.count = chestData.item.maxCount;
                    }
                }
            };
        }
        return elements;
    },
    createChestGui: function (title, count, inRow, slotSize) {
        var inRow = inRow || 9;
        var slotSize = slotSize || 108;
        var elements = this.createGuiSlotSet(count, inRow, slotSize);
        var window = new UI.StandardWindow({
            standard: {
                header: { text: { text: Translation.translate(title) } },
                inventory: { standard: true },
                background: { standard: true },
                minHeight: Math.ceil(count / inRow) * slotSize
            },
            elements: elements
        });
        var inv_elements = window.getWindow('inventory').getContent();
        inv_elements.elements['scale2'] = {
            type: "scale",
            x: -100,
            y: -100,
            z: 10,
            direction: 0,
            bitmap: "transferBarFull",
            background: "transferBar",
            value: 0,
            scale: 60/108*251/15
        };
        inv_elements.elements["_CLICKFRAME_"] = {
            type: "frame",
            x: 0,
            y: 0,
            z: -100,
            width: 1000,
            height: 251*9,
            bitmap: "_default_slot_empty",
            scale: 1,
            onTouchEvent: function(element, event){
                var slot_id = Math.floor(event.x/251)+Math.floor(event.y/251)*4;
                var item = Player.getInventorySlot(slot_id);
                var uiAdapter = chestData.container.getUiAdapter();
                event_type = event.type;
                if(event.type == 'CLICK')event_type = 'UP';
                if(event_type == 'DOWN'){
                    if(chestData.selectedSlot != null){
                        if(chestData.selectedSlot == slot_id) {
                            chestData.selectedSlot = null;
                            chestData.selectedSlotType = null;
                            uiAdapter.getElement("scale2").setPosition(-100, -100);
                            chestData.container.setScale('scale2', 0);
                            uiAdapter.getElement("scale1").setPosition(-100, -100);
                            chestData.container.setScale('scale1', 0);
                            return;
                        }
                        chestData.item.count = Math.min(Math.round(chestData.item.count), chestData.item.maxCount);
                        if(chestData.selectedSlotType == 0){
                            //chestData.container.handleInventoryToSlotTransaction(this.index, currentSelectedSlot.slotName, amount);
                        } else {
                            chestData.container.sendSlotToInventoryTransaction(chestData.selectedSlot, chestData.item.count);
                        }
                        uiAdapter.getElement("scale2").setPosition(-100, -100);
                        chestData.container.setScale('scale2', 0);
                        uiAdapter.getElement("scale1").setPosition(-100, -100);
                        chestData.container.setScale('scale1', 0);
                        chestData.selectedSlot = null;
                        chestData.selectedSlotType = null;
                    } else {
                        if(item.id == 0)return;
                        chestData.item = {
                            maxCount: item.count,
                            count: 0
                        }
                        chestData.start = World.getThreadTime() + 10;
                        chestData.tickStarted = false;
                        chestData.barData = {
                            name: "scale2",
                            x: Math.floor(event.x/250)*250 + (250 - inv_elements.elements['scale2'].scale*15)/2,
                            y: Math.floor(event.y/250)*250
                        }
                    }
                }
                if(event_type == 'UP'){
                    if(chestData.selectedSlot != null || !chestData.start) return;
                    chestData.start = false;
                    chestData.selectedSlot = slot_id;
                    chestData.selectedSlotType = 0;
                    if(!chestData.tickStarted) chestData.item.count = chestData.item.maxCount;
                }
            }
        }
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
        chestData = defaultChestData();
        chestData.container = container;
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
        // TODO: check hoppers
    };
    ChestTileEntity.prototype.containerEvents = {
        SlotToSlot: function(eventData, connectedClient) {
            var slot1 = this.container.getSlot(eventData.slot1);
            var slot2 = this.container.getSlot(eventData.slot2);
            if(slot2.id != 0 && (slot2.id != slot1.id || slot2.data != slot1.data || slot2.extra != slot1.extra)) return;
            var _count = slot2.id != 0 ? Math.min(eventData.count, Item.getMaxStack(slot2.id) - slot2.count) : eventData.count;
            if(_count == 0) return;
            this.container.setSlot(eventData.slot1, slot1.id, slot1.count - _count, slot1.data, slot1.extra);
            this.container.setSlot(eventData.slot2, slot1.id, slot2.count + _count, slot1.data, slot1.extra);
            slot1.validate();
            this.container.sendChanges();
        }
    };
    ChestTileEntity.prototype.client = {
        tick: function(){
            if(chestData.start && World.getThreadTime() >= chestData.start && chestData.item.count < chestData.item.maxCount){
                if(World.getThreadTime() == chestData.start){
                    var uiAdapter = chestData.container.getUiAdapter();
                    uiAdapter.getElement(chestData.barData.name).setPosition(chestData.barData.x, chestData.barData.y);
                }
                chestData.tickStarted = true;
                chestData.item.count += chestData.item.maxCount/25;
                chestData.container.setScale(chestData.barData.name, chestData.item.maxCount > 15 ? chestData.item.count/chestData.item.maxCount : Math.round(chestData.item.count)/chestData.item.maxCount);
            }
        }
    };
    return ChestTileEntity;
}());
EXPORT("CustomChest", CustomChest);
EXPORT("ChestTileEntity", ChestTileEntity);
