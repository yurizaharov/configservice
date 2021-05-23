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
                    value: 'dataBase',
                },
                { text: 'Liquibase patch', value: 'id' },
                { text: 'Processing', value: 'processingVersion' },
                { text: 'BPS external', value: 'processingExt' },
                { text: 'BPS http access', value: 'processingInt' },
                { text: 'Mobile external', value: 'mobileExt' },
            ],

        }
    },

    created() {
        this.getServicesData();
    },

    computed: {},

    methods: {

        async getServicesData () {
            await fetch('/liquiprocessing')
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