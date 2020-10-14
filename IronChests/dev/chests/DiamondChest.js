IDRegistry.genBlockID("diamondChest");
Block.createBlockWithRotation("diamondChest", [
	{name: "Diamond Chest", texture: [["diamond_chest", 0], ["diamond_chest", 0], ["diamond_chest", 2], ["diamond_chest", 1], ["diamond_chest", 2], ["diamond_chest", 2]], inCreative: true}
], "iron_chest");
ToolAPI.registerBlockMaterial(BlockID.diamondChest, "stone", 1, true);
Block.setDestroyLevel(BlockID.diamondChest, 1);
CustomChest.setChestRender(BlockID.diamondChest);

let guiDiamondChest = CustomChest.createChestGui("Diamond Chest", 108);

class DiamondChestTE extends ChestTileEntity {
	constructor() {
		super(guiDiamondChest);
	}

	click(id, count, data, coords, player, extra) {
		if (id == ItemID.diamondCrystalUpgrade) {
			this.upgrade(BlockID.crystalChest, player);
			return true;
		}
		if (id == ItemID.diamondObsidianUpgrade) {
			this.upgrade(BlockID.obsidianChest, player);
			return true;
		}
		return false;
	}
}

TileEntity.registerPrototype(BlockID.diamondChest, new DiamondChestTE());
