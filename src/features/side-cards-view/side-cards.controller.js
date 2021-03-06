angular
    .module('app.sideCards')
    .controller('SideCardsCtrl', SideCardsCtrl);

function SideCardsCtrl($ionicModal, $scope, $timeout, $ionicHistory, DefaultCards, svsNotificationService, Transactions, userCards) {
    var vm = this;
    var CARD = 'CARD';

    vm.openEditModal = openEditModal;
    vm.openAddModal = openAddModal;
    vm.deleteCard = deleteCard;

    init();

    function init() {
        vm.usersCards = userCards;
        vm.suggestedCards = _.difference(_.map(DefaultCards, 'name'), _.map(userCards, 'name'));
    }

    function deleteCard(card) {
        userCards.$remove(card); // remove card from firebase

        // wait to load page so vm.suggestedCards updates
        $timeout(function () {
            vm.suggestedCards = _.difference(_.map(DefaultCards, 'name'), _.map(userCards, 'name'));
        });

        // to make all old transaction with that card name to other
        _.forEach(Transactions, function (d) {
            if (d.card.id === card.$id) {
                d.card.name = "other";

                Transactions.$save(d)
            }
        });

        //Remove associated notification if exists
        removeNotification(card);
    }

    $ionicModal.fromTemplateUrl('features/side-cards-view/add-card.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.addCard = function (card) {
        // edit existing data if key is present
        var cardData = userCards.$getRecord(card.key) || {};

        cardData.name = card.name;
        cardData.budget = card.budget;
        cardData.dueDate = card.dueDate.setHours(23,59,59,999);

        //For notifications
        cardData.notification_id = new Date().getTime();
        cardData.notification = true;
        cardData.recurring = true;

        //Add type
        cardData.type = CARD;

        cardData.amountDue = 0;
        cardData.pending = 0;

        //Create notification
        createNotification(cardData);

        // save existing data if key is present, else add
        card.key ? userCards.$save(cardData) : userCards.$add(cardData);

        // wait to load page so vm.suggestedCards updates
        $timeout(function () {
            vm.suggestedCards = _.difference(_.map(DefaultCards, 'name'), _.map(userCards, 'name'));
        });
        $scope.modal.hide();
    };

    function createNotification(item) {
        var config = {
            id: item.notification_id,
            title: 'Payment Reminder',
            text: item.name + ' bill is due soon',
            every: (item.recurring) ? 'month' : undefined,
            autoClear: true,
            at: new Date(item.dueDate).setHours(0,0,0,0)
        };
        console.log("Notification modified as:");
        console.log(config);
        return svsNotificationService.addNotification(config);
    }

    function removeNotification(item) {
        return svsNotificationService.getNotification(item.notification_id)
            .then(function (value) {
                console.log(value);
                if (value) {
                    return svsNotificationService.removeNotification(item.notification_id);
                }
            });
    }

    function openEditModal(card) {
        $scope.card = {
            name: card.name,
            budget: card.budget,
            dueDate: new Date(card.dueDate),
            key: userCards.$keyAt(card)
        };
        $scope.modal.show($scope.card);

    }

    function openAddModal(cardName) {
        if (vm.data) {
            vm.data.showDelete = false;
        }
        if (cardName) {
            $scope.card = {
                name: cardName
            };
        }
        else {
            $scope.card = {}
        }
        $ionicHistory.clearCache().then(function () {
            $scope.modal.show($scope.card);
        });
    }
}
