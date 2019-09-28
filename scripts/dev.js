import concurrently from 'concurrently';
import pkg from '../package.json';

watch( {
	'api': {
		onchange: [
			'src/**/*.js',
			'scripts/api.hbs',
			'scripts/api.js'
		],
		color: 'green'
	},
	'homepage': {
		onchange: [
			'scripts/homepage*',
			'API.md',
			'README.md'
		],
		color: 'white'
	},
	'icons': {
		onchange: [
			'style/icons/*.svg',
			'scripts/icons.js'
		],
		color: 'blue'
	},
	'test': {
		onchange: [
			pkg.module,
			'scripts/test*'
		],
		flag: '--soft-fail',
		color: 'yellow'
	},
	'sass': 	{ flag: '--watch', color: 'magenta' },
	'sass:min': { flag: '--watch', color: 'magenta' },
	'rollup': 	{ flag: '-w', color: 'cyan' },
	'server': 	{ color: 'gray' }
} );

function watch( config ) {

	const commands = [];

	const longest = getLongest( Object.keys( config ) );

	for ( let name in config ) {

		const { onchange, flag, color } = config[ name ];

		let command;

		if ( onchange ) {
			const files = onchange.map( w => `'${w}'` ).join( ' ' );
			command = `./node_modules/.bin/onchange ${files} -- npm run ${name}`;
		} else {
			command = `npm run ${name}`;
		}

		if ( flag ) {
			command += ' -- ' + flag;
		}

		name = name.padStart( longest, '·' );

		commands.push( {
			command,
			name,
			prefixColor: `${color}.inverse`
		} );

	}

	concurrently( commands, { prefix: '{name}' } ).catch( error => {
		console.log( error );
	} );

}

function getLongest( arr ) {
	return arr.reduce( ( a, b ) => a.length > b.length ? a : b ).length;
}
