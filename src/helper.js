/**
 * Saber UI
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 控件基类helper方法模块
 * @author zfkun(zfkun@msn.com)
 */

define(function ( require ) {

    var ui = require( 'saber-ui' );
    var dom = require( 'saber-dom' );

    /**
     * 控件基类helper方法模块
     * 
     * @exports helper
     * @requires ui
     * @requires dom
     */
    var helper = {};


    /**
     * GUID生成基数
     * 
     * @inner
     * @type {number}
     */
    var counter = 0x861005;

    /**
     * 生成全局唯一id
     * 
     * @public
     * @param {string=} prefix 前缀
     * @return {string} 新唯一id字符串
     */
    helper.getGUID = function ( prefix ) {
        prefix = prefix || 'ui';
        return prefix + counter++;
    };

    /**
     * 获取用于控件dom元素的id
     * 
     * @public
     * @param {Control} control 控件实例
     * @return {string} 
     */
    helper.getId = function ( control ) {
        var prefix = control.domIDPrefix
            ? control.domIDPrefix + '-'
            : '';

        return ui.getConfig( 'idAttrPrefix' ) + '-'
            + prefix
            + control.id;
    };

    /**
     * 销毁控件
     * 
     * @public
     * @param {Control} control 控件实例
     */
    helper.dispose = function ( control ) {
        var child;
        while ( ( child = control.children.pop() ) ) {
            child.dispose();
        }

        // 清理子控件存储器
        control.children = null;

        // 清理DOM事件绑定
        helper.clearDOMEvents( control );

        // 若存在父控件，则从父控件树中移除
        if ( control.parent ) {
            control.parent.removeChild( control );
        }

        // 删除实例存储
        ui.remove( control );
    };





    /**
     * 获取控件用于生成css class的类型
     * 
     * @inner
     * @param {Control} control 控件实例
     * @return {string}
     */
    function getControlClassType( control ) {
        return control.type.toLowerCase();
    }

    /**
     * 将参数用`-`连接成字符串
     * 
     * @inner
     * @param {...string} var_args 待连接的字符串组
     * @return {string} 连接后的合成字符串
     */
    function joinByStrike() {
        return [].slice.call( arguments ).join( '-' );
    }

    /**
     * 批量添加class到目标元素
     * 
     * @inner
     * @param {HTMLElement} element 目标元素
     * @param {Array} classes 待添加的class数组
     */
    function addClasses( element, classes ) {
        classes.forEach(
            function ( cls ) {
                dom.addClass( this, cls );
            },
            element
        );
    }

    /**
     * 批量删除目标元素的class
     * 
     * @inner
     * @param {HTMLElement} element 目标元素
     * @param {Array} classes 待删除的class数组
     */
    function removeClasses( element, classes ) {
        classes.forEach(
            function ( cls ) {
                dom.removeClass( this, cls );
            },
            element
        );
    }

    /**
     * 获取控件相关的class数组
     * 
     * @public
     * @param {Control} control 控件实例
     * @return {Array.<string>}
     */
    helper.getClasses = function ( control ) {
        // main:
        //   ui-{commonCls} 为了定义有限全局的normalize
        //   ui-{type}
        //   skin-{skinname}
        //   skin-{skinname}-{type}

        var type = getControlClassType( control );
        var skin = control.skin;
        var prefix = ui.getConfig( 'uiClassPrefix' );
        var skinPrefix = ui.getConfig( 'skinClassPrefix' );
        var commonCls = ui.getConfig( 'uiClassControl' );
        var classes = [
            joinByStrike( prefix, commonCls ),
            joinByStrike( prefix, type )
        ];

        if ( skin ) {
            classes.push(
                joinByStrike( skinPrefix, skin ),
                joinByStrike( skinPrefix, skin, type )
            );
        }

        return classes;
    };

    /**
     * 添加控件相关的class
     * 
     * @public
     * @param {Control} control 控件实例
     */
    helper.addClasses = function ( control ) {
        if ( control.main ) {
            addClasses( control.main, helper.getClasses( control ) );
        }
    };

    /**
     * 移除控件相关的class
     * 
     * @public
     * @param {Control} control 控件实例
     */
    helper.removeClasses = function ( control ) {
        if ( control.main ) {
            removeClasses( control.main, helper.getClasses( control ) );
        }
    };

    /**
     * 获取控件状态相关的class数组
     * 
     * @public
     * @param {Control} control 控件实例
     * @param {string} state 状态名称
     * @return {Array.<string>}
     */
    helper.getStateClasses = function ( control, state ) {
        // ui-{type}-{statename}
        // state-{statename}
        // skin-{skinname}-{statename}
        // skin-{skinname}-{type}-{statename}

        var type = getControlClassType( control );
        var classes = [
            joinByStrike( ui.getConfig( 'uiClassPrefix' ), type, state ),
            joinByStrike( ui.getConfig( 'stateClassPrefix' ), state )
        ];

        var skin = control.skin;
        if ( skin ) {
            var skinPrefix = ui.getConfig( 'skinClassPrefix' );
            classes.push(
                joinByStrike( skinPrefix, skin, state ),
                joinByStrike( skinPrefix, skin, type, state )
            );
        }

        return classes;
    };

    /**
     * 添加控件状态相关的class
     * 
     * @public
     * @param {Control} control 控件实例
     * @param {string} state 状态名称
     */
    helper.addStateClasses = function ( control, state ) {
        if ( control.main ) {
            addClasses( control.main, helper.getStateClasses( control, state ) );
        }
    };

    /**
     * 移除控件状态相关的class
     * 
     * @public
     * @param {Control} control 控件实例
     * @param {string} state 状态名称
     */
    helper.removeStateClasses = function ( control, state ) {
        if ( control.main ) {
            removeClasses( control.main, helper.getStateClasses( control, state ) );
        }
    };




    /**
     * DOM事件存储器键值
     * 紧为控件管理的DOM元素使用，存储在控件实例上
     * 
     * @type {string}
     */
    var domEventsKey = '_uiDOMEvent';

    /**
     * 检查元素是否属于全局事件范围的目标元素
     * 
     * @param {HTMLElement} element 待检查元素
     * @return {boolean}
     */
    function isGlobalEvent( element ) {
        return element === window
            || element === document
            || element === document.documentElement
            || element === document.body;
    }

    /**
     * 为控件管理的DOM元素添加DOM事件
     * 
     * @public
     * @param {Control} control 控件实例
     * @param {HTMLElement} element 需要添加事件的DOM元素
     * @param {string} type 事件的类型
     * @param {function} handler 事件处理函数
     */
    helper.addDOMEvent = function ( control, element, type, handler ) {
        if ( !control.domEvents ) {
            control.domEvents = {};
        }

        var guid = element[ domEventsKey ];
        if ( !guid ) {
            guid = element[ domEventsKey ] = helper.getGUID();
        }

        var events = control.domEvents[ guid ];
        if ( !events ) {
            // `events`中的键都是事件的名称，仅`element`除外，
            // 因为DOM上没有`element`这个事件，所以这里占用一下没关系
            events = control.domEvents[ guid ] = { element: element };
        }

        // var isGlobal = isGlobalEvent( element );
        var listeners = events[ type ];
        if ( !listeners ) {
            listeners = events[ type ] = [];
        }

        element.addEventListener( type, handler, false );

        listeners.push( handler );
    };

    /**
     * 为控件管理的DOM元素移除DOM事件
     * 
     * @public
     * @param {Control} control 控件实例
     * @param {HTMLElement} element 需要删除事件的DOM元素
     * @param {string} type 事件的类型
     * @param {Function=} handler 事件处理函数
     * 如果没有此参数则移除该控件管理的元素的所有`type`DOM事件
     */
    helper.removeDOMEvent = function ( control, element, type, handler ) {
        if ( !control.domEvents ) {
            return;
        }

        var events = control.domEvents[ element[ domEventsKey ] ];

        if ( !events || !events[ type ] ) {
            return;
        }

        events[ type ].forEach(
            function ( fn ) {
                // 
                if ( !handler || fn === handler ) {
                    element.removeEventListener( type, fn, false );    
                }
            }
        );

        delete events[ type ];
    };

    /**
     * 清除控件管理的DOM元素上的事件
     * 
     * @public
     * @param {Control} control 控件实例
     * @param {HTMLElement=} element 控件管理的DOM元素，
     * 如果没有此参数则去除所有该控件管理的元素的DOM事件
     */
    helper.clearDOMEvents = function ( control, element ) {
        if ( !control.domEvents ) {
            return;
        }

        var guid, events;

        if ( !element ) {
            for ( guid in control.domEvents ) {
                if ( control.domEvents.hasOwnProperty( guid ) ) {
                    events = control.domEvents[ guid ];
                    helper.clearDOMEvents( control, events.element );
                }
            }
            return;
        }

        guid = element[ domEventsKey ];
        events = control.domEvents[ guid ];

        // `events`中存放着各事件类型，只有`element`属性是一个DOM对象，
        // 因此要删除`element`这个键，
        // 以避免`for... in`的时候碰到一个不是数组类型的值
        delete events.element;
        for ( var type in events ) {
            if ( events.hasOwnProperty( type ) ) {
                helper.removeDOMEvent( control, element, type );
            }
        }
        delete control.domEvents[ guid ];
    };


    return helper;

});
