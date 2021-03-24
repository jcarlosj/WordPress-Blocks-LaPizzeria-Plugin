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

/** Regista Bloques */
function lapizzeria_block_register() {
    # Valida si Gutenberg NO esta disponible
    if( !function_exists( 'register_block_type' ) ) {
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
            'wp-edit-block',            # Exclusivamente para el editor de bloques
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
}
add_action( 'init', 'lapizzeria_block_register' );