(function () {

    function DoorHan(doc) {
        var _self = this;

        _self.doc = doc;
        _self.window = window;

        _self.bootstrap();
    }


    DoorHan.prototype.bootstrap = function () {
        var _self = this;

        _self.bottomNotification({
            className: 'js-call-notification'
        });

        _self.citySearch();

        _self.popups({
            reachElementClass: '.js-popup',
            closePopupClass: '.js-close-popup',
            currentElementClass: '.js-open-popup',
            changePopupClass: '.js-change-popup'
        });

        _self.formValidate();

        _self.popover('.js-call-popover');
    };

    // Window load types (loading, dom, full)
    DoorHan.prototype.appLoad = function (type, callback) {
        var _self = this;

        switch (type) {
            case 'loading':
                if (_self.doc.readyState === 'loading') callback();

                break;
            case 'dom':
                _self.doc.onreadystatechange = function () {
                    if (_self.doc.readyState === 'complete') callback();
                };

                break;
            case 'full':
                _self.window.onload = function (e) {
                    callback(e);
                };

                break;
            default:
                callback();
        }
    };

    DoorHan.prototype.fileAttach = function (className) {
        $(className).each(function () {
            var _self = this;

            _self.el = $(this);
            _self.inputs = _self.el.find('input.js-attach-file__input');
            _self.inputsWrapper = _self.el.find('.js-attach-files__item');
            _self.uploaded = 0;
            _self.counter = _self.el.find('.js-attach-files__current');

            _self.total = _self.el.find('.js-attach-files__total');

            _self.setImage = function (el) {
                if (el.files && el.files[0] && window.FileReader) {
                    var _this = el;
                    var the_files = _this.files;
                    Object.keys(the_files).map(function (objectKey, index) {
                        var value = the_files[objectKey];
                        var input = _this;
                        var wrapper = $(input).closest('.js-attach-files__item');
                        var reader = new FileReader();

                        reader.onload = function (e) {
                            wrapper.append('' +
                                '<div class="attach-files__insert">' +
                                '<img class="attach-files__image" src="' + e.target.result + '" />' +
                                '<div class="js-attach-files__delete attach-files__delete icon-close"></div>' +
                                '</div>'
                            ).addClass('active');

                            setTimeout(function () {
                                _self.updateCounter();
                            }, 300);
                        };

                        reader.readAsDataURL(value);
                    });
                }
            };

            _self.removeImage = function () {
                $(document).on('click', '.js-attach-files__delete', function () {
                    $(this).closest('.js-attach-files__item').removeClass('active');
                    $(this).closest('.attach-files__insert').remove();

                    _self.updateCounter();
                });
            };

            _self.updateCounter = function () {
                _self.uploaded = _self.inputsWrapper.filter('.active').length;
                _self.counter.text(_self.uploaded);
            };

            _self.countInit = function () {
                var count = _self.inputsWrapper.filter(':visible').length;
                _self.total.text(count);
            };

            _self.bindings = function () {
                _self.countInit();

                _self.inputs.on('change', function (e) {
                    _self.setImage(this);
                });
                _self.removeImage();

                $(window).resize(function () {
                    _self.countInit();
                });
            };

            _self.init = function () {
                _self.bindings();
                _self.countInit();
            };

            _self.init();
        });

    };

    DoorHan.prototype.initSwitcher = function () {
        var _self = this;

        var switchers = _self.doc.querySelectorAll('[data-switcher]');

        if (switchers && switchers.length > 0) {
            for (var i = 0; i < switchers.length; i++) {
                var switcher = switchers[i],
                    switcherOptions = _self.options(switcher.dataset.switcher),
                    switcherElems = switcher.children,
                    switcherTargets = _self.doc.querySelector('[data-switcher-target="' + switcherOptions.target + '"]').children;

                for (var y = 0; y < switcherElems.length; y++) {
                    var switcherElem = switcherElems[y],
                        parentNode = switcher.children,
                        switcherTarget = switcherTargets[y];

                    if (switcherElem.classList.contains('active')) {
                        for (var z = 0; z < parentNode.length; z++) {
                            parentNode[z].classList.remove('active');
                            switcherTargets[z].classList.remove('active');
                        }
                        switcherElem.classList.add('active');
                        switcherTarget.classList.add('active');
                    }

                    switcherElem.children[0].addEventListener('click', function (elem, target, parent, targets) {
                        return function (e) {
                            e.preventDefault();
                            if (!elem.classList.contains('active')) {
                                for (var z = 0; z < parentNode.length; z++) {
                                    parent[z].classList.remove('active');
                                    targets[z].classList.remove('active');
                                }
                                elem.classList.add('active');
                                target.classList.add('active');
                            }
                        };

                    }(switcherElem, switcherTarget, parentNode, switcherTargets));
                }
            }
        }
    };

    DoorHan.prototype.str2json = function (str, notevil) {
        try {
            if (notevil) {
                return JSON.parse(str
                    .replace(/([\$\w]+)\s*:/g, function (_, $1) {
                        return '"' + $1 + '":';
                    })
                    .replace(/'([^']+)'/g, function (_, $1) {
                        return '"' + $1 + '"';
                    })
                );
            } else {
                return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
            }
        } catch (e) {
            return false;
        }
    };

    DoorHan.prototype.options = function (string) {
        var _self = this;

        if (typeof string != 'string') return string;

        if (string.indexOf(':') != -1 && string.trim().substr(-1) != '}') {
            string = '{' + string + '}';
        }

        var start = (string ? string.indexOf("{") : -1), options = {};

        if (start != -1) {
            try {
                options = _self.str2json(string.substr(start));
            } catch (e) {
            }
        }

        return options;
    };


    DoorHan.prototype.ChooseAll = function (options) {
        var defaults = {
            AllButton: '.js-checkbox-all',
            SingleButton: '.js-checkbox-single',
            Wrapper: '.js-checkbox-wrapper'
        };

        options = $.extend({}, options, defaults);

        var plugin = {
            AllButton: $(options.AllButton),
            SingleButton: $(options.SingleButton),
            Wrapper: $(options.Wrapper)
        };

        plugin.ClickAll = function () {
            if (plugin.AllButton.prop('checked')) {
                plugin.SingleButton.prop("checked", true);
            } else {
                plugin.SingleButton.prop("checked", false);
            }
        };

        plugin.ClickSingle = function () {
            var AllElem = plugin.Wrapper.find(plugin.SingleButton).length,
                NumChecked = plugin.Wrapper.find(plugin.SingleButton).filter(':checked').length;

            if (NumChecked == AllElem) {
                plugin.AllButton.prop("checked", true);
            } else {
                plugin.AllButton.prop("checked", false);
            }
        };

        plugin.init = function () {
            plugin.bindings();
        };

        plugin.bindings = function () {
            plugin.AllButton.on('click', function () {
                plugin.ClickAll();
            });

            plugin.SingleButton.on('click', function () {
                plugin.ClickSingle();
            });
        };

        if (options)
            plugin.init();

        return plugin;
    };

    DoorHan.prototype.SearchDefault = function (options) {
        var defaults = {
            AllButton: '.js-checkbox-all',
            SingleButton: '.js-checkbox-single',
            Wrapper: '.js-checkbox-wrapper'
        };

        options = $.extend({}, options, defaults);

        var plugin = {
            AllButton: $(options.AllButton),
            SingleButton: $(options.SingleButton),
            Wrapper: $(options.Wrapper)
        };

        plugin.ClickAll = function () {
            if (plugin.AllButton.prop('checked')) {
                plugin.SingleButton.prop("checked", true);
            } else {
                plugin.SingleButton.prop("checked", false);
            }
        };

        plugin.ClickSingle = function () {
            var AllElem = plugin.Wrapper.find(plugin.SingleButton).length,
                NumChecked = plugin.Wrapper.find(plugin.SingleButton).filter(':checked').length;

            if (NumChecked == AllElem) {
                plugin.AllButton.prop("checked", true);
            } else {
                plugin.AllButton.prop("checked", false);
            }
        };

        plugin.init = function () {
            plugin.bindings();
        };

        plugin.bindings = function () {
            plugin.AllButton.on('click', function (e) {
                plugin.ClickAll();
            });

            plugin.SingleButton.on('click', function (e) {
                plugin.ClickSingle();
            });
        };

        if (options)
            plugin.init();

        return plugin;
    };

    var scrollSettings = getBrowserScrollSize();

    function getBrowserScrollSize() {
        var css = {
            "border": "none",
            "height": "200px",
            "margin": "0",
            "padding": "0",
            "width": "200px"
        };

        var inner = $("<div>").css($.extend({}, css));
        var outer = $("<div>").css($.extend({
            "left": "-1000px",
            "overflow": "scroll",
            "position": "absolute",
            "top": "-1000px"
        }, css)).append(inner).appendTo("body")
            .scrollLeft(1000)
            .scrollTop(1000);

        var scrollSize = {
            "height": (outer.offset().top - inner.offset().top) || 0,
            "width": (outer.offset().left - inner.offset().left) || 0
        };

        outer.remove();
        return scrollSize;
    }

    DoorHan.prototype.popups = function (options) {
        var _self = this;

        var defaults = {
            reachElementClass: '.js-popup',
            closePopupClass: '.js-close-popup',
            currentElementClass: '.js-open-popup',
            changePopupClass: '.js-change-popup'
        };

        options = $.extend({}, options, defaults);

        var plugin = {
            reachPopups: $(options.reachElementClass),
            bodyEl: $('body'),
            topPanelEl: $('.top-panel-wrapper'),
            htmlEl: $('html'),
            closePopupEl: $(options.closePopupClass),
            openPopupEl: $(options.currentElementClass),
            changePopupEl: $(options.changePopupClass),
            bodyPos: 0
        };

        plugin.openPopup = function (popupName) {
            plugin.closePopup();
            plugin.reachPopups.filter('[data-popup="' + popupName + '"]').addClass('opened');
            plugin.bodyEl.css('overflow-y', 'scroll');
            plugin.topPanelEl.css('padding-right', scrollSettings.width);
            plugin.htmlEl.addClass('popup-opened');

        };

        plugin.closePopup = function (popupName) {
            if (popupName) {
                plugin.reachPopups.filter('[data-popup="' + popupName + '"]').removeClass('opened');
                setTimeout(function () {
                    plugin.bodyEl.removeAttr('style');
                    plugin.htmlEl.removeClass('popup-opened');
                    plugin.topPanelEl.removeAttr('style');
                }, 500);
            } else {
                plugin.reachPopups.filter('[data-popup]').removeClass('opened');
            }
        };

        // plugin.changePopup = function (closingPopup, openingPopup) {
        //     plugin.reachPopups.filter('[data-popup="' + closingPopup + '"]').removeClass('opened');
        //     plugin.openPopup(openingPopup);
        // };

        plugin.init = function () {
            plugin.bindings();
        };

        plugin.bindings = function () {
            plugin.openPopupEl.on('click', function (e) {
                e.preventDefault();
                var pop = $(this).attr('data-open-popup');
                plugin.openPopupEl.removeClass("active");
                $(this).addClass("active");
                plugin.openPopup(pop);
            });

            plugin.closePopupEl.on('click', function (e) {
                var pop;
                if (this.hasAttribute('data-close-popup')) {
                    pop = $(this).attr('data-close-popup');
                } else {
                    pop = $(this).closest(options.reachElementClass).attr('data-popup');
                }
                plugin.openPopupEl.removeClass("active");
                plugin.closePopup(pop);
            });

            // plugin.changePopupEl.on('click', function (e) {
            //     var closingPop = $(this).attr('data-closing-popup');
            //     var openingPop = $(this).attr('data-opening-popup');
            //
            //     plugin.changePopup(closingPop, openingPop);
            // });

            plugin.reachPopups.on('click', function (e) {
                var target = $(e.target);
                var className = options.reachElementClass.replace('.', '');
                if (target.hasClass(className)) {
                    plugin.closePopup($(e.target).attr('data-popup'));
                }
            });
        };

        if (options)
            plugin.init();

        return plugin;
    };

    DoorHan.prototype.citySearch = function () {
        var countries = [
            {value: 'Andorra', data: 'AD'},
            {value: 'Zimbabwe', data: 'ZZ'}
        ];

        $('.js-cities-autocomplete').autocomplete({
            lookup: countries
        });
    };

    DoorHan.prototype.bottomNotification = function (params) {
        var _self = this;
        var plugin = {};

        plugin.init = function () {
            plugin.bindings();
        };

        plugin.openNote = function (el) {
            el.classList.add('popup-notification_active');

            plugin.closeNote(el);
        };

        plugin.closeNote = function (el) {
            setTimeout(function () {
                el.classList.remove('popup-notification_active');
            }, 3000);
        };

        plugin.bindings = function () {
            var elements = _self.doc.getElementsByClassName(params.className);

            for (var i = 0; i < elements.length; i++) {
                elements[i].onclick = function () {
                    _self.popups().closePopup('order-call');

                    var element = _self.doc.querySelectorAll('[data-notification="' + this.getAttribute('data-call-notification') + '"]');
                    plugin.openNote(element[0]);
                }
            }
        };

        if (params)
            plugin.init();

        return plugin;
    };

    DoorHan.prototype.formValidate = function () {
        var _self = this;

        var forms = {};

        forms.scope = _self.doc.querySelectorAll('form.js-validate-form');

        forms.updateButton = function (form, button) {
            if (form.querySelectorAll('.field-error[required]').length > 0) {
                button.setAttribute('disabled', true);
            } else {
                button.removeAttribute('disabled');
            }
        };

        forms.check = function (form, button) {
            var inputs = form.querySelectorAll('[required]');

            for (z = 0; z < inputs.length; z++) {
                var input = inputs[z];

                if (input.value == '') {
                    input.classList.add('field-error');
                } else {
                    input.classList.remove('field-error');
                }
            }

            if(inputs.length > 0)
                forms.updateButton(form, button);
        };

        forms.init = function () {
            for (i = 0; i < forms.scope.length; i++) {
                var form = forms.scope[i];

                var button = form.querySelector('[type="submit"]');

                var inputs = form.querySelectorAll('[required]');

                forms.check(form, button);

                for (z = 0; z < inputs.length; z++) {
                    var input = inputs[i];
                    input.addEventListener('keyup', function (e) {
                        forms.check(form, button);
                    });
                }
            }
        };

        forms.init();

        return forms;
    };

    DoorHan.prototype.popover = function (element) {
        $(element).popover({
            placement: 'bottom',
            trigger: 'hover',
            content: '',
            container: 'body'
        });
    };

    DoorHan.prototype.headerFix = function () {
        var _self = this;

        var plugin = {
            placeholder: _self.doc.getElementsByClassName('js-top-panel-placeholder')[0],
            wrapper: _self.doc.getElementsByClassName('top-panel-wrapper')[0]
        };

        plugin.init = function () {
            plugin.checkSize();
        };

        plugin.checkSize = function () {
            plugin.placeholder.style.height = plugin.wrapper.offsetHeight + 'px';
            plugin.makeFix();
        };

        plugin.makeFix = function () {
            plugin.wrapper.classList.add('fixed');
        };

        window.onresize = function () {
            plugin.checkSize();
        };

        plugin.init();

        return plugin;
    };

    DoorHan.prototype.toggleBlocks = function (hide, show) {
        $(hide).hide();
        $(show).show();
    };

    var app = new DoorHan(document);

    app.appLoad('loading', function () {
        //console.log('App is loading... Paste your app code here.');
        // App is loading... Paste your app code here. 4example u can run preloader event here and stop it in action appLoad dom or full

    });

    app.headerFix();

    app.appLoad('dom', function () {
        //console.log('DOM is loaded! Paste your app code here (Pure JS code).');
        // DOM is loaded! Paste your app code here (Pure JS code).
        // Do not use jQuery here cause external libs do not loads here...

        app.initSwitcher(); // data-switcher="{target='anything'}" , data-switcher-target="anything"
    });

    app.appLoad('full', function (e) {
        //console.log('App was fully load! Paste external app source code here... For example if your use jQuery and something else');

        if ($('[data-colorbox]').length) {
            $('[data-colorbox]').fancybox();
        }


        app.fileAttach('.js-attach-files');
        // new app.toggleBlocks('.js-auth-step-1-trigger');

        // submission form auth

        $('.js-auth-step-1 .popup-form').submit(function (e) {
            e.preventDefault();
            app.toggleBlocks('.js-auth-step-1', '.js-auth-step-2');
        });

        $(".js-search-submit").click(function(e) {
             var    form = $(this).closest(".js-search-form"),
                    popup = form.find('.js-search-popup'),
                    input = form.find(".js-search-input"),
                    value_input = input.val(),
                    opened = popup.hasClass('opened');

            if (opened === false) {
                e.preventDefault();
                popup.addClass('opened');
            } else if ((value_input == '') && (opened === true)) {
                e.preventDefault();
                popup.removeClass('opened');
            }
        });


        $(document).click(function (e) {
            var target = $(e.target),
                search_form = target.closest('.js-search-form');

            if (!search_form.length) {
                $(".js-search-popup").removeClass('opened');
            }
        });


        app.ChooseAll({
            AllButton: '.js-checkbox-all',
            SingleButton: '.js-checkbox-single',
            Wrapper: '.js-checkbox-wrapper'
        });

        if (typeof fancybox == 'function') {
            $('[data-colorbox]').fancybox('group: 1');
        }

        $(".st-select").selectpicker();

        $(".js-tab-toggle").click(function (e) {
            e.preventDefault();
            var TabData = $(this).data('tab-toggle'),
                thisContainer = $(this).closest(".js-tabs");


            thisContainer.find(".js-tab").removeClass("active");
            thisContainer.find(".js-tab-toggle").removeClass("active");

            $(this).addClass("active");
            thisContainer.find(".js-tab[data-tab=" + TabData + "]").addClass("active");
        });

        var jsSliders = $('.js-slider-result');

        jsSliders.on('focusin', function () {
            $(this).closest('.js-slider').addClass('active');
        });

        jsSliders.on('focusout', function () {
            $(this).closest('.js-slider').removeClass('active');
        });

        $('.js-inputmask, .js-inputmask-phone').mask("+7 (999) 999-99-99");


        // App.accordion = function (el) {
        //     $(el).each(function () {
        //         var $this = $(this);
        //
        //         var checkbox = $this.find(".js-accordion__checkbox:checked");
        //
        //         checkbox.closest(".js-accordion-item").addClass("opened");
        //         console.log(checkbox);
        //
        //         $this.find(".js-accordion-item__toggle").click(function(e){
        //             e.preventDefault();
        //             var parentItem = $(this).closest(".js-accordion-item");
        //             parentItem.toggleClass("opened");
        //             parentItem.find('.js-accordion__checkbox').trigger("click");
        //         });
        //     });
        // };
        //
        // App.accordion(".js-accordion");


        $(".js-color-palette__radio").click(function () {
            var this_palette = $(this).closest(".js-color-palette"),
                click_name = $(this).attr('title');

            this_palette.find(".js-color-palette__selected").text(click_name);
        });

        $(".js-slider").each(function () {
            var slider = $(this).find(".js-slider-main"),
                sliderValue = $(this).find(".js-slider-result"),
                sliderResult = $(this).find(".js-slider-result"),
                thisVal = slider.data('slider-value');


            slider.slider();
            sliderValue.val(thisVal);

            slider.on("slide", function (slideEvt) {
                sliderValue.val(slideEvt.value);
            });

            sliderResult.keyup(function () {
                var this_val = $(this).val();

                slider.slider('setValue', this_val);

            });

        });

        var guarantees_init = false;

        function guaranteesCarousel() {
            var owl = $('.guarantees__carousel');
            if ($(window).width() <= 768 && !guarantees_init) {
                owl.owlCarousel({
                    items: 1,
                    nav: true,
                    dots: false,
                    autoHeight: true
                }).addClass('owl-carousel');

                guarantees_init = true;
            } else if ($(window).width() > 768 && guarantees_init) {
                owl.trigger('destroy.owl.carousel').removeClass('owl-carousel');
                guarantees_init = false;
            } else {

            }
        }

        var certificates_init = false;

        function certificatesCarousel() {
            var owl = $('.certificates__carousel');
            if ($(window).width() <= 768 && !certificates_init) {
                owl.owlCarousel({
                    items: 4,
                    nav: true,
                    dots: false,
                    // autoHeight: true,
                    margin: 15,
                    responsive: {
                        0: {
                            items: 2
                        },
                        480: {
                            items: 3
                        }
                    }
                }).addClass('owl-carousel');
                certificates_init = true;
            } else if ($(window).width() > 768 && certificates_init) {
                owl.trigger('destroy.owl.carousel').removeClass('owl-carousel');
                certificates_init = false;
            }
        }

        $(window).resize(function () {
            guaranteesCarousel();
            certificatesCarousel();
        });

        guaranteesCarousel();
        certificatesCarousel();

        // App was fully load! Paste external app source code here... 4example if your use jQuery and something else
        // Please do not use jQuery ready state function to avoid mass calling document event trigger!


    });

})();