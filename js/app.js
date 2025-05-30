document.addEventListener('DOMContentLoaded', function () {
    // Inicializa componentes Materialize (como o textarea auto-resize)
    M.AutoInit();

    const dateDisplay = document.getElementById('date-display');
    const timeDisplay = document.getElementById('time-display');
    const diaryForm = document.getElementById('diaryForm');
    const feedbackMessage = document.getElementById('feedback-message');
    const saveButton = diaryForm.querySelector('button[type="submit"]');

    // Função para atualizar o relógio
    function updateClock() {
        const now = new Date();
        const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = now.toLocaleDateString('pt-BR', optionsDate);
        timeDisplay.textContent = now.toLocaleTimeString('pt-BR');
    }

    // Atualiza o relógio imediatamente e depois a cada segundo
    updateClock();
    setInterval(updateClock, 1000);

    // Manipulador de submissão do formulário
    diaryForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Previne submissão padrão

        const titulo = document.getElementById('titulo').value.trim();
        const texto = document.getElementById('texto').value.trim();

        if (!titulo || !texto) {
            M.toast({ html: 'Por favor, preencha o título e o texto.', classes: 'red rounded' });
            return;
        }

        // Feedback visual
        saveButton.disabled = true;
        saveButton.innerHTML = 'Salvando... <i class="material-icons right">hourglass_empty</i>';
        feedbackMessage.textContent = '';
        feedbackMessage.className = 'center-align';


        fetch('backend/salvar_entrada.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo: titulo, texto: texto })
        })
            .then(response => {
                if (!response.ok) {
                    // Tenta ler a mensagem de erro do backend se houver
                    return response.json().then(errData => {
                        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
                    }).catch(() => { // Se não conseguir ler JSON do erro, usa status
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
                    diaryForm.reset();
                    // Força o label a flutuar novamente após o reset (Materialize issue)
                    M.updateTextFields();
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
                // Limpa a mensagem de feedback após alguns segundos
                setTimeout(() => {
                    feedbackMessage.textContent = '';
                    feedbackMessage.className = 'center-align';
                }, 5000);
            });
    });
});