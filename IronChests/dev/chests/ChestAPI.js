let CustomChest = {
	setChestRender: function(id) {
		Block.setShape(id, 1/16, 0, 1/16, 15/16, 14/16, 15/16);
		TileRenderer.setStaticModelWithRotation(id, [
			[1/16, 0, 1/16, 15/16, 14/16, 15/16],
			[7/16, 7/16, 15/16, 9/16, 11/16, 1]
		]);
	},

	createGuiSlotArray: function(count, inRow, slotSize) {
		let startX = (1000 - inRow * slotSize) / 2;
		let elements = {};
		for (let i = 0; i < count; i++) {
			let x = i % inRow;
			let y = Math.floor(i / inRow);
			elements["slot"+i] = {type: "slot", x: startX + x * slotSize, y: y * slotSize, size: slotSize};
		}
		return elements;
	},

	createChestGui: function(title, count, inRow, slotSize) {
		let inRow = inRow || 9;
		let slotSize = slotSize || 108;
		return new UI.StandardWindow({
			standard: {
				header: {text: {text: Translation.translate(title)}},
				inventory: {standard: true},
				background: {standard: true},
				minHeight: Math.ceil(count / inRow) * slotSize
			},
		
			elements: this.createGuiSlotArray(count, inRow, slotSize)
		});
	}
}
