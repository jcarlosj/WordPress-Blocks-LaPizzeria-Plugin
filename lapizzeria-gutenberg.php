<?php
/**
 * Plugin Name:       La Pizzeria Gutenberg Blocks
 * Plugin URI:        
 * Description:       Bloques nativos de Gutenberg para La Pizzería
 * Version:           1.0.0
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Juan Carlos Jiménez Gutiérrez
 * Author URI:        https://github.com/jcarlosj
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       plugin-lapizzeria-bkl
*/

if( ! defined( 'ABSPATH' ) )  exit;     //  Evita acceso al codigo del plugin

/** Crea nueva categoría de bloques y agrega a las categorías existentes */
function lapizzeria_block_category_register( $categories, $current_post ) {
    return array_merge(
        $categories,
        [
            [
                'slug'  => 'lapizzeria',
                'title' =>  __( 'La Pizzería', 'plugin-lapizzeria-bkl' ),
                'description' =>  __( 'Blocks for the theme \'La Pizzeria\' ', 'plugin-lapizzeria-bkl' ),
                'icon'  => 'store'  # Dashicons
            ]
        ]
    );
}
add_filter( 'block_categories', 'lapizzeria_block_category_register', 10, 2 );      # Prioridad 10, Parametros a la funcion 2

/** Regista Bloques */
function lapizzeria_block_register() {
    # Valida si Gutenberg NO esta disponible
    if( ! function_exists( 'register_block_type' ) ) {
        return;
    }

    # Registra archivo de acceso a bloques en Gutenberg
    wp_register_script(
        'lapizzeria-editor-script',                     # Handle: Debe tener un nombre unico
        plugins_url( 'build/index.js' , __FILE__ ),     # File: Archivo que contiene los bloques
        [                                               # Dependencies: Librerias requeridas para la creacion de bloques
            'wp-blocks',            # Para definir nuestros bloques
            'wp-i18n',              # Para traducir nuestros bloques
            'wp-element',           # Contiene elementos de Gutenberg
            'wp-editor'             # Editor Gutenberg 
        ],
        filemtime( plugin_dir_path( __FILE__ ). 'build/index.js' )  # Version: Ultima version generada el archivo
    );

    # Registra archivo de acceso a Hoja de Estilos para Gutenberg (unicamente para el editor)
    wp_register_style(
        'lapizzeria-editor-style',                      # Handle: Debe tener un nombre unico
        plugins_url( 'build/editor.css' , __FILE__ ),   # File: Archivo que contiene hojas de estilo para los bloques en el editor
        [                                               # Dependencies: Librerias requeridas para la creacion de bloques
            'wp-edit-blocks',           # Exclusivamente para el editor de bloques
        ],
        filemtime( plugin_dir_path( __FILE__ ). 'build/editor.css' )  # Version: Ultima version generada el archivo
    );

    # Registra archivo de acceso a Hoja de Estilos (BackEnd & FrontEnd)
    wp_register_style(
        'lapizzeria-backfront-style',                   # Handle: Debe tener un nombre unico
        plugins_url( 'build/styles.css' , __FILE__ ),   # File: Archivo que contiene hojas de estilo para los bloques en el BackEnd y el en FrontEnd
        [],                                             # Dependencies: Librerias requeridas (Ej: jQuery entre muchas otras)
        filemtime( plugin_dir_path( __FILE__ ). 'build/styles.css' )  # Version: Ultima version generada el archivo
    );

    /** Define listado de bloques del Plugin */
    $blocks = [
        'lapizzeria/block-boxes'
    ];

    /** Recorre listado de bloques para agregar scritps y hojas de estilo registradas a WordPress */
    foreach( $blocks as $block ) {
        /** Registra un tipo de bloque.
         *  Equivale al wp_enqueue_style o wp_enqueue_script de un bloque */
        register_block_type(
            $block,     # Block name
            [           # Argumentos del tipo de bloque
                'editor_script' => 'lapizzeria-editor-script',      # Scripts para el editor
                'editor_style'  => 'lapizzeria-editor-style',       # Hoja de Estilos para el editor
                'style'         => 'lapizzeria-backfront-style'     # Hoja de Estilos compartida para el FrontEnd y el BackEnd
            ]
        );
    }

}
add_action( 'init', 'lapizzeria_block_register' );
