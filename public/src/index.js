new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data() {
        return {
            servicesData: [],
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
        this.getServicesData();
    },

    computed: {},

    methods: {

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
    }
})

new Vue({
        el: "#benio",
        vuetify: new Vuetify(),
        data() {
            return {
                benioData: [],
                headers: [
                    {
                        text: 'Service',
                        align: 'start',
                        sortable: false,
                        value: 'dataBase',
                    },
                    { text: 'Liquibase patch', value: 'id' },
                    { text: 'Version', value: 'beniobmsVersion' },
                    { text: 'beniobms Ext', value: 'beniobmsExt' },
                    { text: 'beniobms Int', value: 'beniobmsInt' }
                ],

            }
        },

        created() {
            this.getBenioData();
        },

        computed: {},

        methods: {

            async getBenioData () {
                await fetch('/liquibeniobms')
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        this.benioData = data;
                        console.log(data);
                    });
            }

        }

    });