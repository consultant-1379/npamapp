define([
    'shmjobdetails/widgets/comment/comment'

], function (comment) {
    'use strict';

    describe('Comment', function () {

        it('Comment should be defined', function () {
            expect(comment).not.to.be.undefined;
        });

        describe('Methods', function () {

            describe('init()', function (){

                var commentProto, sandbox, eventBusStub;
                beforeEach(function(done){
                    sandbox = sinon.sandbox.create();

                    eventBusStub = {
                        subscribe: function () {}
                    };

                    sandbox.spy(eventBusStub, 'subscribe');
                    sandbox.stub(comment.prototype,"eventBus",function(){
                        return eventBusStub;
                    });

                    commentProto = new comment({context : function(){}});
                    done();
                });

                afterEach(function(done){
                    sandbox.restore();
                    done();
                });

                /*it("checks commentbutton had been defined",function(){
                    expect(commentProto.commentbutton).to.be.defined;
                });*/
            });

        });

    });

});
