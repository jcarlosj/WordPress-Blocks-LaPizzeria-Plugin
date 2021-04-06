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
    attributes: {
        numberOfPosts: {
            type: 'number'
        }
    },
    /** Consulta a la API */
    edit: withSelect( ( select, props ) => {
        
        const 
            { attributes: { numberOfPosts }, setAttributes } = props;

        console .log( 'numberOfPosts', numberOfPosts );

        const onChangeNumberOfPublications = nPublications  => {
            console .log( nPublications );
            setAttributes({ numberOfPosts: nPublications } );
        }

        return {
            specialties: select( 'core' ) .getEntityRecords( 'postType', 'specialties', {
                per_page: numberOfPosts || 4   //  Peticion a la API REST WP de la cantidad de post que deseamos 
            } ),     
            onChangeNumberOfPublications,
            props
        };
    })
    /** Data de la API */
    ( ( { specialties, onChangeNumberOfPublications, props } ) => {        //  Props

        const { attributes: { numberOfPosts } } = props;

        console .log( specialties );
        console .log( 'numberOfPosts', numberOfPosts );

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
                            value={ numberOfPosts || 4 }
                        />
                    </PanelBody>
                </InspectorControls>

                <section className="menu">

                    <h2 className="menu-title">{ __( 'Our specialties', 'plugin-lapizzeria-bkl' ) }</h2>
                    {   /** Validamos si la data esta disponible */
                        ( specialties ) &&

                            <ul className="menu-list">
                                { specialties .map( specialty => (
                                    <li className="menu-item specialty">
                                        <img src={ specialty .featured_image_url } />
                                        <header className="specialty-header">
                                            <h3 className="specialty-title">{ specialty .title .rendered }</h3>
                                            <p className="specialty-price">$ { specialty .price }</p>
                                        </header>
                                        <div className="specialty-content">
                                            {/** Removemos el tag p pues esta contenido en el valor de "specialty .content .rendered" */}
                                                <RichText .Content 
                                                    value={ specialty .content .rendered .substring( 0, 180 ) }
                                                />
                                            
                                        </div>
                                    </li>
                                ))}
                            </ul>

                    }

                </section>    

            </>
        );
    }),
    save: () => {    
        return null;    /** Se retorna null esperando que Gutenberg ejecute la funcion en el 'render_callback' del registro del bloque en PHP */
    },
} );
