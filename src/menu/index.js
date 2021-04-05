const 
    { registerBlockType } = wp.blocks,
    { __ } = wp.i18n,
    { withSelect } = wp.data;

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
    /** Consulta a la API */
    edit: withSelect( ( select ) => {   
        return {
            specialties: select( "core" ) .getEntityRecords( 'postType', 'specialties' )      //  Peticion a la API REST WP
        };
    })
    /** Data de la API */
    ( ( { specialties } ) => {     
        console .log( specialties );

        return (
            <>
                <h1>Se ve en Gutenberg (el editor)</h1>
                <p>Ver en consola del navegador la data</p>
            </>
        );
    }),
    save: () => {    
        return null;    /** Se retorna null esperando que Gutenberg ejecute la funcion en el 'render_callback' del registro del bloque en PHP */
    },
} );
