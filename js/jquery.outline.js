/*!
 * jQuery Scrollspy Plugin
 * Author: @sxalexander，Lucien
 * Licensed under the MIT license
 */
;
(function ($, window, document, undefined) {

    $.fn.extend({
        scrollspy: function (options) {

            var defaults = {
                min: 0,
                max: 0,
                mode: 'vertical',
                namespace: 'scrollspy',
                buffer: 0,
                container: window,
                onEnter: [],
                onLeave: [],
                onTick: []
            }

            var options = $.extend({}, defaults, options);

            return this.each(function (i) {

                var element = this;
                var o = options;
                var $container = $(o.container);
                var mode = o.mode;
                var buffer = o.buffer;
                var enters = leaves = 0;
                var inside = false;

                /* add listener to container */
                $container.bind('scroll.' + o.namespace, function (e) {
                    var position = {top: $(this).scrollTop(), left: $(this).scrollLeft()};
                    var xy = (mode == 'vertical') ? position.top + buffer : position.left + buffer;
                    var max = o.max;
                    var min = o.min;

                    /* fix max */
                    if ($.isFunction(o.max)) {
                        max = o.max();
                    }

                    /* fix max */
                    if ($.isFunction(o.min)) {
                        min = o.min();
                    }

                    if (max == 0) {
                        max = (mode == 'vertical') ? $container.height() : $container.outerWidth() + $(element).outerWidth();
                    }

                    /* if we have reached the minimum bound but are below the max ... */
                    if (xy >= min && xy <= max) {
                        /* trigger enter event */
                        if (!inside) {
                            inside = true;
                            enters++;

                            /* fire enter event */
                            $(element).trigger('scrollEnter', {position: position})
                            if ($.isFunction(o.onEnter)) {
                                o.onEnter(element, position);
                            }

                        }

                        /* trigger tick event */
                        $(element).trigger('scrollTick', {
                            position: position,
                            inside: inside,
                            enters: enters,
                            leaves: leaves
                        })
                        if ($.isFunction(o.onTick)) {
                            o.onTick(element, position, inside, enters, leaves);
                        }
                    } else {

                        if (inside) {
                            inside = false;
                            leaves++;
                            /* trigger leave event */
                            $(element).trigger('scrollLeave', {position: position, leaves: leaves})

                            if ($.isFunction(o.onLeave)) {
                                o.onLeave(element, position);
                            }
                        }
                    }
                });

            });
        }

    })
})(jQuery, window, document, undefined);


/*!
 * jQuery outline Plugin
 * Author: @Lucien  etoahn@163.com
 */


;
(function ($) {
    "use strict";
    function createLink(idSuffix, text) {
        var link = document.createElement('a');
        link.href = '#outline_' + idSuffix;
        link.innerHTML = text;
        return link;
    }

    function createHeader(wrapDiv, element) {
        var header = document.createElement("h3");
        header.innerHTML = element.innerHTML;
        wrapDiv.appendChild(header);
    }

    function createOutline(id, elements, hasTitle) {
        var i = 0;//index of elements
        var content = $(id);
        var wrapDiv = content[0] || content;
        hasTitle && createHeader(wrapDiv, elements[i++]);

        var ul = document.createElement("ul");
        var len = elements.length;

        var li = document.createElement('li');
        var link = createLink(i, elements[i++].innerHTML);
        li.appendChild(link);
        ul.appendChild(li); //create first li element to compare

        for (; i < len; i++) {

            li = createElement(li, elements[i], elements[i - 1].nodeName, i)
        }

        wrapDiv.appendChild(ul);
        return wrapDiv;
    }

    function createElement(current, element, lastNodeName, index) {
        var link = createLink(index, element.innerHTML);
        var ul,
            li = document.createElement('li');
        li.appendChild(link);
        if (element.nodeName > lastNodeName)//eg. H3>H2
        {
            ul = document.createElement("ul");
            ul.appendChild(li);
            current.appendChild(ul);
        }
        else if (element.nodeName === lastNodeName) {
            current.parentNode.appendChild(li);
        }
        else {
            //当为ul时继续查找
            while (current.nodeName.toUpperCase() === 'UL' || (document.getElementById(current.firstChild.getAttribute('href').substring(1)).nodeName !== element.nodeName)) {
                if (current.parentNode) {
                    current = current.parentNode;
                }
                else {
                    //如果没有父节点，说明是顶层的ul，把当前元素置为顶层ul第一个子元素,方便插入
                    current = current.firstChild;
                    break;
                }

            }

            current.parentNode.appendChild(li);

        }
        return li;

    }

    function validate(option) {
        if (!option.contentSelector) {
            throw new TypeError("contentSelector is Required attribute");
        }
    }


    var ol = {
        outline: function (option) {

            validate(option);

            var option = $.extend({
                selector: 'body',  //css选择器，选择的范围
                hArray: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], //要识别的header
                addSpy: true,//是否添加滚动事件监听
                hasTitle: false, //范围内是否第一个是标题
                offset: 20 //偏离的位置
            }, option);

            var hSelector = option.hArray.join(',');
            var index = 0;

            //先生成outline,再在下一步添加监听
            $(option.selector).find(hSelector).each(function () {
                var id = 'outline_' + index++;
                this.setAttribute('id', id);
            });

            createOutline(option.contentSelector, $(option.selector).find(hSelector), option.hasTitle);
            if (option.addSpy) {
                $(option.selector).find(hSelector).each(function () {

                    //scrollspy
                    var $that = $(this);
                    var position = $that.position();
                    $that.scrollspy({

                        min: $that.offset().top - option.offset,
                        max: (function () {
                            var next = $that.nextAll(hSelector)[0];//下一个标题

                            return next ? $(next).offset().top : $that.offset().top;
                        })(),
                        onEnter: function (element, position) {
                            $('[href="#' + element.id + '"]').addClass("active-header");
                        },
                        onLeave: function (element, position) {
                            $('[href="#' + element.id + '"]').removeClass("active-header");
                        }
                    });
                });
            }

        }

    };


    $.extend(ol);


    /*data API*/

    if ($('[data-outline]')) {

        $.outline({contentSelector: '[data-outline]', selector: $('[data-outline]').data('outline')});

    }


})(jQuery);
/**
 * Created by Lucien on 7/14/2015.
 */


//$.outline({contentSelector:'#sub-outline',selector:'article',hasTitle:true});
