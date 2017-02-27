angular
    .module('app.sideCards')
    .controller('SideCardsCtrl', SideCardsCtrl);

function SideCardsCtrl(svsGetDataService, $ionicModal, $scope) {
    var vm = this;
    var Cards = [
        { name: 'Barclaycard MasterCard' },
        { name: 'Chase Freedom' },
        { name: 'Blue Cash Amex' },
        { name: 'Citi Double Cash' },
        { name: 'Discover it' },
        { name: 'Chase' },
        { name: 'Chase Slate' },
        { name: 'Bank Of America' },
        { name: 'Citi' },
        { name: 'American Express' },
        { name: 'Chase Sapphire' }
    ];

    vm.openEditModal = openEditModal;
    vm.openAddModal = openAddModal;
    vm.deleteCard = deleteCard;

    init();

    function init() {
        vm.usersCards = svsGetDataService.getCards();
        vm.suggestedCards = _.difference(_.map(Cards, 'name'), _.map(vm.usersCards, 'name'));
    }

    function deleteCard(card) {
        svsGetDataService.deleteCard(card);
        vm.suggestedCards = _.difference(_.map(Cards, 'name'), _.map(vm.usersCards, 'name'));
    }

    $ionicModal.fromTemplateUrl('features/side-cards-view/add-card.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.addCard = function (data) {
        svsGetDataService.setCard(data);
        vm.suggestedCards = _.difference(_.map(Cards, 'name'), _.map(vm.usersCards, 'name'));
        $scope.modal.hide();
    };

    function openEditModal(card) {
        $scope.card = {
            name: card.name,
            budget: card.budget,
            dueDate: new Date(card.dueDate)
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
