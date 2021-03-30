const toml = require( 'toml' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );
 
// console.log( defaultConfig );

module.exports = {
    ...defaultConfig,
    entry: {
		index: path.resolve( process.cwd(), 'src', 'index.js' ),
        editor: path.resolve( process.cwd(), 'src', 'editor.js' ),
        styles: path.resolve( process.cwd(), 'src', 'styles.js' )
	},
    module: {
        ...defaultConfig.module,
        rules: [
            ...defaultConfig.module.rules,
            {
                test: /.toml/,
                type: 'json',
                parser: {
                    parse: toml.parse,
                },
            },
        ],
    }
};