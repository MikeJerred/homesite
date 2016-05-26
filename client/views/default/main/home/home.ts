module MJ.Views.Default.Main.Home {
    interface ICard {
        title: string;
    }

    class Controller {
        public cards: ICard[] = [];
        private cardsData: ICard[] = [
            { title: 'Front-End Developer (£2k signing on bonus!)' },
            { title: 'Web Components and the Three Unsexy Pillars' },
            { title: 'Pixels are expensive' },
            { title: 'We Hire the Best, Just Like Everyone Else' },
            { title: 'The Hugging Will Continue Until Morale Improves' },
            { title: 'Optimising for 60fps everywhere' },
            { title: 'Optimising for 60fps everywhere' }
        ];

        static $inject = ['$timeout'];
        constructor($timeout: ng.ITimeoutService) {
            $timeout(() => {
                this.cardsData.forEach(card => { this.cards.push(card); });
            }, 500);
        }
    }

    export var view = {
        templateUrl: 'views/default/main/home/home.html',
        controller: Controller,
        controllerAs: 'homeCtrl'
    };
}