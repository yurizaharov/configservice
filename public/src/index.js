new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data() {
        return {
            patchesData: [],
            headers: [
                {
                    text: 'Database',
                    align: 'start',
                    sortable: false,
                    value: 'database',
                },
                { text: 'Liquibase patch', value: 'id' },
                { text: 'Exetuted date', value: 'dateexecuted' },
                { text: 'Author', value: 'author' },
                { text: 'Exec type', value: 'exectype' }
            ],
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