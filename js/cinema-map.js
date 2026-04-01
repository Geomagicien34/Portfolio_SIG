/**
 * ============================================
 * CINEMA-MAP.JS - Carte interactive des cinémas
 * Projet 2 - WebMapping
 * ============================================
 */

document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('map-cinemas');
    if (!mapContainer) return;

    const olScript = document.createElement('script');
    olScript.src = 'https://cdn.jsdelivr.net/npm/ol@10/dist/ol.js';
    olScript.onload = initMap;
    document.head.appendChild(olScript);

    function initMap() {
        const map = new ol.Map({
            target: 'map-cinemas',
            view: new ol.View({
                center: ol.proj.fromLonLat([2.3522, 46.2276]),
                zoom: 5
            }),
            controls: []
        });

        const osmLayer = new ol.layer.Tile({
            source: new ol.source.OSM({
                attributions: '© OpenStreetMap'
            })
        });
        map.addLayer(osmLayer);

        const menuOverlay = document.createElement('div');
        menuOverlay.className = 'map-menu-overlay';
        menuOverlay.innerHTML = `
            <h4>Cinémas de France</h4>
            <div class="map-menu-stats">
                <div class="map-menu-stat">
                    <span class="stat-value" id="cinema-count">...</span>
                    <span>établissements</span>
                </div>
            </div>
            <div class="map-controls">
                <button class="map-btn" onclick="mapZoomIn()">+</button>
                <button class="map-btn" onclick="mapZoomOut()">−</button>
                <button class="map-btn" onclick="centerOnFrance()">🏠</button>
            </div>
        `;
        mapContainer.appendChild(menuOverlay);

        const legend = document.createElement('div');
        legend.className = 'map-legend';
        legend.innerHTML = `
            <div class="map-legend-title">Légende</div>
            <div class="map-legend-item">
                <span class="legend-dot cinema"></span>
                <span>Commercial</span>
            </div>
            <div class="map-legend-item">
                <span class="legend-dot art-essay"></span>
                <span>Art & Essai</span>
            </div>
        `;
        mapContainer.appendChild(legend);

        const loading = document.createElement('div');
        loading.className = 'map-loading';
        loading.id = 'map-loading';
        loading.textContent = 'Chargement...';
        mapContainer.appendChild(loading);

        window.centerOnFrance = function() {
            map.getView().animate({ center: ol.proj.fromLonLat([2.3522, 46.2276]), zoom: 5, duration: 300 });
        };

        window.mapZoomIn = function() {
            const view = map.getView();
            const zoom = view.getZoom();
            view.animate({ zoom: zoom + 1, duration: 200 });
        };

        window.mapZoomOut = function() {
            const view = map.getView();
            const zoom = view.getZoom();
            view.animate({ zoom: zoom - 1, duration: 200 });
        };

        const pagePath = window.location.pathname;
        const depth = pagePath.includes('/en/') ? '../../' : '../';
        const geojsonPath = depth + 'data/etablissements-cinematographiques/etablissements-cinematographiques.geojson';

        fetch(geojsonPath)
            .then(response => {
                if (!response.ok) throw new Error('Erreur: ' + response.status);
                return response.json();
            })
            .then(geojsonData => {
                const geojsonFormat = new ol.format.GeoJSON({
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });

                const features = geojsonFormat.readFeatures(geojsonData);

                const styleCommercial = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({ color: '#8b5cf6' }),
                        stroke: new ol.style.Stroke({ color: '#ffffff', width: 1 })
                    })
                });

                const styleArtEssai = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({ color: '#22c55e' }),
                        stroke: new ol.style.Stroke({ color: '#ffffff', width: 1 })
                    })
                });

                const getStyle = function(feature) {
                    const ae = feature.get('ae');
                    return (ae === 'OUI') ? styleArtEssai : styleCommercial;
                };

                const vectorSource = new ol.source.Vector({ features: features });

                const vectorLayer = new ol.layer.Vector({
                    source: vectorSource,
                    style: getStyle
                });

                map.addLayer(vectorLayer);

                document.getElementById('cinema-count').textContent = features.length;
                loading.style.display = 'none';

                const popup = new ol.Overlay({
                    element: document.createElement('div'),
                    positioning: 'bottom-center',
                    offset: [0, -15]
                });
                popup.getElement().style.cssText = `
                    background: #1e2228;
                    border: 1px solid #30363d;
                    border-radius: 10px;
                    padding: 12px 16px;
                    color: #e6edf3;
                    font-size: 13px;
                    min-width: 200px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                `;
                map.addOverlay(popup);

                map.on('click', function(evt) {
                    const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);
                    if (feature) {
                        const props = feature.getProperties();
                        const nom = props.nom || 'Inconnu';
                        const commune = props.commune || '';
                        const dep = props.dep || '';
                        const ae = props.ae || '';

                        const couleur = (ae === 'OUI') ? '#22c55e' : '#8b5cf6';

                        popup.setPosition(evt.coordinate);
                        popup.getElement().innerHTML = `
                            <div style="font-weight:bold;color:${couleur};margin-bottom:6px;">${nom}</div>
                            <div style="color:#8b949e;font-size:12px;">${commune} (${dep})</div>
                        `;
                        popup.getElement().style.display = 'block';
                    } else {
                        popup.getElement().style.display = 'none';
                    }
                });
            })
            .catch(err => {
                loading.textContent = 'Erreur: ' + err.message;
            });
    }
});