const 
    { registerBlockType } = wp.blocks,
    { __ } = wp.i18n,
    { withSelect } = wp.data,
    { RichText, InspectorControls } = wp.blockEditor,
    { PanelBody, PanelRow, RangeControl } = wp.components;

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

        const onChangeNumberOfPublications = nPublications  => {
            console .log( nPublications );
        }

        return {
            specialties: select( 'core' ) .getEntityRecords( 'postType', 'specialties' ),     //  Peticion a la API REST WP
            onChangeNumberOfPublications
        };
    })
    /** Data de la API */
    ( ( { specialties, onChangeNumberOfPublications } ) => {        //  Props

        console .log( specialties );

        return (
            <>
                <InspectorControls>
                    <PanelBody
                        title={ __( 'Number of posts', 'plugin-lapizzeria-bkl' ) }
                        initialOpen={ true }    /** Solo se permite que un panel abra automaticamente */
                    >
                        <PanelRow>{ __( 'Select number of specialties', 'plugin-lapizzeria-bkl' ) }</PanelRow>
                        <RangeControl 
                            onChange={ onChangeNumberOfPublications }
                            min={ 2 }
                            max={ 10 }
                            value={ 2 }
                        />
                    </PanelBody>
                </InspectorControls>

                <h2>{ __( 'Our specialties', 'plugin-lapizzeria-bkl' ) }</h2>
                {   /** Validamos si la data esta disponible */
                    ( specialties ) &&

                        <ul className="our-menu">
                            { specialties .map( specialty => (
                                <li>
                                    <img src={ specialty .featured_image_url } />
                                    <header className="specialty-header">
                                        <h3 className="specialty-title">{ specialty .title .rendered }</h3>
                                        <p className="specialty-price">$ { specialty .price }</p>
                                    </header>
                                    <div className="specialty-content">
                                        <p>
                                        <RichText .Content 
                                            value={ specialty .content .rendered .substring( 0, 180 ) }
                                        />
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                }
            </>
        );
    }),
    save: () => {    
        return null;    /** Se retorna null esperando que Gutenberg ejecute la funcion en el 'render_callback' del registro del bloque en PHP */
    },
} );
