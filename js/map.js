/**
 * ============================================
 * MAP.JS - Carte OpenLayers Hero
 * ============================================
 */

// Attend que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // INITIALISATION DE LA CARTE
    // ============================================

    /** Crée la carte OpenStreetMap dans le hero */
    const mapHero = new ol.Map({
        target: 'map-hero',    // ID de l'élément HTML
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),  // Source OpenStreetMap
                opacity: 0.4                  // Opacité à 40%
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([2.3522, 48.8566]), // Centre sur Paris
            zoom: 6                                             // Zoom initial
        }),
        controls: [],       // Désactive les contrôles
        interactions: []     // Désactive les interactions
    });


    // ============================================
    // ANIMATION DE LA CARTE (Rotation lente)
    // ============================================

    let angle = 0;  // Angle de rotation

    // Met à jour la position toutes les 50ms
    setInterval(() => {
        // Incrémente l'angle pour la rotation
        angle += 0.0005;

        // Récupère la vue de la carte
        const view = mapHero.getView();
        const center = view.getCenter();

        // Calcule la nouvelle position avec rotation
        const newCenter = [
            center[0] + Math.cos(angle) * 1000,
            center[1] + Math.sin(angle) * 1000
        ];

        // Applique la nouvelle position
        view.setCenter(newCenter);
    }, 50);

});
