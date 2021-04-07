const 
    { registerBlockType } = wp.blocks,
    { __ } = wp.i18n,
    { withSelect } = wp.data,
    { useBlockProps, RichText, InspectorControls } = wp.blockEditor,
    { PanelBody, PanelRow, RangeControl, SelectControl, TextControl } = wp.components;

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
        },
        selectedCategory: {
            type: 'number'
        },
        titleBlock: {
            type: 'string',
            default: 'Title Block'
        }
    },
    /** Consulta a la API */
    edit: withSelect( ( select, props ) => {
        
        const 
            { attributes: { numberOfPosts, selectedCategory }, setAttributes } = props;

        console .log( 'numberOfPosts', numberOfPosts );

        const onChangeNumberOfPublications = nPublications  => {
            console .log( nPublications );
            setAttributes({ numberOfPosts: nPublications } );
        }

        const onChangeCategory = ( selectedCategory ) => {
            console .log( selectedCategory );
            setAttributes({ selectedCategory } );
        }

        const onChangeTitleBlock = title => {
            console .log( title );
            setAttributes({ titleBlock: title } );
        }

        return {
            categories: select( 'core' ) .getEntityRecords( 'taxonomy', 'lapizzeria-category-menu' ),
            specialties: select( 'core' ) .getEntityRecords( 'postType', 'specialties', {
                'api-category-menu': selectedCategory,      //  rest_base de la taxonomia
                per_page: numberOfPosts || 4                //  Peticion a la API REST WP de la cantidad de post que deseamos 
            } ),     
            onChangeNumberOfPublications,
            onChangeCategory,
            onChangeTitleBlock,
            props
        };
    })
    /** Data de la API */
    ( ( { categories, specialties, onChangeNumberOfPublications, onChangeCategory, onChangeTitleBlock, props } ) => {        //  Props

        const 
            blockProps = useBlockProps( { className: 'specialty-card' } ),
            { attributes: { numberOfPosts, selectedCategory, titleBlock } } = props;

        console .log( specialties );
        console .log( categories );
        console .log( 'numberOfPosts', numberOfPosts );
        
        const getCategories = () => {

            const opcionDefault = [{ label: 'Todos', value: '' }];

            categories .forEach( category => {
                category[ 'label' ] = category .name;
                category[ 'value' ] = category .id;
            });

            return [ ...opcionDefault, ...categories ];
        }

        console .log( getCategories() );

        return (
            <div { ...blockProps }>
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
                    <PanelBody
                        title={ __( 'Category', 'plugin-lapizzeria-bkl' ) }
                        initialOpen={ false }    /** Solo se permite que un panel abra automaticamente */
                    >
                        <PanelRow>{ __( 'Select category', 'plugin-lapizzeria-bkl' ) }</PanelRow>
                        <SelectControl 
                            options={ getCategories() }
                            onChange={ onChangeCategory }
                            value={ selectedCategory }
                        />
                    </PanelBody>
                    <PanelBody
                        title={ __( 'Title', 'plugin-lapizzeria-bkl' ) }
                        initialOpen={ false }    /** Solo se permite que un panel abra automaticamente */
                    >
                        <PanelRow>{ __( 'Title for the block', 'plugin-lapizzeria-bkl' ) }</PanelRow>
                        <TextControl 
                            onChange={ onChangeTitleBlock }
                            value={ titleBlock }
                        />
                    </PanelBody>

                </InspectorControls>

                <section className="menu">

                    <h2 className="menu-title">{ titleBlock }</h2>
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

            </div>
        );
    }),
    save: () => {    
        const blockProps = useBlockProps .save( { className: 'specialty-card' } );

        return null;    /** Se retorna null esperando que Gutenberg ejecute la funcion en el 'render_callback' del registro del bloque en PHP */
    },
} );
