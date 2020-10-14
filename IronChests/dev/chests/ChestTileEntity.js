class ChestTileEntity {
	useNetworkItemContainer = true;

	constructor(guiScreen) {
		this.guiScreen = guiScreen;
	}

	getScreenName(player, coords) {
		return "main";
	}
	
	getScreenByName(screenName) {
		return this.guiScreen;
	}

	getGuiScreen(screenName) { // reverse compatibility
		return this.guiScreen;
	}

	clearContainer() {
		for (let name in this.container.slots) {
			this.container.clearSlot(name);
		}
	}

	upgrade(chestID, player) {
		if (getCoreAPILevel() < 12) return;
		let blockData = this.blockSource.getBlockData(this.x, this.y, this.z);
		this.blockSource.setBlock(this.x, this.y, this.z, chestID, blockData);
		let container = new ItemContainer(this.container.asLegacyContainer());
		this.clearContainer();
		this.selfDestroy();
		let tileEntity = TileEntity.addTileEntity(this.x, this.y, this.z, this.blockSource);
		tileEntity.container = container;
		Entity.setCarriedItem(player, 0, 0, 0);
	}

	tick() {
		// check hoppers
	}
}
