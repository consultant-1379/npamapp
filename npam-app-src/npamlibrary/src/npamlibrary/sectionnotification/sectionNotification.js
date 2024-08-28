define([
    "jscore/core",
    "uit!./sectionNotification.html"
], function (core, View) {

    return core.Widget.extend({

        View: View,

        /**
         * Populate the content of the widget.
         *
         * @method onViewReady
         */
        onViewReady: function () {
            this.view.findById("icon").setModifier(this.options.icon);
            this.setTitle(this.options.title);
            this.setDescription(this.options.description);
        },

        /**
         * Description supports the markdown syntax for links.
         * The content must be safely escaped and then transformed.
         *
         * @method setDescription
         * @param {String} desc
         */
        setDescription: function (desc) {
            var descEl = this.view.findById("description");

            if(this.options.isError) {
                //To display formatted Access denied error msgs.
                descEl.setProperty("innerHTML", desc);
            } else {
                // Escape the HTML content by setting it as the text content
                descEl.setText(desc);

                // Parse the markdown link syntax
                var escapedContent = descEl.getProperty('innerHTML');
                escapedContent = escapedContent.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

                // Apply the parsed content
                descEl.setProperty('innerHTML', escapedContent);
            }
        },

        /**
         * Sets the given title.
         *
         * @method setTitle
         * @param {String} title
         */
        setTitle: function (title) {
            this.view.findById("title").setText(title);
        }

    });

});