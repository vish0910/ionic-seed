angular
  .module('app.sideCards')
  .controller('SideCardsCtrl', SideCardsCtrl);

function SideCardsCtrl(svsGetDataService, $ionicModal, $scope) {
    var vm = this;
    var Cards = ['Barclaycard MasterCard', 'Chase Freedom', 'Blue Cash Amex', 'Citi Double Cash', 'Discover it',
        'Wells Fargo Visa', 'Chase Slate'];

    vm.openEditModal = openEditModal;
    vm.openAddModal = openAddModal;
    vm.deleteCard = deleteCard;

    init();

    function init(){
        vm.usersCards = svsGetDataService.getCards();
        vm.suggestedCards = _.difference(Cards,_.map(vm.usersCards, 'name'));
        console.log(vm.usersCards, vm.suggestedCards)
    }

    function deleteCard(card){
        svsGetDataService.deleteCard(card);
        vm.suggestedCards = _.difference(Cards,_.map(vm.usersCards, 'name'));
    }

    $ionicModal.fromTemplateUrl('features/side-cards-view/add-card.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.addCard = function(data) {
        svsGetDataService.setCard(data);
        vm.suggestedCards = _.difference(Cards,_.map(vm.usersCards, 'name'));
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

    function openAddModal(cardName){
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
