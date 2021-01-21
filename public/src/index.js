new Vue({
    el: "#app",
    data() {
        return {
            patchesData: []
        }
    },

    created() {
        this.getPatchesData();
    },

    computed: {},

    methods: {
        async getPatchesData () {
            await fetch('/liqui')
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                this.patchesData = data;
                console.log(data);
                });
        }
    },
});