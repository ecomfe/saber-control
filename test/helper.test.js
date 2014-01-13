define(function( require ) {
    var helper = require( 'saber-control/helper' );

    describe( 'Helper', function() {

        it('should be an object', function () {
            expect( typeof helper ).toEqual( 'object' );
        });

        describe( 'basic', function() {

            describe( '`getGUID`', function () {
                it( 'should exists', function () {
                    expect( typeof helper.getGUID ).toEqual( 'function' );
                });

                it( 'should return a string', function () {
                    expect( typeof helper.getGUID() ).toEqual( 'string' );
                });

                it( 'should return a different value on each invocation', function () {
                    var first = helper.getGUID();
                    var second = helper.getGUID();
                    expect( first).not.toBe( second );
                });
            });

            describe( '`getId`', function () {

                it( 'should exists', function () {
                    expect( typeof helper.getId ).toEqual( 'function' );
                });

                it( 'should return the correct id string', function () {
                    var control = { id: 'test' };
                    var id = helper.getId( control );
                    expect( id ).toBe( 'ctrl-test' );
                });

                it('should return the correct id string for a part', function () {
                    var control = { id: 'test' };
                    var id = helper.getId( control, 'label' );
                    expect( id ).toBe( 'ctrl-test-label' );
                });

            });

            describe( '`dispose`', function () {

                it( 'should exists', function () {
                    expect( typeof helper.dispose ).toEqual( 'function' );
                });

            });

        });

        describe( 'class', function() {

            describe('`getPartClasses`', function () {

                it('should exists', function () {
                    expect( typeof helper.getPartClasses ).toEqual( 'function' );
                });

                describe( 'with skin defined', function () {

                    it( 'should return the correct part class list', function () {
                        var control = {
                            type: 'TyPe',
                            skin: 'default'
                        };
                        var classes = helper.getPartClasses( control, 'test' );
                        var expectResult = [
                            'ui-type-test',
                            'skin-default-type-test'
                        ];
                        expect( classes ).toEqual( expectResult );
                    });

                    it( 'should return the correct class list for control itself', function () {
                        var control = {
                            type: 'TyPe',
                            skin: 'default'
                        };
                        var classes = helper.getPartClasses( control );
                        var expectResult = [
                            'ui-ctrl',
                            'ui-type',
                            'skin-default',
                            'skin-default-type'
                        ];
                        expect( classes ).toEqual( expectResult );
                    });

                });

                describe('without skin defined', function () {

                    it('should return the correct part class list', function () {
                        var control = {
                            type: 'TyPe'
                        };
                        var classes = helper.getPartClasses( control, 'test' );
                        var expectResult = [
                            'ui-type-test'
                        ];
                        expect( classes ).toEqual( expectResult );
                    });

                    it('should return the correct class list for control itself', function () {
                        var control = {
                            type: 'TyPe'
                        };
                        var classes = helper.getPartClasses( control );
                        var expectResult = [
                            'ui-ctrl',
                            'ui-type'
                        ];
                        expect( classes ).toEqual( expectResult );
                    });

                });

            });

            describe('`addPartClasses`', function () {

                it( 'should exists', function () {
                    expect( typeof helper.addPartClasses ).toEqual( 'function' );
                });

                it( 'should add correct classes to a part', function () {
                    var control = {
                        type: 'TyPe',
                        skin: 'default'
                    };
                    var element = document.createElement( 'div' );
                    element.className = '';
                    helper.addPartClasses( control, 'test', element );
                    var expectResult = [
                        'ui-type-test',
                        'skin-default-type-test'
                    ];
                    expect( element.className.split(/\s+/) ).toEqual( expectResult );
                });

                it( 'should add correct main classes to a part (though it should not be used in any of our code)', function () {
                    var control = {
                        type: 'TyPe',
                        skin: 'default'
                    };
                    var element = document.createElement( 'div' );
                    helper.addPartClasses( control, null, element );
                    var expectResult = [
                        'ui-ctrl',
                        'ui-type',
                        'skin-default',
                        'skin-default-type'
                    ];
                    expect( element.className.split(/\s+/) ).toEqual( expectResult );
                });

                it('should add correct main classes to the main element', function () {
                    var control = {
                        type: 'TyPe',
                        skin: 'default',
                        main: document.createElement( 'div' )
                    };
                    helper.addPartClasses( control );
                    var expectResult = [
                        'ui-ctrl',
                        'ui-type',
                        'skin-default',
                        'skin-default-type'
                    ];
                    expect( control.main.className.split(/\s+/) ).toEqual( expectResult );
                });

            });

            describe( '`removePartClasses`', function () {

                it( 'should exists', function () {
                    expect( typeof helper.removePartClasses ).toEqual( 'function' );
                });

                it( 'should remove correct classes from a part', function () {
                    var control = {
                        type: 'TyPe',
                        skin: 'default'
                    };
                    var element = document.createElement( 'div' );
                    element.className = 'ui-type-test skin-default-type-test';
                    helper.removePartClasses( control, 'test', element );
                    expect( element.className ).toBe( '' );
                });

                it( 'should remove correct main classes from a part (though it should not be used in any of our code)', function () {
                    var control = {
                        type: 'TyPe',
                        skin: 'default'
                    };
                    var element = document.createElement( 'div' );
                    element.className = 'ui-type skin-default skin-default-type';
                    helper.removePartClasses( control, null, element );
                    expect( element.className ).toBe( '' );
                });

                it( 'should remove correct main classes from the main element', function () {
                    var control = {
                        type: 'TyPe',
                        skin: 'default',
                        main: document.createElement( 'div' )
                    };
                    control.main.className = 'ui-type skin-default skin-default-type';
                    helper.removePartClasses( control );
                    expect( control.main.className ).toBe( '' );
                });

            });


            
            describe( '`getStateClasses`', function () {

                it( 'should exists', function () {
                    expect( typeof helper.getStateClasses ).toEqual( 'function' );
                });

                it( 'should get correct class list with skin defined', function () {
                    var control = {
                        type: 'TyPe',
                        skin: 'default'
                    };
                    var classes = helper.getStateClasses( control, 'test');
                    var expectResult = [
                        'ui-type-test',
                        'state-test',
                        'skin-default-test',
                        'skin-default-type-test'
                    ];
                    expect( classes ).toEqual( expectResult );
                });

                it( 'should get correct class list without skin defined', function () {
                    var control = {
                        type: 'TyPe'
                    };
                    var classes = helper.getStateClasses( control, 'test' );
                    var expectResult = [
                        'ui-type-test',
                        'state-test'
                    ];
                    expect( classes ).toEqual( expectResult );
                });

            });

            describe( '`addStateClasses`', function () {

                it('should exists', function () {
                    expect( typeof helper.addStateClasses ).toEqual( 'function' );
                });

                it( 'should add correct class list to the main element', function () {
                    var control = {
                        type: 'TyPe',
                        skin: 'default',
                        main: document.createElement( 'div' )
                    };
                    helper.addStateClasses( control, 'test' );
                    var expectResult = [
                        'ui-type-test',
                        'state-test',
                        'skin-default-test',
                        'skin-default-type-test'
                    ];
                    expect( control.main.className.split(/\s+/) ).toEqual( expectResult );
                });
            });

            describe( '`removeStateClasses`', function () {

                it( 'should exists', function () {
                    expect( typeof helper.removeStateClasses ).toEqual( 'function' );
                });

                it( 'should add correct class list to the main element', function () {
                    var control = {
                        type: 'TyPe',
                        skin: 'default',
                        main: document.createElement( 'div' )
                    };
                    control.main.className = 'ui-type-test state-test skin-default-test skin-default-type-test';
                    helper.removeStateClasses( control, 'test' );
                    expect( control.main.className ).toBe( '' );
                });

            });

        });

        describe( 'dom event', function() {

            describe( '`addDOMEvent`', function () {

                it( 'should exists', function () {
                    expect( typeof helper.addDOMEvent ).toEqual( 'function' );
                });

                it( 'should add an event to DOM element', function () {
                    var control = {};
                    var element = document.createElement( 'div' );
                    document.getElementById( 'demo' ).appendChild( element );
                    var handler = jasmine.createSpy();

                    helper.addDOMEvent( control, element, 'click', handler );
                    element.click();
                    expect( handler ).toHaveBeenCalled();
                });

                it( 'should call event listener with a full w3c-compatible Event object', function () {
                    var control = {};
                    var element = document.createElement( 'div' );
                    document.getElementById( 'demo' ).appendChild( element );
                    var handler = jasmine.createSpy();

                    helper.addDOMEvent( control, element, 'click', handler );
                    element.click();
                    var ev = handler.calls.mostRecent().args[ 0 ];
                    expect( ev ).toBeDefined();
                    expect( ev.type ).toBe( 'click' );
                    expect( ev.target ).toBe( element );
                    expect( typeof ev.stopPropagation ).toEqual( 'function' );
                    expect( typeof ev.preventDefault ).toEqual( 'function' );
                });

                it( 'should call event listeners attached to a parent element if child element fires the event', function () {
                    var control = {};
                    var parent = document.createElement( 'div' );
                    var child = document.createElement( 'div' );
                    parent.appendChild( child );
                    document.getElementById( 'demo' ).appendChild( parent );
                    var handler = jasmine.createSpy();

                    helper.addDOMEvent( control, parent, 'click', handler );
                    child.click();
                    expect( handler ).toHaveBeenCalled();
                });

                it( 'should call all event listeners when dom event is fired', function () {
                    var control = {};
                    var element = document.createElement( 'div' );
                    document.getElementById( 'demo' ).appendChild( element);
                    var handlerA = jasmine.createSpy();
                    var handlerB = jasmine.createSpy();

                    helper.addDOMEvent( control, element, 'click', handlerA );
                    helper.addDOMEvent( control, element, 'click', handlerB );
                    element.click();
                    expect( handlerA ).toHaveBeenCalled();
                    expect( handlerB ).toHaveBeenCalled();
                });

                it( 'should call event listeners with attach order', function () {
                    var control = {};
                    var element = document.createElement( 'div' );
                    document.getElementById( 'demo' ).appendChild( element );
                    var queue = [];
                    function handlerA() { queue.push( 'a' ); }
                    function handlerB() { queue.push( 'b' ); }

                    helper.addDOMEvent( control, element, 'click', handlerA );
                    helper.addDOMEvent( control, element, 'click', handlerB );
                    element.click();
                    expect( queue.join('') ).toBe('ab' );
                });

                // it( 'should be able to add event handler to global DOM object', function () {
                //     var control = {};
                //     var handler = jasmine.createSpy();
                //     helper.addDOMEvent( control, document, 'click', handler );
                //     document.click();
                //     expect( handler ).toHaveBeenCalled();
                //     helper.clearDOMEvents( control );
                // });

                // it( 'should be able to call event handlers on different control for global DOM object', function () {
                //     var controlA = {};
                //     var controlB = {};
                //     var handlerA = jasmine.createSpy( 'A' );
                //     var handlerB = jasmine.createSpy( 'B' );
                //     helper.addDOMEvent( controlA, document, 'click', handlerA );
                //     helper.addDOMEvent( controlB, document, 'click', handlerB );
                //     document.click();
                //     expect( handlerA ).toHaveBeenCalled();
                //     expect( handlerB ).toHaveBeenCalled();
                //     helper.clearDOMEvents( controlA );
                //     helper.clearDOMEvents( controlB );
                // });

            });

            describe('`removeDOMEvent`', function () {

                it( 'should exists', function () {
                    expect( typeof helper.removeDOMEvent ).toEqual( 'function' );
                });

                it( 'should remove an attached event listener', function () {
                    var control = {};
                    var element = document.createElement( 'div' );
                    document.getElementById( 'demo' ).appendChild( element );
                    var handler = jasmine.createSpy();

                    helper.addDOMEvent( control, element, 'click', handler );
                    helper.removeDOMEvent( control, element, 'click', handler );
                    element.click();
                    expect( handler ).not.toHaveBeenCalled();
                });

                it( 'should remove all event listeners if `handler` argument is omitted', function () {
                    var control = {};
                    var element = document.createElement( 'div' );
                    document.getElementById( 'demo' ).appendChild( element );
                    var handlerA = jasmine.createSpy();
                    var handlerB = jasmine.createSpy();

                    helper.addDOMEvent( control, element, 'click', handlerA );
                    helper.addDOMEvent( control, element, 'click', handlerB );
                    helper.removeDOMEvent( control, element, 'click' );
                    element.click();
                    expect( handlerA).not.toHaveBeenCalled();
                    expect( handlerB).not.toHaveBeenCalled();
                });

                it( 'should be ok if removing event handler is not already attached', function () {
                    var control = {};
                    var element = document.createElement( 'div' );
                    document.getElementById( 'demo' ).appendChild( element );
                    var handler = jasmine.createSpy();
                    expect(function () {
                        helper.removeDOMEvent( control, element, 'click', handler );
                    }).not.toThrow();
                });

                it( 'should be ok to remove an certain type of event with no listeners attached before event module is initialized', function () {
                    var control = {};
                    var element = document.createElement( 'div' );
                    document.getElementById( 'demo' ).appendChild( element );
                    expect(function () {
                        helper.removeDOMEvent( control, element, 'click' );
                    }).not.toThrow();
                });

                it('should be ok to remove an certain type of event with no listeners attached after event module is initialized', function () {
                    var control = {};
                    var element = document.createElement( 'div' );
                    document.getElementById( 'demo' ).appendChild( element );
                    helper.addDOMEvent( control, element, 'focus', function () {} );
                    expect( function () {
                        helper.removeDOMEvent( control, element, 'click' );
                    }).not.toThrow();
                });

                // it('should not call remvoed event listeners for global DOM object', function () {
                //     var control = {};
                //     var handlerA = jasmine.createSpy( 'A' );
                //     var handlerB = jasmine.createSpy( 'B' );
                //     helper.addDOMEvent( control, document, 'click', handlerA );
                //     helper.addDOMEvent( control, document, 'click', handlerB );
                //     helper.removeDOMEvent( control, document, 'click', handlerA );
                //     document.click();
                //     expect( handlerA ).not.toHaveBeenCalled();
                //     expect( handlerB ).toHaveBeenCalled();
                // });

            });

            describe('`clearDOMEvents`', function () {

                it( 'should exists', function () {
                    expect( typeof helper.clearDOMEvents ).toEqual( 'function' );
                });

                it( 'should remove all events from a given element', function () {
                    var control = {};
                    var element = document.createElement( 'div' );
                    document.getElementById( 'demo' ).appendChild( element );
                    var handlerA = jasmine.createSpy();
                    var handlerB = jasmine.createSpy();
                    var handlerC = jasmine.createSpy();
                    helper.addDOMEvent( control, element, 'click', handlerA );
                    helper.addDOMEvent( control, element, 'click', handlerB );
                    helper.addDOMEvent( control, element, 'focus', handlerC );
                    helper.clearDOMEvents( control, element );
                    element.click();
                    element.focus();
                    expect( handlerA ).not.toHaveBeenCalled();
                    expect( handlerB ).not.toHaveBeenCalled();
                    expect( handlerC ).not.toHaveBeenCalled();
                });

                it( 'should remove all events from all elements if `element` argument is omitted', function () {
                    var control = {};
                    var elementA = document.createElement( 'div' );
                    var elementB = document.createElement( 'div' );
                    document.getElementById( 'demo' ).appendChild( elementA );
                    document.getElementById( 'demo' ).appendChild( elementB );
                    var handlerA = jasmine.createSpy();
                    var handlerB = jasmine.createSpy();
                    helper.addDOMEvent( control, elementA, 'click', handlerA );
                    helper.addDOMEvent( control, elementB, 'click', handlerB );
                    helper.clearDOMEvents( control );
                    elementA.click();
                    elementB.click();
                    expect( handlerA ).not.toHaveBeenCalled();
                    expect( handlerB ).not.toHaveBeenCalled();
                });

                it( 'should be ok if no event handler is not already attached', function () {
                    var control = {};
                    var element = document.createElement( 'div' );
                    document.getElementById( 'demo' ).appendChild( element );
                    var handler = jasmine.createSpy();
                    expect(function () {
                        helper.clearDOMEvents( control );
                    }).not.toThrow();
                });

                // it( 'should not call listeners from a cleared control for global DOM object', function () {
                //     var controlA = {}; 
                //     var controlB = {}; 
                //     var handlerA = jasmine.createSpy( 'A' );
                //     var handlerB = jasmine.createSpy( 'B' );
                //     helper.addDOMEvent( controlA, document, 'click', handlerA );
                //     helper.addDOMEvent( controlB, document, 'click', handlerB );
                //     helper.clearDOMEvents( controlA );
                //     document.click();
                //     expect( handlerA).not.toHaveBeenCalled();
                //     expect( handlerB ).toHaveBeenCalled();
                // });
            });

        });

    });
});