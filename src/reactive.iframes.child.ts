
module reactive.iframes {

    const MessagePrefix = 'ReactiveIFrames';
    const MessageDelimiter = '~';
    const FrameIdAttributeName = 'data-frameid';
    const FrameScriptId = 'iframe_child_script';

    export class Child {
        messageRegex : RegExp
        id: string
        parentWidth: number

        constructor() {
            var scriptTag = document.getElementById(FrameScriptId);
            if (!scriptTag)
                throw new Error('The ReactiveIFrames child script requires an id of "' + FrameScriptId  + '" on the <script> tag that included it');

            if (!scriptTag.hasAttribute(FrameIdAttributeName))
                throw new Error('The ReactiveIFrames child script requires a data attribute called "' + FrameIdAttributeName + '" on the <script> tag that included it');


            this.id = scriptTag.getAttribute('data-frameid');

            this.messageRegex = new RegExp('^' + MessagePrefix + MessageDelimiter + this.id + MessageDelimiter + '(\\S+)' + MessageDelimiter + '(.+)$');

            window.addEventListener('message', this.processMessage.bind(this), false);
            
            this.parentWidth = null;
            this.sendMessage('height', this.currentHeight);
        }

        processMessage(event: Event) {
            
            if (!(event instanceof MessageEvent) || typeof <MessageEvent>event.data !== 'string') {
                return;
            }
            var messageData = <string>(<MessageEvent>event).data;

            var match = messageData.match(this.messageRegex);

            if (!match || match.length !== 3) { return; }

            var key = match[1];
            var value = match[2];
            if (key === 'width') {
                var width = parseInt(value);
                console.log("Parent -> " + width + " W Child (" + this.id + ")");
                // Change the width if it's different.
                if (width !== this.parentWidth) {
                    this.parentWidth = width;
                    this.sendMessage('height', this.currentHeight);
                }
            }
        }

        sendMessage(messageType: string, message: string) {
            window.parent.postMessage(this.makeMessage(messageType, message), '*');
        }

        private makeMessage(messageType: string, message: string) {
            var bits = [MessagePrefix, this.id, messageType, message];
            return bits.join(MessageDelimiter);
        }   
        
        get currentHeight() : string {
            return document.body.offsetHeight.toString();
        }
    }
}

(function () {
    var oldWindowLoad = window.onload;
    if (document.readyState === "complete") {
        new reactive.iframes.Child();
    } else {
        window.onload = function (e: Event) {
            new reactive.iframes.Child();
            if (oldWindowLoad) {
                oldWindowLoad(e);
            }
        };
    }
})();