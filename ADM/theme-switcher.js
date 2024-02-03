document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');

    // Verifica se o modo noturno está ativado
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }

    // Adiciona um ouvinte de eventos para alternar entre os temas
    themeToggle.addEventListener('click', function () {
        if (document.body.classList.contains('dark')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });

    // Função para definir o tema
    function setTheme(theme) {
        document.body.className = theme;
    }
});
