/**
 * Saber UI
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 控件基类
 * @author zfkun(zfkun@msn.com)
 */

define(function ( require ) {

    var ui = require( 'saber-ui' );
    var Lang = require( 'saber-lang' );
    var DOM = require( 'saber-dom' );
    var Emitter = require( 'saber-emitter' );


    /**
     * 控件基类
     * 
     * 禁止实例化，只能继承
     * @constructor
     * @exports Control
     * @fires module:Control#beforeinit
     * @fires module:Control#afterinit
     * @fires module:Control#beforerender
     * @fires module:Control#afterrender
     * @fires module:Control#beforedispose
     * @fires module:Control#afterdispose
     * @fires module:Control#show
     * @fires module:Control#hide
     * @fires module:Control#propertychange
     * @param {Object} options 初始化配置参数
     */
    var Control = function ( options ) {
        this.initialize.apply( this, arguments );
    };

    Control.prototype = {

        constructor: Control,

        /**
         * 控件类型标识
         * 
         * @private
         * @type {string}
         */
        type: 'Control',

        /**
         * 控件可用状态
         * 
         * @type {boolean}
         */
        disabled: false,

        /**
         * 控件可见状态
         * 
         * @type {boolean}
         */
        hidden: false,

        /**
         * 初始化控件选项
         *
         * @param {Object} options 构造函数传入的选项
         * @protected
         */
        initOptions: function ( options ) {
            options = options || {};

            var key, val;
            for ( key in options ) {
                if ( !options.hasOwnProperty( key ) ) {
                    continue;
                }

                val = options[ key ];

                if ( /^on[A-Z]/.test( key ) && isFunction( val ) ) {
                    // 移除on前缀，并转换第3个字符为小写，得到事件类型
                    this.on(
                        key.charAt( 2 ).toLowerCase() + key.slice( 3 ),
                        val
                    );
                    delete options[ key ];
                }
            }

            this.setProperties( this.options = options );
        },

        /**
         * 控件初始化
         * 
         * @param {Object} options 配置参数
         * @fires module:Control#beforeinit
         * @fires module:Control#afterinit
         * @protected
         */
        initialize: function ( options ) {
            var self = this;
            
            options = options || {};

            self.initOptions( options );

            /**
             * @event module:Control#beforeinit
             */
            self.emit( 'beforeinit' );

            if ( !self.id && !options.id ) {
                self.id = ui.getGUID();
            }

            self.children = [];
            self.states = {};

            self.main = options.main ? options.main : self.createMain();

            if ( isFunction( self.init ) ) {
                self.init( options );
            }

            /**
             * @event module:Control#afterinit
             */
            self.emit( 'afterinit' );
        },

        /**
         * 创建控件主元素
         * 
         * @param {Object} options 构造函数传入的配置参数
         * @return {HTMLElement}
         * @protected
         */
        createMain: function( options ) {
            return document.createElement('div');
        },

        /**
         * 渲染控件
         * 
         * @protected
         * @fires module:Control#beforerender
         * @fires module:Control#afterrender
         */
        render: function () {
            // throw new Error( 'not implement render' );
            var rendered = this.rendered;

            if ( !rendered ) {
                this.rendered = true;

                /**
                 * @event module:Control#beforerender
                 */
                this.emit( 'beforerender' );

                if ( !this.options.main
                    && !document.body.contains( this.main ) ) {
                    document.body.appendChild( this.main );
                }

                DOM.addClass(
                    this.main,
                    ui.getConfig( 'uiClassPrefix' )
                    + '-' + this.type.toLowerCase()
                );
            }

            this.repaint();

            if ( !rendered ) {
                /**
                 * @event module:Control#afterrender
                 */
                this.emit( 'afterrender' );
            }
        },

        /**
         * 重新渲染视图
         * 
         * 首次渲染时, 不传入变更属性集合参数
         * @param {Object=} changes 变更过的属性的集合
         * @protected
         */
        repaint: function( changes ) {
            // throw new Error( 'not implement repaint' );
            var method;

            if ( changes && changes.hasOwnProperty( 'disabled' ) ) {
                method = this.diabled ? 'addState' : 'removeState';
                this[ method ]( 'disabled' );
            }

            if ( changes && changes.hasOwnProperty( 'hidden' ) ) {
                method = this.hidden ? 'addState' : 'removeState';
                this[ method ]( 'hidden' );
            }
        },

        /**
         * 销毁控件
         * 
         * @public
         * @fires module:Control#beforedispose
         * @fires module:Control#afterdispose
         */
        dispose: function () {
            /**
             * @event module:Control#beforedispose
             */
            this.emit( 'beforedispose' );

            var child;
            while ( ( child = this.children.pop() ) ) {
                child.dispose();
            }

            /**
             * @event module:Control#afterdispose
             */
            this.emit( 'afterdispose' );
        },

        /**
         * 将控件添加到页面元素中
         * 
         * @public
         * @param {HTMLElement} wrap 控件要添加到的目标元素
         */
        appendTo: function ( wrap ) {
            // this.main = wrap || this.main;
            wrap.appendChild( this.main );
            this.render();
        },

        /**
         * 将控件添加到页面的某个元素之前
         * 
         * @param {HTMLElement} reference 控件要添加到之前的目标元素
         * @public
         */
        insertBefore: function( reference ) {
            reference.parentNode.insertBefore( this.main, reference );
            this.render();
        },

        /**
         * 设置控件状态为启用
         * 
         * @public
         * @fires module:Control#enable
         */
        enable: function () {
            this.disabled = false;

            this.removeState( 'disabled' );

            /**
             * @event module:Control#enable
             */
            this.emit( 'enable' );
        },

        /**
         * 设置控件状态为禁用
         * 
         * @public
         * @fires module:Control#disable
         */
        disable: function () {
            this.disabled = true;

            this.addState( 'disabled' );

            /**
             * @event module:Control#disable
             */
            this.emit( 'disable' );
        },

        /**
         * 判断控件是否不可用
         * 
         * @return {boolean}
         * @public
         */
        isDisabled: function () {
            return this.hasState( 'disabled' );
        },

        /**
         * 设置控件禁用状态
         * 
         * @param {boolean} disabled 是否禁用
         * @public
         */
        setDisabled: function ( disabled ) {
            this[ disabled ? 'disable' : 'enable' ]();
        },

        /**
         * 设置控件状态为可见
         * 
         * @public
         * @fires module:Control#show
         */
        show: function() {
            this.hidden = false;

            this.removeState( 'hidden' );

            /**
             * @event module:Control#show
             */
            this.emit( 'show' );
        },

        /**
         * 设置控件状态为不可见
         * 
         * @public
         * @fires module:Control#hide
         */
        hide: function() {
            this.hidden = true;

            this.addState( 'hidden' );

            /**
             * @event module:Control#hide
             */
            this.emit( 'hide' );
        },

        /**
         * 切换控件可见状态
         * 
         * @public
         */
        toggle: function () {
            this[ this.isHidden() ? 'show' : 'hide' ]();
        },

        /**
         * 判断控件是否不可见
         * 
         * @return {boolean}
         * @public
         */
        isHidden: function() {
            return this.hasState( 'hidden' );
        },

        /**
         * 设置控件不可见状态
         * 
         * @param {boolean} disabled 是否不可见
         * @public
         */
        setHidden: function( hidden ) {
            this[ hidden ? 'hide' : 'show' ]();
        },




        /**
         * 获取控件属性
         * 
         * 控件属性分成 核心属性、关键信息属性、数据信息属性
         * @param {string} name 属性名
         * @return {*} 返回目标属性的值
         * @public
         */
        get: function ( name ) {
            var method = this[ 'get' + toPascalize( name ) ];

            if ( 'function' === typeof method ) {
                return method.call( this );
            }

            return this[ name ];
        },

        /**
         * 设置控件属性
         * 
         * @param {string} name 属性名
         * @param {*} value 属性值
         * @public
         */
        set: function ( name, value ) {
            var method = this[ 'set' + toPascalize( name ) ];

            if ( 'function' === typeof method ) {
                return method.call( this, value );
            }

            var property = {};
            property[ name ] = value;
            this.setProperties( property );
        },

        /**
         * 批量设置控件的属性值
         * 
         * @param {Object} properties 属性值集合
         * @fires module:Control#propertychange
         * @public
         */
        setProperties: function ( properties ) {
            // 确保只有在渲染以前（`initOptions`调用时）才允许设置id
            if ( properties.hasOwnProperty( 'id' ) ) {
                if ( !this.rendered ) {
                    this.id = properties.id;
                    delete properties.id;
                }
            }

            // 确保几个状态选项值为`boolean`类型
            // `diabled`, `hidden`
            [ 'disabled', 'hidden' ].forEach(function ( booleanKey ) {
                if ( properties.hasOwnProperty( booleanKey ) ) {
                    properties[ booleanKey ] = !!properties[ booleanKey ];
                }
            });

            var changes = {}, hasChanged, oldValue, newValue;
            for ( var key in properties ) {
                if ( properties.hasOwnProperty( key ) ) {
                    oldValue = this[ key ];
                    newValue = properties[ key ];
                    
                    if ( oldValue !== newValue ) {
                        this[ key ] = newValue;

                        changes[ key ] = {
                            name: key,
                            oldValue: oldValue,
                            newValue: newValue
                        };

                        hasChanged = true;
                    }
                }
            }

            if ( hasChanged ) {
                // render后的属性变化，可能会引起重绘
                if ( this.rendered ) {
                    this.repaint( changes );
                }

                /**
                 * @event module:Control#propertychange
                 */
                this.emit( 'propertychange', changes );
            }
        },




        /**
         * 获取命名子控件
         *
         * @public
         * @param {string} childName 子控件名
         * @return {module:Control} 获取到的子控件 
         */
        getChild: function( childName ) {
            // TODO
        },

        /**
         * 批量初始化子控件
         * 
         * @public
         * @param {HTMLElement} wrap 容器DOM元素
         */
        initChildren: function ( wrap ) {
            // TODO
        },

        /**
         * 添加子控件
         * 
         * @public
         * @param {module:Control} control 控件实例
         * @param {string=} childName 子控件名
         */
        addChild: function ( control, childName ) {
            // TODO
        },

        /**
         * 移除子控件
         * 
         * @public
         * @param {module:Control} control 子控件实例
         */
        removeChild: function ( control ) {
            // TODO
        },


        /**
         * 添加控件状态
         * 
         * @public
         * @param {string} state 状态名
         */
        addState: function ( state ) {
            if ( this.hasState( state ) ) return;

            this.states[ state ] = true;
            
            DOM.addClass(
                this.main,
                ui.getConfig( 'uiClassPrefix' )
                + '-' + this.type.toLowerCase()
                + '-' + state
            );

            var properties = {};
            properties[ state ] = true;
            this.setProperties( properties );
        },

        /**
         * 移除控件状态
         * 
         * @public
         * @param {string} state 状态名
         */
        removeState: function ( state ) {
            if ( !this.hasState( state ) ) return;
            
            delete this.states[ state ];

            DOM.removeClass(
                this.main,
                ui.getConfig( 'uiClassPrefix' )
                + '-' + this.type.toLowerCase()
                + '-' + state
            );

            var properties = {};
            properties[ state ] = false;
            this.setProperties( properties );
        },

        /**
         * 切换控件指定状态
         * 
         * @public
         * @param {string} state 状态名
         */
        toggleState: function ( state ) {
            this[
                this.hasState( state )
                ? 'removeState'
                : 'addState'
            ]( state );
        },

        /**
         * 判断控件是否处于指定状态
         * 
         * @public
         * @param {string} state 状态名
         * @return {boolean}
         */
        hasState: function( state ) {
            return !!this.states[ state ];
        }

    };

    // 混入 Emitter 支持
    Emitter.mixin( Control.prototype );






    var toString = Object.prototype.toString;


    /**
     * 判断是否为字符串
     * 
     * @inner
     * @param {*} obj 目标对象
     * @return {boolean}
     */
    function isString( obj ) {
        return '[object String]' === toString.call( obj );
    }

    /**
     * 判断是否为函数
     * 
     * @inner
     * @param {*} obj 目标对象
     * @return {boolean}
     */
    function isFunction( obj ) {
        return '[object Function]' === toString.call( obj );
    }

    /**
     * 判断是否为对象
     * 
     * @inner
     * @param {*} obj 目标对象
     * @return {boolean}
     */
    function isObject( obj ) {
        return '[object Object]' === toString.call( obj );
    }




    /**
     * 将字符串转换成camel格式
     * 
     * @inner
     * @param {string} source 源字符串
     * @return {string}
     */
    function toCamelize( source ) {
        if ( !isString( source ) || !source ) {
            return '';
        }

        return source.replace( 
            /-([a-z])/g,
            function ( alpha ) {
                return alpha.toUpperCase();
            }
        );
    }

    /**
     * 将字符串转换成pascal格式
     * 
     * @inner
     * @param {string} source 源字符串
     * @return {string}
     */
    function toPascalize( source ) {
        if ( !isString( source ) || !source ) {
            return '';
        }

        return source.charAt( 0 ).toUpperCase()
            + toCamelize( source.slice( 1 ) );
    }


    return Control;
});

