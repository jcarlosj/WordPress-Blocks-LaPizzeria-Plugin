const 
    { registerBlockType } = wp.blocks,
    { __ } = wp.i18n;

/** Logo */
import { ReactComponent as Logo } from '../logo.svg';

/** Registra el tipo de bloque */
registerBlockType( 'lapizzeria/menu', {
    apiVersion: 2,
    title: __( 'Block Specialties Menu', 'plugin-lapizzeria-bkl' ),
    icon: {
        src: Logo
    },
    category: 'lapizzeria',
    description: __( 'Block to display specialties menu', 'plugin-lapizzeria-bkl' ),
    edit: () => {
        return (
            <h1>Se ve en Gutenberg (el editor)</h1>
        )
    },
    save: () => {    
        return null;    /** Se retorna null esperando que Gutenberg ejecute la funcion en el 'render_callback' del registro del bloque en PHP */
    },
} );
