{
	address: {
		type: 'string',
		regex: regex.HOSTNAME
	},
	port: {
		type: 'number',
		validation: valid.PORT
	},
	spots: {
		doc: "Spots (URIs) where pokes (POST requests) are expected",
		type: [
			{
				url: {
					doc: "Github repository HTTPS URL",
					type: 'string',
					regex: regex.HTTPS,
					required: true
				uri: {
					doc: "URI of poke",
					type: 'string',
					regex: regex.URI,
					required: true
				},
				secret: {
					doc: "Secret of poke",
					type: 'string',
					required: true
				}
			}
		],
		required: true
	},
	folders: {
		doc: "Folders to update when their associated pokes come in",
		types: [
			{
				type:[ 'string' ],
				regex: regex.PATH,
				required: true
			},
			{
				type: {
					path: {
						doc: "Folder path",
						type: 'string',
						regex: regex.PATH,
						required: true
					},
					url: {
						doc: "Repository URL (only required if folder doesn't already exist",
						type: 'string',
						regex: regex.URL,
						required: true
					},
					branch: {
						doc: "Repository branch (only required if folder doesn't already exist",
						type: 'string',
						regex: regex.GIT_REF_NAME
					}
				}
			},
		]
	}
}		
