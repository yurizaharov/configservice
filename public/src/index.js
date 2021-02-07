new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data() {
        return {
//            patchesData: [],
            servicesData: [],
//            headers: [
//                {
//                    text: 'Database',
//                    align: 'start',
//                    sortable: false,
//                    value: 'database',
//                },
//                { text: 'Liquibase patch', value: 'id' },
//                { text: 'Executed date', value: 'dateexecuted' },
//                { text: 'Author', value: 'author' },
//                { text: 'Exec type', value: 'exectype' },
//                { text: 'Processing', value: '`processingversion`' }
//            ],
            headers: [
                {
                    text: 'Service',
                    align: 'start',
                    sortable: false,
                    value: 'database',
                },
                { text: 'Liquibase patch', value: 'id' },
                { text: 'Processing', value: 'processingversion' },
                { text: 'BPS external', value: 'processingext' },
                { text: 'BPS internal', value: 'processingint' },
                { text: 'Mobile external', value: 'mobileext' },
                { text: 'Mobile internal', value: 'mobileint' }
            ],

        }
    },

    created() {
//        this.getPatchesData();
        this.getServicesData();
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
        },

        async getServicesData () {
            await fetch('/info')
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    this.servicesData = data;
                    console.log(data);
                });
        }

    },
});