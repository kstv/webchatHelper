import html from './send.html'
import AirScroll from '../lib/air-scroll'
import Checker from '../lib/Checker'

class Ctrl {
    constructor(services) {
        this.services   = services
        this.show       = false
        this.step       = 2
        this.contactTab = 1

        this.init()
    }

    init() {
        this.airScrollContacts  = new AirScroll({
            selector  : '.transfer .item.contacts',
            itemHeight: 45,
            viewHeight: 387,
            $scope    : this.services.$rootScope
        })
        this.airScrollChatrooms = new AirScroll({
            selector  : '.transfer .item.chatrooms',
            itemHeight: 45,
            viewHeight: 387,
            $scope    : this.services.$rootScope
        })

        this.services.$rootScope.$on('helper:send:show', () => {
            this.show = true
            this.list = this.getContacts()
            this.airScrollContacts.init(this.list.contacts)
            this.airScrollChatrooms.init(this.list.chatrooms)
            this.contactsChecker  = new Checker({
                context: this.list,
                itemKey: 'contacts',
                idKey  : 'UserName'
            })
            this.chatroomsChecker = new Checker({
                context: this.list,
                itemKey: 'chatrooms',
                idKey  : 'UserName'
            })
        })
    }

    filterList(key, airList, sourceList) {
        this[airList].init(this.services.$filter('filter')(this.list[sourceList], key))
    }

    changeContactTab(index) {
        this.contactTab = index
    }

    getContacts() {
        return {
            contacts: this.services.contactFactory.pickContacts(["friend"], {
                friend: {
                    noHeader      : true,
                    isWithoutBrand: true
                },
            }, true).result,

            chatrooms: this.services.contactFactory.pickContacts(["chatroom"], {
                chatroom: {
                    noHeader      : true,
                    isWithoutBrand: true
                },
            }, true).result
        }
    }

    toNext(index) {
        this.step = index
    }
}

export default {
    Ctrl,
    html: html
}