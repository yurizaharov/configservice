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
