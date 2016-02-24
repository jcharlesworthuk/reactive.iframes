var reactive;
(function (reactive) {
    var iframes;
    (function (iframes) {
        var MessagePrefix = 'ReactiveIFrames';
        var MessageDelimiter = '~';
        var FrameIdAttributeName = 'data-frameid';
        var FrameScriptId = 'iframe_child_script';
        var Child = (function () {
            function Child() {
                var scriptTag = document.getElementById(FrameScriptId);
                if (!scriptTag)
                    throw new Error('The ReactiveIFrames child script requires an id of "' + FrameScriptId + '" on the <script> tag that included it');
                if (!scriptTag.hasAttribute(FrameIdAttributeName))
                    throw new Error('The ReactiveIFrames child script requires a data attribute called "' + FrameIdAttributeName + '" on the <script> tag that included it');
                this.id = scriptTag.getAttribute('data-frameid');
                this.messageRegex = new RegExp('^' + MessagePrefix + MessageDelimiter + this.id + MessageDelimiter + '(\\S+)' + MessageDelimiter + '(.+)$');
                window.addEventListener('message', this.processMessage.bind(this), false);
                this.parentWidth = null;
                this.sendMessage('height', this.currentHeight);
            }
            Child.prototype.processMessage = function (event) {
                if (!(event instanceof MessageEvent) || typeof event.data !== 'string') {
                    return;
                }
                var messageData = event.data;
                var match = messageData.match(this.messageRegex);
                if (!match || match.length !== 3) {
                    return;
                }
                var key = match[1];
                var value = match[2];
                if (key === 'width') {
                    var width = parseInt(value);
                    console.log("Parent -> " + width + " W Child (" + this.id + ")");
                    if (width !== this.parentWidth) {
                        this.parentWidth = width;
                        this.sendMessage('height', this.currentHeight);
                    }
                }
            };
            Child.prototype.sendMessage = function (messageType, message) {
                window.parent.postMessage(this.makeMessage(messageType, message), '*');
            };
            Child.prototype.makeMessage = function (messageType, message) {
                var bits = [MessagePrefix, this.id, messageType, message];
                return bits.join(MessageDelimiter);
            };
            Object.defineProperty(Child.prototype, "currentHeight", {
                get: function () {
                    return document.body.offsetHeight.toString();
                },
                enumerable: true,
                configurable: true
            });
            return Child;
        })();
        iframes.Child = Child;
    })(iframes = reactive.iframes || (reactive.iframes = {}));
})(reactive || (reactive = {}));
(function () {
    var oldWindowLoad = window.onload;
    if (document.readyState === "complete") {
        new reactive.iframes.Child();
    }
    else {
        window.onload = function (e) {
            new reactive.iframes.Child();
            if (oldWindowLoad) {
                oldWindowLoad(e);
            }
        };
    }
})();

//# sourceMappingURL=reactive.iframes.child.js.map
