const 
    { registerBlockType } = wp.blocks,
    { __ } = wp.i18n,
    { withSelect } = wp.data,
    { useBlockProps, RichText, InspectorControls } = wp.blockEditor,
    { PanelBody, PanelRow, RangeControl, SelectControl, TextControl } = wp.components,
    { useState, useEffect } = wp.element;

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
        }
    },
    /** Consulta a la API */
    edit: withSelect( ( select, props ) => {
        
        const 
            { attributes: { numberOfPosts, selectedCategory, titleBlock }, setAttributes } = props,
            defaultPostNumber = 4,
            [ paramsSpecialties, setParamsSpecialties ] = useState({
                per_page: numberOfPosts || defaultPostNumber    //  Peticion a la API REST WP de la cantidad de post que deseamos 
            });

        useEffect( () => {
            //  Usados para resolver el valor indefinido al iniciar el componente
            setAttributes({ numberOfPosts: defaultPostNumber });   
            setAttributes({ titleBlock: __( 'Title Block', 'plugin-lapizzeria-bkl' )});
        }, [] );

        console .log( 'numberOfPosts', numberOfPosts );
        console .log( 'selectedCategory', selectedCategory );
        console .log( 'titleBlock', titleBlock );
        console .log( 'params', paramsSpecialties );

        const onChangeNumberOfPublications = nPublications  => {
            console .log( nPublications );
            setAttributes({ numberOfPosts: nPublications } );

            /** Actualiza State */
            setParamsSpecialties({
                ...paramsSpecialties,                                       // Debemos agregar el estado actual 
                per_page: nPublications       // rest_base de la taxonomia (es decir: 'api-category-menu' es el endpoint de acceso)
            });
        }

        const onChangeCategory = ( selectedCategory ) => {
            console .log( selectedCategory );
            setAttributes({ selectedCategory } );
            
            if( selectedCategory == '' ) {
                /** Actualiza State */
                setParamsSpecialties({
                    ...paramsSpecialties,                                       // Debemos agregar el estado actual 
                    [ 'api-category-menu' ]: undefined       // rest_base de la taxonomia (es decir: 'api-category-menu' es el endpoint de acceso)
                });    

                return;
            }
            
            /** Actualiza State */
            setParamsSpecialties({
                ...paramsSpecialties,                                       // Debemos agregar el estado actual 
                [ 'api-category-menu' ]: parseInt( selectedCategory )       // rest_base de la taxonomia (es decir: 'api-category-menu' es el endpoint de acceso)
            });

            console .log( paramsSpecialties );

            return;
        }

        const onChangeTitleBlock = title => {
            console .log( title );
            setAttributes({ titleBlock: title } );
        }

        return {
            categories: select( 'core' ) .getEntityRecords( 'taxonomy', 'lapizzeria-category-menu' ),
            specialties: select( 'core' ) .getEntityRecords( 'postType', 'specialties', paramsSpecialties ),     
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

        let categoryList = [{ label: __( 'Loading...', 'plugin-lapizzeria-bkl' ), value: '' }];;

        console .log( specialties );
        console .log( categories );
        console .log( 'numberOfPosts', numberOfPosts );

        /** Verifica que existan categorias asociadas al post especialidades */
        if( categories ) {
            const optionDefault = [{ label: __( 'All', 'plugin-lapizzeria-bkl' ), value: '' }];

            /** Mapea la data para crear los valores del selector de categorias */
            const availableCategories = categories .map( category => {
                return {
                    label: category .name, 
                    value: category .id 
                }
            });

            categoryList = [ ...optionDefault, ...availableCategories ];
            console .log( categoryList );
            
        }

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
                            options={ categoryList }
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
