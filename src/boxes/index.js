const 
    { registerBlockType } = wp.blocks,
    { __ } = wp.i18n;

/** Logo */
import { ReactComponent as Logo } from '../logo.svg';

/** Registra el tipo de bloque */
registerBlockType( 'lapizzeria/block-boxes', {
    apiVersion: 2,
    title: __( 'Block boxes', 'plugin-lapizzeria-bkl' ),
    icon: {
        src: Logo
    },
    category: 'lapizzeria',
    description: __( 'Block of boxes', 'plugin-lapizzeria-bkl' ),
    edit: () => {
        return (
            <h1>Se ve en Gutenberg, es decir en el editor.</h1>
        )
    },
    save: () => {       /** Muestra lo que a guardado la BD */
        return (
            <h1>Se ve en el FrontEnd</h1>
        )
    },
} );
