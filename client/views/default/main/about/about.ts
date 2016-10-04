module MJ.Views.Default.Main.About {
    class AboutController {
        public print() {
            window.print();
        }

        public getYearsSince(year: number) : number {
            return (new Date().getUTCFullYear()) - year;
        }
    }

    export var view = {
        templateUrl: 'views/default/main/about/about.html',
        controller: AboutController,
        controllerAs: 'aboutCtrl'
    };
}