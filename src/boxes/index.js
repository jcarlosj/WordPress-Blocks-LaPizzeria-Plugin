const 
    { registerBlockType } = wp.blocks,
    { __ } = wp.i18n,
    { useBlockProps, InspectorControls, ColorPalette, RichText } = wp.blockEditor,       /** Paso 1: Importar el/los componentes que se utilizarán. */
    { PanelBody, PanelRow } = wp.components;

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
    attributes: {   /** Paso 4: Registra el atributo */
        title : {
            type: 'string',
            source: 'html',
            selector: '.box h2'
        },
        text : {
            type: 'string',
            source: 'html',
            selector: '.box p'
        },
        bgColor : {
            type: 'string'
        }
    },
    edit: ( props ) => {    /** Paso 4: Se obtienen los props destructurados */
        console .log( props );
        
        const 
            blockProps = useBlockProps( { className: 'box' } ),
            { attributes: { title, text, bgColor }, setAttributes } = props;    /** Paso 5: Extraer el contenido de los props (Destructurando) */

        /** Paso 3: Crear la función que lea los contenidos. */
        const onChangeTitle = ( newTitle ) => {
            console .log( newTitle );
            setAttributes( { title: newTitle } );    /** Paso 6: Guardar el contenido con setAttributes() */
        }
        const onChangeText = ( text ) => {
            console .log( text );
            setAttributes( { text } );    /** Paso 6: Guardar el contenido con setAttributes() */
        }
        const onChangeBackgroundColor = ( bgColor ) => {
            console .log( bgColor );
            setAttributes( { bgColor });
        }

        return (
            <>
                <InspectorControls>
                    <PanelBody
                        title={ __( 'Background color', 'plugin-lapizzeria-bkl' ) }
                        initialOpen={ true }    /** Solo se permite que un panel abra automaticamente */
                    >
                        <PanelRow>{ __( 'Select background color', 'plugin-lapizzeria-bkl' ) }</PanelRow>
                        <ColorPalette 
                            onChange={ onChangeBackgroundColor }
                            value={ bgColor }
                        />
                    </PanelBody>
                </InspectorControls>
                <div { ...blockProps } style={{ backgroundColor: bgColor }}>
                    <h2>
                        <RichText 
                            value={ title }         /** Hará que el campo siempre tenga el valor actual del campo */
                            placeholder={ __( 'Add the title', 'plugin-lapizzeria-bkl' ) }  /** Paso 2: Colocar el/los componentes donde se desean usar. (Mostrar este texto antes de que el usuario haya agregado contenido) */  
                            onChange={ onChangeTitle }                                       /** Paso 3: Enlaza función que lee los contenidos del campo RichText. */
                            // onChange={ ( content ) => setAttributes( { content } ) }      /** Abrevia pasos 3 y 4 */
                        />
                    </h2>
                    <p>
                        <RichText 
                            value={ text }         /** Hará que el campo siempre tenga el valor actual del campo */
                            placeholder={ __( 'Add the text', 'plugin-lapizzeria-bkl' ) }  /** Paso 2: Colocar el/los componentes donde se desean usar. (Mostrar este texto antes de que el usuario haya agregado contenido) */  
                            onChange={ onChangeText }                                       /** Paso 3: Enlaza función que lee los contenidos del campo RichText. */
                            // onChange={ ( content ) => setAttributes( { content } ) }      /** Abrevia pasos 3 y 4 */
                        />
                    </p>
                </div>
            </>
        )
    },
    save: ( props ) => {    /** Paso 7: Leer los contenidos que deseamos guardar usando save(). (Muestra lo que a guardado la BD) */
        console .log( props );
        
        const 
            blockProps = useBlockProps .save(), 
            { attributes: { title, text, bgColor } } = props;    /** Paso 5: Extraer el contenido de los props (Destructurando) */
    
        return (
            <div { ...blockProps } style={{ backgroundColor: bgColor }}>
                <h2>
                    <RichText .Content
                        value={ title }
                    />
                </h2>
                <p>
                    <RichText .Content
                        value={ text }
                    />
                </p>
            </div>
        )
    },
} );
