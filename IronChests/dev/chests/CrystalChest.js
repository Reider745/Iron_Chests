IDRegistry.genBlockID("crystalChest");
Block.createBlockWithRotation("crystalChest", [
	{name: "Crystal Chest", texture: [["crystal_chest", 0], ["crystal_chest", 0], ["crystal_chest", 2], ["crystal_chest", 1], ["crystal_chest", 2], ["crystal_chest", 2]], inCreative: true}
], "iron_chest");
ToolAPI.registerBlockMaterial(BlockID.crystalChest, "stone", 1, true);
Block.setDestroyLevel(BlockID.crystalChest, 1);
CustomChest.setChestRender(BlockID.crystalChest);

let guiCrystalChest = CustomChest.createChestGui("Crystal Chest", 108);

class CrystalChestTE extends GenericIronChestTE {
	constructor() {
		super(guiCrystalChest);
	}
}

TileEntity.registerPrototype(BlockID.crystalChest, new CrystalChestTE());
