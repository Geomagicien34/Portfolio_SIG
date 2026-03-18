document.addEventListener('DOMContentLoaded', () => {
    const mapHero = new ol.Map({
        target: 'map-hero',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
                opacity: 0.4
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([2.3522, 48.8566]),
            zoom: 6
        }),
        controls: [],
        interactions: []
    });
    
    let angle = 0;
    setInterval(() => {
        angle += 0.0005;
        const view = mapHero.getView();
        const center = view.getCenter();
        const newCenter = [
            center[0] + Math.cos(angle) * 1000,
            center[1] + Math.sin(angle) * 1000
        ];
        view.setCenter(newCenter);
    }, 50);
});