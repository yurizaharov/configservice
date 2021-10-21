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

})
