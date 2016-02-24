var reactive;
(function (reactive) {
    var iframes;
    (function (iframes) {
        var MessagePrefix = 'ReactiveIFrames';
        var MessageDelimiter = '~';
        var Parent = (function () {
            function Parent(element, id) {
                var _this = this;
                this.element = element;
                this.id = id;
                this.onResize = function (event) {
                    _this.sendWidth();
                };
                window.addEventListener('resize', this.onResize);
                this.messageRegex = new RegExp('^' + MessagePrefix + MessageDelimiter + id + MessageDelimiter + '(\\S+)' + MessageDelimiter + '(.+)$');
                window.addEventListener('message', this.processMessage.bind(this), false);
            }
            Parent.prototype.sendWidth = function () {
                var width = this.element.offsetWidth.toString();
                this.sendMessage('width', width);
            };
            Parent.prototype.sendMessage = function (messageType, message) {
                this.iframe.contentWindow.postMessage(this.makeMessage(messageType, message), '*');
            };
            Parent.prototype.makeMessage = function (messageType, message) {
                var bits = [MessagePrefix, this.id, messageType, message];
                return bits.join(MessageDelimiter);
            };
            Object.defineProperty(Parent.prototype, "iframe", {
                get: function () {
                    return this.element.getElementsByTagName('iframe')[0];
                },
                enumerable: true,
                configurable: true
            });
            Parent.prototype.processMessage = function (event) {
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
                if (key === 'height') {
                    var height = parseInt(value);
                    console.log("Child -> " + height + " H Parent (" + this.id + ")");
                    this.iframe.setAttribute('height', height + 'px');
                }
            };
            return Parent;
        })();
        iframes.Parent = Parent;
    })(iframes = reactive.iframes || (reactive.iframes = {}));
})(reactive || (reactive = {}));

//# sourceMappingURL=reactive.iframes.parent.js.map
