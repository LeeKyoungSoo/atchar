let login = {
    init : function () {
        login.button_init();
    },

    config : function () {
        return false;
    },

    button_init : function () {
        $("#idSearch").on("click", function(event) {
            modal({
                type: 'primary',
                title: '안내',
                text: '준비중입니다.',
                center: false,
            });
        });
    }
}