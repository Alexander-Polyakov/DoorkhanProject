if (document.getElementsByClassName('js-contacts-map').length > 0) {
    ymaps.ready(init);
    var myMap;

    function init() {
        var MyMapClass = document.getElementsByClassName("js-contacts-map")[0];
        myMap = new ymaps.Map(MyMapClass, {
            center: [54.815923069880974, 31.97855099999989],
            zoom: 17,
            controls: ['zoomControl']
        });

        marker = new ymaps.Placemark([54.815923069880974, 31.97855099999989], {
            /*hintContent: 'Собственный значок метки',
             balloonContent: 'Это красивая метка'*/
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'images/placemark.png',
            // Размеры метки.
            iconImageSize: [41, 55],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-20, -55]
        });

        myMap.geoObjects.add(marker);
    }
}