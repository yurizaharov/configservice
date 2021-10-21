new Vue({
    el: "#cards",
    vuetify: new Vuetify(),
    data() {
        return {
            cardsData: [],
            headers: [
                {
                    text: 'Service',
                    align: 'start',
                    sortable: false,
                    value: 'name',
                },
                { text: 'Min number', value: 'min_number' },
                { text: 'Max number', value: 'max_number' },
            ],

        }
    },

    created() {
        this.getCardsData();
    },

    computed: {},

    methods: {

        async getCardsData () {
            await fetch('/api/configs/cards')
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    this.cardsData = data;
                    console.log(data);
                });
        }

    }

})