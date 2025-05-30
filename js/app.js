document.addEventListener('DOMContentLoaded', function () {
    // Inicializa componentes Materialize (exceto o textarea que será do TinyMCE)
    M.FormSelect.init(document.querySelectorAll('select'));
    M.updateTextFields(); // Para labels de inputs de texto

    const dateDisplay = document.getElementById('date-display');
    const timeDisplay = document.getElementById('time-display');
    const diaryForm = document.getElementById('diaryForm');
    const feedbackMessage = document.getElementById('feedback-message');
    const saveButton = diaryForm.querySelector('button[type="submit"]');
    const titleInput = document.getElementById('titulo');

    // Inicialização do TinyMCE
    tinymce.init({
        selector: 'textarea#texto',
        plugins: 'autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste help wordcount autoresize',
        toolbar: 'undo redo | styles | bold italic underline strikethrough | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | link image media | \
                  forecolor backcolor removeformat | charmap | code fullscreen preview | help',
        menubar: 'file edit view insert format tools table help', // Habilita uma menubar mais completa
        height: 900, // Aumentado de 350 para 550. Ajuste conforme necessário.
        autoresize_bottom_margin: 50,
        placeholder: "Escreva seus pensamentos aqui...", // Placeholder para o editor
        setup: function (editor) {
            editor.on('init', function () {
                // Torna o textarea original visível após o TinyMCE ser carregado
                // A regra CSS já deve estar cuidando disso ao esconder o original
                // e o TinyMCE criar sua própria interface.
                document.getElementById('texto').style.visibility = 'visible';
            });
            editor.on('change', function () {
                editor.save(); // Atualiza o conteúdo do textarea original (útil para validação HTML5 se ainda ativa)
            });
        },
        // Para um tema mais próximo do Material, você pode explorar skins do TinyMCE
        // ou configurar o content_css. Exemplo básico:
        content_style: `
            body { font-family: 'Roboto', sans-serif; line-height: 1.6; }
            p { margin: 0 0 10px 0; }
        `
    });


    function updateClock() {
        const now = new Date();
        const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = now.toLocaleDateString('pt-BR', optionsDate);
        timeDisplay.textContent = now.toLocaleTimeString('pt-BR');
    }

    updateClock();
    setInterval(updateClock, 1000);

    diaryForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const titulo = titleInput.value.trim();
        // Obter conteúdo do TinyMCE
        const textoContent = tinymce.get('texto').getContent();

        if (!titulo || !textoContent.trim()) {
            M.toast({ html: 'Por favor, preencha o título e o conteúdo do diário.', classes: 'red rounded' });
            return;
        }

        saveButton.disabled = true;
        saveButton.innerHTML = 'Salvando... <i class="material-icons right">hourglass_empty</i>';
        feedbackMessage.textContent = '';
        feedbackMessage.className = 'center-align';

        fetch('backend/salvar_entrada.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo: titulo, texto: textoContent }) // Envia o HTML do TinyMCE
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => {
                        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
                    }).catch(() => {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    feedbackMessage.textContent = 'Entrada salva com sucesso! 🎉';
                    feedbackMessage.classList.add('success');
                    M.toast({ html: 'Entrada salva com sucesso!', classes: 'green rounded' });

                    // Limpar formulário
                    titleInput.value = '';
                    tinymce.get('texto').setContent(''); // Limpa o editor

                    // Atualiza os labels do Materialize (especialmente para o título)
                    M.updateTextFields();
                    // Foca no título para nova entrada
                    titleInput.focus();

                } else {
                    feedbackMessage.textContent = 'Erro: ' + (data.message || 'Não foi possível salvar a entrada.');
                    feedbackMessage.classList.add('error');
                    M.toast({ html: 'Erro: ' + (data.message || 'Não foi possível salvar.'), classes: 'red rounded' });
                }
            })
            .catch(error => {
                console.error('Erro na requisição Fetch:', error);
                feedbackMessage.textContent = 'Erro de comunicação com o servidor: ' + error.message;
                feedbackMessage.classList.add('error');
                M.toast({ html: 'Erro de comunicação: ' + error.message, classes: 'red rounded' });
            })
            .finally(() => {
                saveButton.disabled = false;
                saveButton.innerHTML = 'Salvar <i class="material-icons right">save</i>';
                setTimeout(() => {
                    feedbackMessage.textContent = '';
                    feedbackMessage.className = 'center-align';
                }, 5000);
            });
    });
});