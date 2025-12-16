<Switch
	checked={group.isListed}
	onCheckedChange={(v) =>
		updateGroup({ id: group._id, isListed: v })
	}
/>
<span>List this space in marketplace</span>	
