function changeSelectedRoute() {
    let route = document.querySelector('[data-route-index]');
    route.addEventListener("click", routeChanged);

    function routeChanged(event) {
        event.preventDefault();

        console.log(this.data-route-index);
    }
}
