angular
    .module('app.sideCards')
    .controller('SideCardsCtrl', SideCardsCtrl);

function SideCardsCtrl($ionicModal, $scope, DefaultCards, userCards, Transactions, $timeout) {
    var vm = this;

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
            };
        });
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
        cardData.dueDate = card.dueDate.getTime();

        // save existing data if key is present, else add
        card.key ? userCards.$save(cardData) : userCards.$add(cardData);

        // wait to load page so vm.suggestedCards updates
        $timeout(function () {
            vm.suggestedCards = _.difference(_.map(DefaultCards, 'name'), _.map(userCards, 'name'));
        });
        $scope.modal.hide();
    };

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
        $scope.modal.show($scope.card);
    }
}
