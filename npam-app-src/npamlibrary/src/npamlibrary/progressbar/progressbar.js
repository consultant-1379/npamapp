/**
 * Created by tcsmukm on 7/2/2016.
 */


define([
    'jscore/core',
    'widgets/ProgressBar',
    './progressbarview'
], function (core, ProgressBar,View) {
    return core.Widget.extend({

        View: View,

        init: function(){
            this.progressBar = new ProgressBar();
        },

        setValue: function (value) {
            this.progressBar.setValue(value);
            this.setColor(value);
            this.progressBar.attachTo(this.view.getElement());
        },

        setColor: function(value){
            if(value < 100){
                this.progressBar.setColor("paleBlue");
            }else{
                this.progressBar.setColor("green");
            }
        }
    });

});