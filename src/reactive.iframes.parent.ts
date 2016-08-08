
module reactive.iframes {
    
    const MessagePrefix = 'ReactiveIFrames';
    const MessageDelimiter = '~';

    export class Parent {

        url: string
        config: any
        messageRegex: RegExp

        constructor(private element: HTMLElement, private id: string, private addHeight?: number) {
            window.addEventListener('resize', this.onResize);
            this.messageRegex = new RegExp('^' + MessagePrefix + MessageDelimiter + id + MessageDelimiter + '(\\S+)' + MessageDelimiter + '(.+)$');
            window.addEventListener('message', this.processMessage.bind(this), false);
        }
        
        private onResize = (event: Event) => {
            this.sendWidth();
        }

        sendWidth() {
            var width = this.element.offsetWidth.toString();
            this.sendMessage('width', width);
        }

        sendMessage(messageType: string, message: string) {
            this.iframe.contentWindow.postMessage(this.makeMessage(messageType, message), '*');
        }

        private makeMessage(messageType: string, message: string) {
            var bits = [MessagePrefix, this.id, messageType, message];
            return bits.join(MessageDelimiter);
        }

        get iframe() {
            return this.element.getElementsByTagName('iframe')[0];
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
            if (key === 'height') {
                var height = parseInt(value);
                if (this.addHeight) {
                    height += this.addHeight;
                }
                //console.log("Child -> " + height + " H Parent (" + this.id + ")");
                this.iframe.setAttribute('height', height + 'px');
            }
        }
    }

}