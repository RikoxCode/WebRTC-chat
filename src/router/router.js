class SPARouter {
    constructor(routeId) {
        this.routes = {};
        this.routeElementId = routeId || 'app';

        window.addEventListener('popstate', () => {
            this.routeTo(window.location.pathname);
        });
    }

    navigateTo(path) {
        window.history.pushState(null, null, path);
        this.routeTo(path);
    }

    routeTo(path) {
        const content = this.routes[path];

        if (content) {
            this.updateContent(content);
        } else {
            console.error('Route not found:', path);
        }
    }

    updateContent(content) {
        console.log('Updating content')
        document.getElementById(this.routeElementId).innerHTML = content;
    }
}