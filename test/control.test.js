define(function( require ) {

    var helper = require( 'saber-control/helper' );
    var Control = require( 'saber-control' );


    describe( 'Control', function() {

        it( 'should be instantiatable', function () {
            var c = new Control();
            expect( typeof c ).toEqual( 'object' );
            expect( c instanceof Control ).toBeTruthy();
        });

        describe('should have public methods', function () {
            var c = new Control();
            var methods = [
                'repaint', 'initStructure', 'dispose',
                'createMain', 'render', 'appendTo', 'insertBefore',
                'get', 'set', 'setProperties',
                'disable', 'enable', 'isDisabled',
                'show', 'hide', 'toggle', 'isHidden',
                'addState', 'removeState', 'toggleState', 'hasState',
                'addChild', 'removeChild', 'getChild', 'initChildren',
                'on', 'off', 'emit'
            ];
            methods.forEach(
                function ( method ) {
                    it( '`' + method + '`', function () {
                        expect( typeof c[ method ] ).toEqual( 'function' );
                    });
                }
            );
        });

        describe( 'api' , function () {

            it( '`get`', function () {
                var c = new Control({
                    foo: 'foo',
                    bar: [1, 2, 3]
                });
                c.set( 'saber', 'yes' );
                expect( c.get( 'id' ) ).toEqual( c.id );
                expect( c.get( 'main' ) ).toEqual( c.main );
                expect( c.get( 'disabled' ) ).toEqual( c.disabled );
                expect( c.get( 'hidden' ) ).toEqual( c.hidden );
                expect( c.get( 'options' ) ).toEqual( c.options );
                expect(
                    c.foo === c.options.foo && c.get( 'foo' ) === c.foo
                ).toBeTruthy();
                expect(
                    c.bar === c.options.bar && c.get( 'bar' ) === c.bar
                ).toBeTruthy();
                expect( c.get( 'saber' ) ).toEqual( 'yes' );
            });

            it( '`set`', function () {
                var c = new Control({
                    foo: 'foo',
                    bar: [1, 2, 3]
                });
                var bar = { x: 'y' };
                c.set( 'foo', 'bar' );
                c.set( 'bar', bar );
                c.set( 'saber', 'yes' );

                expect( c.get( 'foo' ) ).toEqual( 'bar' );
                expect( c.get( 'bar' ) ).toEqual( bar );
                expect( c.get( 'saber' ) ).toEqual( 'yes' );
            });

            it( '`appendTo`', function () {
                var c = new Control();
                var wrap = document.querySelector( '#demo' );
                c.appendTo( wrap );

                expect(
                    wrap.contains( c.get( 'main' ) )
                    && wrap.lastChild === c.get( 'main' )
                ).toBeTruthy();
            });

            it( '`insertBefore`', function () {
                var c = new Control();
                var wrap = document.querySelector( '#demo' );
                c.insertBefore( wrap.firstChild );

                expect(
                    wrap.contains( c.get( 'main' ) )
                    && wrap.firstChild === c.get( 'main' )
                ).toBeTruthy();
            });

            it( '`enable`', function () {
                var c = new Control();
                c.enable();

                expect( c.isDisabled() ).toEqual( false );
                expect( !!c.disabled ).toEqual( false );
                expect( !!c.get( 'disabled' ) ).toEqual( false );
                expect( c.hasState( 'disabled' ) ).toEqual( false );
            });

            it( '`disable`', function () {
                var c = new Control( { content: '.disable' } );
                c.disable();

                expect( c.isDisabled() ).toBeTruthy();
                expect( c.disabled ).toBeTruthy();
                expect( c.get( 'disabled' ) ).toBeTruthy();
                expect( c.hasState( 'disabled' ) ).toBeTruthy();
            });

            it( '`show`', function () {
                var c = new Control( { content: '.show' } );
                c.show();

                expect( c.isHidden() ).toEqual( false );
                expect( !!c.hidden ).toEqual( false );
                expect( !!c.get( 'hidden' ) ).toEqual( false );
                expect( c.hasState( 'hidden' ) ).toEqual( false );
            });

            it( '`hide`', function () {
                var c = new Control( { content: '.hide' } );
                c.hide();

                expect( c.isHidden() ).toBeTruthy();
                expect( c.hidden ).toBeTruthy();
                expect( c.get( 'hidden' ) ).toBeTruthy();
                expect( c.hasState( 'hidden' ) ).toBeTruthy();
            });

        });

        describe( 'event by `emitter`', function () {
            var events = {};
            var handler = function ( ev ) {
                events[ ev.type ] = arguments.length > 1
                    ? [].slice.call( arguments, 1 )
                    : true;
            };

            var c = new Control({
                foo: 'bar',
                // way 1
                onBeforeinit: handler,
                onInit: handler,
                onAfterinit: handler,
                onBeforerender: handler,
                onAfterrender: handler
            });

            // way 2
            c.on( 'beforedispose', handler )
            .on( 'afterdispose', handler )
            .on( 'show', handler )
            .on( 'propertychange', handler );

            // way 3
            c.onhide = handler;
            c.onenable = handler;
            c.ondisable = handler;


            c.appendTo( document.querySelector( '#demo' ) );
            c.hide();
            c.disable();
            c.show();
            c.enable();
            c.set( 'foo', 'baz' );
            c.dispose();


            it( 'beforeinit', function () {
                expect( events.beforeinit ).toBeTruthy();
            });

            it( 'init', function () {
                expect( events.init ).toBeTruthy();
            });

            it( 'afterinit', function () {
                expect( events.afterinit ).toBeTruthy();
            });

            it( 'beforerender', function () {
                expect( events.beforerender ).toBeTruthy();
            });

            it( 'afterrender', function () {
                expect( events.afterrender ).toBeTruthy();
            });

            it( 'beforedispose', function () {
                expect( events.beforedispose ).toBeTruthy();
            });

            it( 'afterdispose', function () {
                expect( events.afterdispose ).toBeTruthy();
            });

            it( 'show', function () {
                expect( events.show ).toBeTruthy();
            });

            it( 'hide', function () {
                expect( events.hide ).toBeTruthy();
            });

            it( 'enable', function () {
                expect( events.enable ).toBeTruthy();
            });

            it( 'disable', function () {
                expect( events.disable ).toBeTruthy();
            });

            it( 'propertychange', function () {
                expect(
                    Array.isArray( events.propertychange )
                ).toBeTruthy();
                
                var data = events.propertychange[0];
                expect( 
                    Object.prototype.toString.call( data )
                ).toEqual( '[object Object]' );

                expect(
                    data.foo.name
                ).toEqual( 'foo' );

                expect(
                    data.foo.oldValue
                ).toEqual( 'bar' );

                expect(
                    data.foo.newValue
                ).toEqual( 'baz' );
            });

            describe( 'when event is emited', function () {
                var control;
                var handler;
                // var backupHandler;
                var queue = [];
                beforeEach( function () {
                    control = new Control();
                    handler = jasmine.createSpy();
                    // backupHandler = jasmine.createSpy();
                    control.on( 'name', handler );
                    control.emit( 'name', { x: 1 } );
                });

                it( 'should call added handler when event is fired', function () {
                    expect( handler ).toHaveBeenCalled();
                });

                it( 'should pass a `type` property in event args[0]', function () {
                    expect(
                        handler.calls.mostRecent().args[ 0 ].type
                    ).toBe( 'name' );
                });

                it( 'should pass a `target` property in event args[0]', function () {
                    expect(
                        handler.calls.mostRecent().args[ 0 ].target
                    ).toBe( control );
                });

                it( 'should pass extra properties in event args[1]', function () {
                    expect(
                        handler.calls.mostRecent().args[ 1 ].x
                    ).toBe( 1 );
                });

                // it('should call handler added via `*` event when any event is fired', function () {
                //     expect( backupHandler ).toHaveBeenCalled();
                // });

                // it( 'should give the original `type` property in handler added via `*` event', function () {
                //     expect(
                //         backupHandler.mostRecentCall.args[ 0 ].type
                //     ).toBe( 'name' );
                // });
            
                it( 'should be able to remove an event handler', function () {
                    var control = new Control();
                    expect(function() {
                        control.off( 'name', function () {} );
                    }).not.toThrow();
                });

                it( 'should call handlers by order', function () {
                    var queue = [];
                    var control = new Control();
                    control.on( 'name', function () { queue.push( 'a' ); } );
                    control.on( 'name', function () { queue.push( 'b' ); } );
                    control.on( 'name', function () { queue.push( 'c' ); } );
                    control.emit( 'name' );
                    expect( queue.join( '' ) ).toBe( 'abc' );
                });

                // it( 'should call handlers added via `*` event after those added via named event', function () {
                //     var queue = [];
                //     var control = new Control();
                //     control.on( '*', function() { queue.push( 'b' ); } );
                //     control.on( 'name', function() { queue.push( 'a' ); } );
                //     control.emit( 'name');
                //     expect( queue.join('') ).toBe( 'ab' );
                // });

                it( 'should not call removed event handlers', function () {
                    var control = new Control();
                    var handler = jasmine.createSpy();
                    control.on( 'name', handler );
                    control.off( 'name', handler );
                    control.emit( 'name');
                    expect( handler ).not.toHaveBeenCalled();
                });

                it( 'should remove all event handlers when only the event name is passed to `un` method', function () {
                    var control = new Control();
                    var handler = jasmine.createSpy();
                    control.on( 'name', handler );
                    control.off( 'name' );
                    control.emit( 'name' );
                    expect( handler ).not.toHaveBeenCalled();
                });
            });

        });

        describe( 'dom event by `helper`', function () {
            var c = new Control();
            var count = 0;
            var handler = function ( ev ) {
                count++;
            };

            it( '`helper.addDOMEvent`', function () {
                helper.addDOMEvent( c, c.main, 'click', handler );
                c.main.click(); // +1
                expect( count ).toEqual( 1 );
            });

            it( '`helper.removeDOMEvent`', function () {
                c.main.click(); // +1
                c.main.click(); // +1
                helper.removeDOMEvent( c, c.main, 'click', handler );
                c.main.click(); // nothing
                c.main.click(); // nothing
                expect( count ).toEqual( 3 );
            });

            it( '`helper.clearDOMEvents`', function () {
                count = 0;
                helper.addDOMEvent( c, c.main, 'click', handler );
                helper.addDOMEvent( c, c.main, 'click', handler );
                helper.addDOMEvent( c, c.main, 'click', handler );
                c.main.click(); // `capture` is false
                helper.clearDOMEvents( c, c.main );
                c.main.click();
                expect( count ).toEqual( 1 );
            });

        });

    });

});